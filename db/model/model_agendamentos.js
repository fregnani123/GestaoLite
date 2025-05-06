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


async function getAgendamento() {
    await ensureDBInitialized();
    try {
        const rows = db.prepare(`
            SELECT 
                agendamento.agendamento_id, 
                agendamento.data, 
                agendamento.hora, 
                agendamento.motivo, 
                agendamento.status, 
                agendamento.data_criacao, 
                agendamento.data_atualizacao, 
                cliente.cliente_id, 
                cliente.nome, 
                cliente.cpf
            FROM agendamento
            JOIN cliente ON agendamento.cliente_id = cliente.cliente_id
        `).all();
        return rows;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados SQLite ou executar a consulta de agendamento:', error);
        throw error;
    }
}

async function postNewAgendamento(agendamento) {
    await ensureDBInitialized();
    try {
        const insertQuery = `
            INSERT INTO agendamento (
                cliente_id,
                data,
                hora,
                motivo
            ) VALUES (?, ?, ?, ?)
        `;

        const result = db.prepare(insertQuery).run(
            agendamento.cliente_id, 
            agendamento.data, 
            agendamento.hora, 
            agendamento.motivo
        );

        return { insertId: result.lastInsertRowid };
    } catch (error) {
        console.error('Erro ao inserir agendamento:', error.message);
        throw { status: 400, message: error.message };
    }
}

async function statusAgendamento(status) {
    await ensureDBInitialized();
    try {
    
        const query = `
            UPDATE agendamento
            SET 
            data = ?,
            hora = ?, 
            status = ? 
            WHERE agendamento_id = ?
        `;

        const result = db.prepare(query).run(
            status.data,  
            status.hora,
            status.status,
            status.agendamento_id
        );

        console.log('Status agendamento atualizado com sucesso:', result.changes);
        return result.changes;
    } catch (error) {
        console.error('Erro ao atualizar status agendamento:', error.message);
        throw error;
    }
}


module.exports = {
    postNewAgendamento, 
    getAgendamento,
    statusAgendamento
};
