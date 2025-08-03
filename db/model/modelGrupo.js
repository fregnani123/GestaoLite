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


function getGrupo() {
     ensureDBInitialized();
    try {
        const rows =  db.prepare('SELECT * FROM grupo').all();
        return rows;
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        throw error;
    }
}

 function getSubGrupo() {
    ensureDBInitialized();
    try {
        const rows = db.prepare('SELECT * FROM sub_grupo').all();
        return rows;
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        throw error;
    }
}

// Função para verificar se já existe um grupo com o mesmo nome
async function postNewProductGrupo(newGrupo) {
    await ensureDBInitialized();
    try {
        const checkQuery = 'SELECT grupo_id FROM grupo WHERE nome_grupo = ?';
        const existingGrupo = db.prepare(checkQuery).get(newGrupo.nome_grupo);

        if (existingGrupo) {
            throw new Error('Este Grupo com o mesmo nome já existe.');
        }

        const insertQuery = 'INSERT INTO grupo (nome_grupo) VALUES (?)';
        const result = db.prepare(insertQuery).run(newGrupo.nome_grupo);
        return result.lastInsertRowid;
    } catch (error) {
        console.error('Erro ao inserir o grupo:', error.message);
        throw error;
    }
}

// Função para verificar se já existe um sub-grupo com o mesmo nome
async function postNewProductSubGrupo(newSubGrupo) {
    await ensureDBInitialized();
    try {
        const checkQuery = 'SELECT sub_grupo_id FROM sub_grupo WHERE nome_sub_grupo = ?';
        const existingSubGrupo = db.prepare(checkQuery).get(newSubGrupo.nome_sub_grupo);

        if (existingSubGrupo) {
            throw new Error('Este sub-grupo com o mesmo nome já existe.');
        }

        const insertQuery = 'INSERT INTO sub_grupo (nome_sub_grupo) VALUES (?)';
        const result = db.prepare(insertQuery).run(newSubGrupo.nome_sub_grupo);
        return result.lastInsertRowid;
    } catch (error) {
        console.error('Erro ao inserir o sub-grupo:', error.message);
        throw error;
    }
}

// Função para inserir uma nova marca, verificando se já existe
async function postMarca(marca) {
    await ensureDBInitialized();
    try {
        const checkQuery = 'SELECT marca_id FROM marca WHERE marca_nome = ?';
        const existingMarca = db.prepare(checkQuery).get(marca.nome_marca);

        if (existingMarca) {
            throw new Error('Esta marca com o mesmo nome já existe.');
        }

        const insertQuery = 'INSERT INTO marca (marca_nome) VALUES (?)';
        const result = db.prepare(insertQuery).run(marca.nome_marca);
        return result.lastInsertRowid;
    } catch (error) {
        console.error('Erro ao inserir a marca:', error.message);
        throw error;
    }
}


module.exports = {
    postNewProductSubGrupo,
    postNewProductGrupo,
    getGrupo,
    getSubGrupo,
    postMarca
};
