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


async function registrarCrediario(
    vendaId,
    clienteId,
    valorTotal,
    numParcelas,
    dataPrimeiroVencimento,
    condicao,
    tipoPagamento,
    entrada = 0
) {
    await ensureDBInitialized();

    console.log("Dados recebidos:");
    console.log({
        vendaId,
        clienteId,
        valorTotal,
        numParcelas,
        dataPrimeiroVencimento,
        condicao,
        entrada,
        tipoPagamento
    });

    const parcelas = [];

    // ----------- Ajuste da entrada válida -------------
    const entradaValida = Number(entrada) > 0 && tipoPagamento !== "Sem Entrada";

    const valorParcelado = entradaValida ? (valorTotal - entrada) : valorTotal;
    const parcelasRestantes = entradaValida ? (numParcelas - 1) : numParcelas;
    const valorBase = Math.floor((valorParcelado / parcelasRestantes) * 100) / 100;
    let diferenca = (valorParcelado - valorBase * parcelasRestantes).toFixed(2);

    // intervalos configurados
    const intervalos = {
        "30": 30,
        "15": 15,
        "7": 7,
        "entrada+30": 30,
        "entrada+15": 15,
        "entrada+7": 7,
    };
    const intervalo = intervalos[condicao] || 30;
    console.log("Intervalo escolhido:", intervalo);

    let parcelaIndex = 1;

    // ----------- Helpers de data sem UTC -------------
    function parseYMDLocal(ymd) {
        const [y, m, d] = String(ymd).split("-").map(Number);
        return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
    }
    function formatDateToYMD(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }
    function addDaysLocal(date, days) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 0, 0, 0, 0);
    }
    function todayLocal() {
        const n = new Date();
        return new Date(n.getFullYear(), n.getMonth(), n.getDate(), 0, 0, 0, 0);
    }

    const ehEntradaMais = String(condicao || "").startsWith("entrada+");

    // ----------- PARCELA DE ENTRADA -------------
    if (entradaValida) {
        const hoje = todayLocal();
        const entradaParcela = {
            venda_id: vendaId,
            cliente_id: clienteId,
            parcela_numero: parcelaIndex++,
            valor_parcela: Number(entrada).toFixed(2),
            data_vencimento: formatDateToYMD(hoje),
            data_pagamento: formatDateToYMD(hoje),
            status: "Paga",
            tipo_entrada: tipoPagamento,
            condicao_vencimento: condicao,
        };
        parcelas.push(entradaParcela);
        console.log("Parcela de entrada:", entradaParcela);
    }

    // ----------- BASE DE VENCIMENTO -------------
    let baseVencimento;
    if (entradaValida && ehEntradaMais) {
        baseVencimento = addDaysLocal(todayLocal(), intervalo);
    } else {
        baseVencimento = parseYMDLocal(dataPrimeiroVencimento);
    }

    // ----------- DEMAIS PARCELAS -------------
    let vencimento = new Date(
        baseVencimento.getFullYear(),
        baseVencimento.getMonth(),
        baseVencimento.getDate() + (entradaValida ? 1 : 0),
        0, 0, 0, 0
    );

    for (let i = 0; i < parcelasRestantes; i++) {
        if (i > 0) {
            vencimento = addDaysLocal(vencimento, intervalo);
        }

        let valorParcelaFinal = valorBase;
        if (i === parcelasRestantes - 1) {
            valorParcelaFinal = (valorBase + Number(diferenca)).toFixed(2);
        } else {
            valorParcelaFinal = valorBase.toFixed(2);
        }

        const parcela = {
            venda_id: vendaId,
            cliente_id: clienteId,
            parcela_numero: parcelaIndex++,
            valor_parcela: valorParcelaFinal,
            data_vencimento: formatDateToYMD(vencimento),
            data_pagamento: null,
            status: "PENDENTE",
            tipo_entrada: tipoPagamento,
            condicao_vencimento: condicao,
        };
        parcelas.push(parcela);
    }

    console.log("Todas as parcelas geradas:", parcelas);

    // ----------- INSERÇÃO NO BANCO -------------
    const stmt = db.prepare(`
        INSERT INTO crediario (
            cliente_id, venda_id, parcela_numero, 
            valor_parcela, data_vencimento, data_pagamento, 
            status, tipo_entrada, condicao_vencimento
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const parcela of parcelas) {
        console.log("Inserindo parcela:", parcela);
        stmt.run(
            parcela.cliente_id,
            parcela.venda_id,
            parcela.parcela_numero,
            parcela.valor_parcela,
            parcela.data_vencimento,
            parcela.data_pagamento,
            parcela.status,
            parcela.tipo_entrada,
            parcela.condicao_vencimento
        );
    }

    return parcelas.length;
}


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



function decode(encoded) {
    try {
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8');

        if (!decoded.startsWith("fgl") || !decoded.endsWith("1969")) {
            return encoded;
        }

        const trimmed = decoded.slice(3, -4);
        const reversed = reverseString(trimmed);
        const parts = reversed.split('.');


        if (parts.length >= 3) {
            parts.splice(1, 1);
        }

        return parts.join('.');
    } catch (err) {
        console.error("Erro ao decodificar:", err);
        return encoded;
    }
}

async function getCrediariosMesVigente(ano, mes) {
    await ensureDBInitialized();

    try {
        const query = `
            SELECT c.cliente_id, c.nome, c.cpf, c.credito_limite,
                   c.credito_utilizado, cre.crediario_id, cre.venda_id, 
                   cre.parcela_numero, cre.valor_parcela, cre.data_vencimento, 
                   cre.data_pagamento, cre.status, cre.multa_atraso
            FROM cliente c
            INNER JOIN crediario cre ON c.cliente_id = cre.cliente_id
            WHERE strftime('%Y', cre.data_vencimento) = ?  -- filtra pelo ano
              AND strftime('%m', cre.data_vencimento) = ?; -- filtra pelo mês
        `;

        const stmt = db.prepare(query);
        const rows = stmt.all(String(ano), String(mes).padStart(2, '0'));

        // decodifica CPF antes de retornar
        const decodedRows = rows.map(r => ({
            ...r,
            cpf: decode(r.cpf)
        }));

        return decodedRows;
    } catch (error) {
        console.error('Erro ao buscar crediários:', error.message);
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


module.exports = { registrarCrediario, getCrediarioByCPF, updateCrediario, getCrediariosMesVigente,  getTaxas, updateTaxas, getCrediarioNumeroPed };
