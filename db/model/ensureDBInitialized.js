
const path = require('path');
const Database = require('better-sqlite3'); 
const { app } = require('electron');
const initializeDB = require('./queries'); 

const {insertSubGrupo, insertGrupo, insertTamanhoLetras, insertTamanhoNumeros,
    insertUnidadeMassa, insertUnidadeVolume, insertUnidadeComprimento, insertUnidadeEstoque, insertFornecedorPadrao, insertCorProduto, insertClienteDefault,insertTaxaDefault
} = require(path.join(__dirname, './initializeDB'));


// Obtém o caminho dinâmico para o diretório %APPDATA% e cria uma subpasta para o aplicativo
const appDataPath = app.getPath('appData');
const appDBPath = path.join(appDataPath, 'electronmysql','db'); // Subpasta do aplicativo

// Verifica se a pasta do aplicativo existe, caso contrário, cria
const fs = require('fs');
if (!fs.existsSync(appDBPath)) {
    fs.mkdirSync(appDBPath);
}

// Caminho completo para o banco de dados
const dbPath = path.join(appDBPath, 'gestaolite.db');

// Inicializa o banco de dados
const db = new Database(dbPath, { verbose: console.log });

// Habilitar as chaves estrangeiras
db.pragma('foreign_keys = ON');

console.log('Chaves estrangeiras ativadas.');

let dbInitialized = false;
let dbTableInitialized = false;

// Função para verificar se uma tabela já tem dados
async function hasData(tableName) {
    try {
        const row = db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get();
        return row.count > 0; // Retorna true se houver dados
    } catch (err) {
        console.error('Erro ao verificar dados na tabela:', err);
        throw err;
    }
}

// Função para inicializar o banco de dados
async function ensureDBInitialized() {
    if (!dbInitialized) {
        console.log('Inicializando banco de dados...');
        try {
            await initializeDB(db); // Passando a instância do banco SQLite
            dbInitialized = true;
            console.log('Banco de dados inicializado.');
        } catch (error) {
            console.error('Erro ao inicializar o banco de dados:', error);
        }
    }

    if (dbInitialized && !dbTableInitialized) {
        console.log('Verificando e inserindo dados iniciais nas tabelas...');
        try {
            // Verifica se as tabelas possuem dados antes de inserir
            const tables = [
                { name: 'grupo', insertFunc: insertGrupo },
                { name: 'sub_grupo', insertFunc: insertSubGrupo },
                { name: 'tamanho_letras', insertFunc: insertTamanhoLetras },
                { name: 'tamanho_numero', insertFunc: insertTamanhoNumeros },
                { name: 'unidade_massa', insertFunc: insertUnidadeMassa },
                { name: 'medida_volume', insertFunc: insertUnidadeVolume },
                { name: 'unidade_comprimento', insertFunc: insertUnidadeComprimento },
                { name: 'unidade_estoque', insertFunc: insertUnidadeEstoque },
                { name: 'fornecedor', insertFunc: insertFornecedorPadrao },
                { name: 'cor_produto', insertFunc: insertCorProduto },
                { name: 'cliente', insertFunc: insertClienteDefault },
                { name: 'taxa', insertFunc: insertTaxaDefault }
            ];

            for (let table of tables) {
                const dataExists = await hasData(table.name);
                if (!dataExists) {
                    console.log(`Inserindo dados na tabela ${table.name}...`);
                    await table.insertFunc(db);
                } else {
                    console.log(`Dados na tabela ${table.name} já existem, pulando inserção.`);
                }
            }

            console.log('Dados iniciais verificados e inseridos, se necessário.');
            dbTableInitialized = true;
        } catch (error) {
            console.error('Erro ao verificar e inserir dados iniciais nas tabelas:', error);
        }
    }
}

// Fecha o banco de dados ao desligar o servidor
process.on('SIGINT', () => {
    console.log('Servidor está sendo desligado...');
    db.close();
    console.log('Banco de dados SQLite fechado com sucesso.');
    process.exit(0); // Sai do processo com sucesso
});


module.exports = {
    ensureDBInitialized,
};
