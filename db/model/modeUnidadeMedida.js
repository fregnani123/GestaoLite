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


async function getTamanhoLetras() {
    await ensureDBInitialized();
    try {
        const rows = db.prepare('SELECT * FROM tamanho_letras').all();
        return rows;
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        throw error;
    }
}

async function getTamanhoNumeros() {
    await ensureDBInitialized();
    try {
        const rows = db.prepare('SELECT * FROM tamanho_numero').all();
        return rows;
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        throw error;
    }
}

async function getUnidadeMassa() {
    await ensureDBInitialized();
    try {
        const rows = db.prepare('SELECT * FROM unidade_massa').all();
        return rows;
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        throw error;
    }
}

async function getMedidaVolume() {
    await ensureDBInitialized();
    try {
        const rows = db.prepare('SELECT * FROM medida_volume').all();
        return rows;
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        throw error;
    }
}

async function getUnidadeComprimento() {
    await ensureDBInitialized();
    try {
        const rows = db.prepare('SELECT * FROM unidade_comprimento').all();
        return rows;
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        throw error;
    }
}

async function getCorProduto() {
    await ensureDBInitialized();
    try {
        const rows = db.prepare('SELECT * FROM cor_produto').all();
        return rows;
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        throw error;
    }
}

// Função para inserir uma nova cor de produto
async function postNewCor(newCor) {
    await ensureDBInitialized();
    try {
        // Verifica se já existe uma cor com o mesmo nome
        const checkQuery = 'SELECT cor_produto_id FROM cor_produto WHERE nome_cor_produto = ?';
        const row = db.prepare(checkQuery).get(newCor.nome_cor_produto);
        
        if (row) {
            throw new Error('Esta cor com o mesmo nome já existe.');
        }

        const insertQuery = 'INSERT INTO cor_produto (nome_cor_produto) VALUES (?)';
        const stmt = db.prepare(insertQuery);
        const result = stmt.run(newCor.nome_cor_produto);
        
        return result.lastInsertRowid;
    } catch (error) {
        console.error('Erro ao inserir a cor de produto:', error.message);
        throw error;
    }
};

module.exports = {
    getTamanhoLetras,
    getTamanhoNumeros,
    getUnidadeMassa,
    getMedidaVolume,
    getUnidadeComprimento,
    getCorProduto,
    postNewCor,
};
