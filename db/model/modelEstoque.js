
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



 function getUnidadeEstoque() {
  ensureDBInitialized();
    try {
        const rows = db.prepare('SELECT * FROM unidade_estoque').all();
        return rows;
    } catch (error) {
        console.error('Erro ao executar a consulta:', error.message);
        throw error;
    }
}

// Função para atualizar o estoque de um produto
async function UpdateEstoque(produto) {
    await ensureDBInitialized();
    try {
        const query = `
            UPDATE produto
            SET quantidade_estoque = ?, quantidade_vendido = ?
            WHERE codigo_ean = ?
        `;

        const result = db.prepare(query).run(
            produto.quantidade_estoque,
            produto.quantidade_vendido,
            produto.codigo_ean
        );

        console.log('Registro Estoque e qtd vendido atualizado com sucesso:', result.changes);
        return result.changes;
    } catch (error) {
        console.error('Erro ao atualizar MySQL:', error.message);
        throw error;
    }
}

// Função para inserir controle de estoque
async function postControleEstoque(controleEstoque) {
    await ensureDBInitialized();
    try {
        // Verifica se o controle_estoque com o mesmo controle_estoque_id já existe
        const checkQuery = 'SELECT controle_estoque_id FROM controle_estoque WHERE controle_estoque_id = ?';
        const row = db.prepare(checkQuery).get(controleEstoque.controle_estoque_id);
        
        if (row) {
            throw new Error('Um controle_estoque com o mesmo controle_estoque_id já existe.');
        } 

        const insertQuery = `
            INSERT INTO controle_estoque (
                produto_id,
                qtde_movimentada,
                preco_compra_anterior,
                preco_compra_atual,
                preco_markup_anterior,
                preco_markup_atual,
                preco_venda_anterior,
                preco_venda_atual,
                situacao_movimento,
                motivo_movimentacao,
                numero_compra_fornecedor,
                venda_id,
                data_movimentacao
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const stmt = db.prepare(insertQuery);
        const result = stmt.run(
            controleEstoque.produto_id,
            controleEstoque.qtde_movimentada,
            controleEstoque.preco_compra_anterior,
            controleEstoque.preco_compra_atual,
            controleEstoque.preco_markup_anterior || null,
            controleEstoque.preco_markup_atual || null,
            controleEstoque.preco_venda_anterior,
            controleEstoque.preco_venda_atual,
            controleEstoque.situacao_movimento,
            controleEstoque.motivo_movimentacao,
            controleEstoque.numero_compra_fornecedor || null,
            controleEstoque.venda_id || null,
            controleEstoque.data_movimentacao
        );

        return { insertId: result.lastInsertRowid };
    } catch (error) {
        console.error('Erro ao inserir no controle_estoque:', error.message);
        throw { status: 400, message: error.message };
    }
};


module.exports = {
    getUnidadeEstoque,
    UpdateEstoque,
    postControleEstoque
};
