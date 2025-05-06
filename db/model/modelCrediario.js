const path = require('path');
const Database = require('better-sqlite3');
const { app } = require('electron');

const { ensureDBInitialized } = require(path.join(__dirname, './ensureDBInitialized'));

// Obtém o caminho dinâmico para o diretório %APPDATA% e cria uma subpasta para o aplicativo
const appDataPath = app.getPath('appData');
const appDBPath = path.join(appDataPath, 'electronmysql', 'db'); // Subpasta do aplicativo

// Caminho completo para o banco de dados
const dbPath = path.join(appDBPath, 'gestaolite.db');

// Inicializa o banco de dados
const db = new Database(dbPath, { verbose: console.log });

// Habilitar as chaves estrangeiras
db.pragma('foreign_keys = ON');
console.log('Chaves estrangeiras ativadas.');


async function registrarCrediario(vendaId, clienteId, valorTotal, numParcelas, dataPrimeiroVencimento) {

    await ensureDBInitialized

    const parcelas = [];
    // const valorParcela = (valorTotal / numParcelas).toFixed(2);
    const dataBase = new Date(dataPrimeiroVencimento);

    for (let i = 1; i <= numParcelas; i++) {
        const dataVencimento = new Date(dataBase);
        dataVencimento.setMonth(dataBase.getMonth() + (i - 1));

        parcelas.push({
            venda_id: vendaId,
            cliente_id: clienteId,
            parcela_numero: i,
            valor_parcela: valorTotal,
            data_vencimento: dataVencimento.toISOString().split('T')[0],
            status: 'PENDENTE',
        });
    }

    const stmt = db.prepare(`
        INSERT INTO crediario (cliente_id, venda_id, parcela_numero, valor_parcela, data_vencimento, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const parcela of parcelas) {
        stmt.run(
            parcela.cliente_id,
            parcela.venda_id,
            parcela.parcela_numero,
            parcela.valor_parcela,
            parcela.data_vencimento,
            parcela.status
        );
    }

    return parcelas.length; // Retorna o número de parcelas inseridas
};

function generateRandomNumber(cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    let sum = 0;
    for (let i = 0; i < cleanCpf.length; i++) {
        sum += cleanCpf.charCodeAt(i);
    }
    return (sum % 900) + 100; 
}

function reverseString(str) {
    return str.split('').reverse().join('');
}

// Função para codificar o CNPJ/CPF antes de salvar
function encode(cod) {
    const randomNumber = generateRandomNumber(cod); 
    const codRandom = cod.replace('.', `.${randomNumber}.`);
    const valorComPrefixo = "fgl" + reverseString(codRandom || "") + "1969";
    return Buffer.from(valorComPrefixo).toString('base64');
}

async function getCrediarioByCPF(cpf) {
    await ensureDBInitialized();

    try {
        cpf = encode(cpf);  // Remove qualquer caractere não numérico

        const query = `
            SELECT c.cliente_id, c.nome, c.cpf, c.credito_limite,
            c.credito_utilizado,cre.crediario_id, cre.venda_id, cre.parcela_numero, 
                   cre.valor_parcela, cre.data_vencimento, cre.data_pagamento, cre.status, cre.multa_atraso
            FROM cliente c
            INNER JOIN crediario cre ON c.cliente_id = cre.cliente_id
            WHERE c.cpf= ?;
        `;

        const stmt = db.prepare(query);
        const rows = stmt.all(cpf);
        return rows;
    } catch (error) {
        console.error('Erro ao executar a consulta:', error.message);
        throw error;
    }
}

async function getCrediarioNumeroPed(numero_pedido) {
    await ensureDBInitialized();

    try {

        const query = `
            SELECT c.cliente_id, c.nome, c.cpf, c.credito_limite,
            c.credito_utilizado,cre.crediario_id, cre.venda_id, cre.parcela_numero, 
                   cre.valor_parcela, cre.data_vencimento, cre.data_pagamento, cre.status, cre.multa_atraso
            FROM cliente c
            INNER JOIN crediario cre ON c.cliente_id = cre.cliente_id
            WHERE cre.venda_id= ?;
        `;

        const stmt = db.prepare(query);
        const rows = stmt.all(numero_pedido);
        return rows;
    } catch (error) {
        console.error('Erro ao executar a consulta:', error.message);
        throw error;
    }
}

async function updateCrediario(dadosCrediario) {
    await ensureDBInitialized();

    try {
        const query = `
          UPDATE crediario 
          SET data_pagamento = ?, 
          status = ?,
          multa_atraso= ?
          WHERE crediario_id = ?;
        `;
        
        const result = db.prepare(query).run(
            dadosCrediario.data_pagamento,
            dadosCrediario.status,
            dadosCrediario.multa_atraso,
            dadosCrediario.crediario_id
        );

        console.log('Registro baixa parcela do crediario atualizado com sucesso:', result.changes);
        return result.changes;
    
    } catch (error) {
        console.error('Erro ao executar baixa crediario:', error.message);
        throw error;
    }

};


async function getCrediariosMesVigente() {
    await ensureDBInitialized();

    try {
        const query = `
            SELECT c.cliente_id, c.nome, c.cpf, c.credito_limite,
                   c.credito_utilizado, cre.crediario_id, cre.venda_id, 
                   cre.parcela_numero, cre.valor_parcela, cre.data_vencimento, 
                   cre.data_pagamento, cre.status, cre.multa_atraso
            FROM cliente c
            INNER JOIN crediario cre ON c.cliente_id = cre.cliente_id
            WHERE strftime('%Y-%m', cre.data_vencimento) = strftime('%Y-%m', 'now');
        `;

        const stmt = db.prepare(query);
        const rows = stmt.all();
        return rows;
    } catch (error) {
        console.error('Erro ao buscar crediários do mês vigente:', error.message);
        throw error;
    }
}

async function getCrediariosVencidos() {
    await ensureDBInitialized();
    try {
        const query = `
            SELECT c.cliente_id, c.nome, c.cpf, c.credito_limite,
                   c.credito_utilizado, cre.crediario_id, cre.venda_id, 
                   cre.parcela_numero, cre.valor_parcela, cre.data_vencimento, 
                   cre.data_pagamento, cre.status, cre.multa_atraso
            FROM cliente c
            INNER JOIN crediario cre ON c.cliente_id = cre.cliente_id
            WHERE cre.data_vencimento < date('now')  -- Usando 'date' para comparar apenas a data (sem o horário)
            AND cre.status = 'PENDENTE';  -- Filtra apenas os pendentes
        `;

        const stmt = db.prepare(query);
        const rows = stmt.all();
        return rows;
    } catch (error) {
        console.error('Erro ao buscar crediários pendentes e vencidos:', error.message);
        throw error;
    }
}

async function getTaxas() {
    await ensureDBInitialized();

    try {
        const query = `
            SELECT * FROM taxa
        `;

        const stmt = db.prepare(query);
        const rows = stmt.all();
        return rows;
    } catch (error) {
        console.error('Erro ao buscar crediários pendentes e vencidos:', error.message);
        throw error;
    }
}

async function updateTaxas(dadosTaxas) {
    await ensureDBInitialized();

    try {
        const query = `
          UPDATE taxa 
          SET 
          juros_parcela_acima = ?, 
          juros_crediario_venda = ?,
          valor_multa_atraso = ?,
          juros_crediario_atraso = ? 
          WHERE taxa_id = ?;
        `;

        const result = db.prepare(query).run(
            dadosTaxas.juros_parcela_acima,
            dadosTaxas.juros_crediario_venda,
            dadosTaxas.valor_multa_atraso,
            dadosTaxas.juros_crediario_atraso,
            dadosTaxas.taxa_id
        );

        console.log('Taxas do crediário atualizado com sucesso:', result.changes);
        return result.changes;
    
    } catch (error) {
        console.error('Erro ao executar atualizações taxas crediário:', error.message);
        throw error;
    }

};


module.exports = { registrarCrediario, getCrediarioByCPF, updateCrediario, getCrediariosMesVigente, getCrediariosVencidos, getTaxas,  updateTaxas, getCrediarioNumeroPed};
