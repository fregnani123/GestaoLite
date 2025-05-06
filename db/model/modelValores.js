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


// Função para atualizar valores de um produto
async function UpdateValores(produto) {
    await ensureDBInitialized();
    try {
        const query = `
            UPDATE produto
            SET preco_compra = ?, markup = ?, preco_venda = ?
            WHERE codigo_ean = ?
        `;

        const result = db.prepare(query).run(
            produto.preco_compra,
            produto.markup,
            produto.preco_venda,
            produto.codigo_ean
        );

        console.log('Registro valores atualizado com sucesso:', result.changes);
        return result.changes;
    } catch (error) {
        console.error('Erro ao atualizar MySQL:', error.message);
        throw error;
    }
}


module.exports = {
    UpdateValores
};
