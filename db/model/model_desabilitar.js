
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



async function desativarProdutoSistema(produto) {
    await ensureDBInitialized();
    try {
        const novoCodigoEAN = `${produto.codigo_ean_original}-DESATIVADO`;

        const query = `
            UPDATE produto
            SET 
                codigo_ean = ?,
                quantidade_estoque = ?,
                produto_ativado = ? 
            WHERE codigo_ean = ?
        `;

        const result = db.prepare(query).run(
            novoCodigoEAN,
            produto.quantidade_estoque,
            produto.produto_ativado,
            produto.codigo_ean_original
        );

        console.log('Produto desativado com sucesso. Linhas afetadas:', result.changes);
        return result.changes;
    } catch (error) {
        console.error('Erro ao desativar produto:', error.message);
        throw error;
    }
}




module.exports = {
    desativarProdutoSistema,
};
