const path = require('path');
const Database = require('better-sqlite3'); 
const { app } = require('electron');

const { ensureDBInitialized } = require(path.join(__dirname, './ensureDBInitialized'));

// Obtém o caminho dinâmico para o diretório %APPDATA% e cria uma subpasta para o aplicativo
const appDataPath = app.getPath('appData');
const appDBPath = path.join(appDataPath, 'electronmysql','db'); // Subpasta do aplicativo

// Caminho completo para o banco de dados
const dbPath = path.join(appDBPath, 'gestaolite.db');

// Inicializa o banco de dados
const db = new Database(dbPath, { verbose: console.log });

// Habilitar as chaves estrangeiras
db.pragma('foreign_keys = ON');
console.log('Chaves estrangeiras ativadas.');



// Função para gerar um número aleatório de 3 dígitos
function generateRandomNumber(cpf) {
    // Soma os códigos char do CPF (após remover pontuação)
    const cleanCpf = cpf.replace(/\D/g, '');
    let sum = 0;
    for (let i = 0; i < cleanCpf.length; i++) {
        sum += cleanCpf.charCodeAt(i);
    }
    return (sum % 900) + 100; // Sempre entre 100 e 999
}


// Função para inverter a string
function reverseString(str) {
    return str.split('').reverse().join('');
}

// Função para codificar o CNPJ/CPF antes de salvar
function encode(cod) {
    const randomNumber = generateRandomNumber(cod); // ✅ passa o cod como argumento
    const codRandom = cod.replace('.', `.${randomNumber}.`); // ainda insere o número no CPF
    const valorComPrefixo = "fgl" + reverseString(codRandom || "") + "1969";
    return Buffer.from(valorComPrefixo).toString('base64');
}

async function getClientePorCPF(cpfEnviado) {
    await ensureDBInitialized();
    try {
        cpf = encode(cpfEnviado)
        const query = `SELECT * FROM cliente WHERE cpf = ?`;

        const stmt = db.prepare(query);
        const rows = stmt.all(cpf);
       
        return rows;
    } catch (error) {
        console.error('Erro ao buscar cliente por cpf:', error.message);
        throw error;
    }
}

async function postNewCliente(cliente) {
    await ensureDBInitialized;
    try {
        // Verifica se já existe um cliente com o mesmo CPF
        const checkQuery = db.prepare('SELECT cliente_id FROM cliente WHERE cpf = ?');
        const row = checkQuery.get(cliente.cpf);

        if (row) {
            throw new Error('Um cliente com o mesmo CPF já existe.');
        }

        const insertQuery = `
            INSERT INTO cliente (nome, cpf, data_nascimento, telefone, email, cep, 
            logradouro, numero, bairro, estado, cidade, observacoes, credito_limite,ocupacao)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const stmt = db.prepare(insertQuery);

        const result = stmt.run(
            cliente.nome,
            encode(cliente.cpf),
            cliente.data_nascimento,
            cliente.telefone ,
            cliente.email || null,
            cliente.cep ,
            cliente.logradouro,
            cliente.numero || null,
            cliente.bairro,
            cliente.estado,
            cliente.cidade,
            cliente.observacoes || null,
            cliente.credito_limite || 0.00,
            cliente.ocupacao,
        );

        return { insertId: result.lastInsertRowid };
    } catch (err) {
        console.error('Erro ao inserir cliente:', err);
        throw err;
    }
}


async function updateCliente(dadosCliente) {
    await ensureDBInitialized();
    try {
        const query = `
          UPDATE cliente 
          SET telefone = ?, 
              email = ?,
              cep = ?,
              logradouro = ?,
              numero = ?,
              bairro = ?,
              estado = ?,
              cidade = ?,
              credito_limite = ?,
              credito_utilizado = ?,
              ocupacao = ?
              
          WHERE cliente_id = ?;
        `;

        const result = db.prepare(query).run(
            dadosCliente.telefone,
            dadosCliente.email,
            dadosCliente.cep,
            dadosCliente.logradouro,
            dadosCliente.numero, // Estava faltando na sua query original
            dadosCliente.bairro,
            dadosCliente.estado,
            dadosCliente.cidade,
            dadosCliente.credito_limite,
            dadosCliente.credito_utilizado, // Adicionei pois estava na query
            dadosCliente.ocupacao,
            dadosCliente.cliente_id
        );

        console.log('Cliente atualizado com sucesso:', result.changes);
        return result.changes;
    
    } catch (error) {
        console.error('Erro ao executar alteração cliente:', error.message);
        throw error;
    }
}

function formatCurrency(value) {
    if (typeof value === "string") {
        // Remover espaços, "R$" e pontos de milhar
        value = value.replace(/[^0-9,.-]/g, "");

        // Se houver mais de um ponto ou vírgula, é um valor inválido
        if ((value.match(/\./g) || []).length > 1 || (value.match(/,/g) || []).length > 1) {
            return null;
        }

        // Converter para formato numérico correto
        // Se for no formato "2,000.50" ou "2.000,50", remover pontos de milhar e ajustar a vírgula decimal
        if (value.includes(",") && value.includes(".")) {
            value = value.replace(/\./g, ""); // Remover pontos de milhar
            value = value.replace(",", "."); // Converter vírgula decimal para ponto
        } else if (value.includes(",")) {
            value = value.replace(",", "."); // Caso seja "2000,50", apenas trocar a vírgula por ponto
        }

        // Converter para float
        const number = parseFloat(value);
        return isNaN(number) ? null : number;
    }
    
    return typeof value === "number" ? value : null;
}

async function updateCreditoCliente(dadosCliente) {
    await ensureDBInitialized();
    try {
        // Formatando os valores antes da atualização
        const creditoLimite = formatCurrency(dadosCliente.credito_limite);
        const creditoUtilizado = formatCurrency(dadosCliente.credito_utilizado);

        if (creditoLimite === null || creditoUtilizado === null) {
            throw new Error("Valores inválidos para crédito. Verifique os dados.");
        }

        const query = `
          UPDATE cliente 
          SET credito_limite = ?,
              credito_utilizado = ?
          WHERE cliente_id = ?;
        `;

        const result = db.prepare(query).run(
            creditoLimite,
            creditoUtilizado,
            dadosCliente.cliente_id
        );

        console.log('Cliente atualizado com sucesso:', result.changes);
        return result.changes;
    
    } catch (error) {
        console.error('Erro ao executar alteração cliente:', error.message);
        throw error;
    }
}


module.exports = {
    postNewCliente,
    getClientePorCPF,
    updateCliente,
    updateCreditoCliente
};
