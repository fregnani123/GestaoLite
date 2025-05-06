
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


async function getAtivacaoMysql() {
    await ensureDBInitialized();

    try {
        const rows = db.prepare('SELECT * FROM serial_key').all();
        return rows;
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        throw error;
    }
}

// Função para verificar se um valor é válido (número, string, bigint, buffer ou null)
function isValidData(value) {
    return ['number', 'string', 'bigint'].includes(typeof value) || value === null || Buffer.isBuffer(value);
}

// Função para inserir na tabela serial_key
async function postAtivacao(serial_key) {
    await ensureDBInitialized();

    try {
        console.log('Dados recebidos para ativação:', serial_key);

        // Verificar se os valores são válidos
        if (!isValidData(serial_key.userID) || !isValidData(serial_key.serialKey) || 
            !isValidData(serial_key.startedDate) || !isValidData(serial_key.expirationDate) || 
            !isValidData(serial_key.ativado)) {
            console.log('Tipos dos dados:', {
                userID: typeof serial_key.userID,
                serialKey: typeof serial_key.serialKey,
                startedDate: typeof serial_key.startedDate,
                expirationDate: typeof serial_key.expirationDate,
                ativado: typeof serial_key.ativado,
            });
            throw new Error('Dados inválidos fornecidos para a ativação.');
        }

        // Converter valor booleano para inteiro
        serial_key.ativado = serial_key.ativado ? 1 : 0;

        const countQuery = 'SELECT COUNT(*) as count FROM serial_key';
        const { count } = db.prepare(countQuery).get();

        if (count > 0) {
            console.log('Tabela ativado já contém registros.');
            return;
        }

        const query = `
            INSERT INTO serial_key (userID, serialKey, startedDate, expirationDate, ativado)
            VALUES (?, ?, ?, ?, ?)
        `;

        const result = db.prepare(query).run(
            serial_key.userID,
            serial_key.serialKey,
            serial_key.startedDate,
            serial_key.expirationDate,
            serial_key.ativado
        );

        console.log('Registro inserido com sucesso:', result.lastInsertRowid);
        return result.lastInsertRowid;
    } catch (error) {
        console.error('Erro ao inserir ativação:', error.message);
        throw error;
    }
}

// Função para atualizar dados de ativação
async function UpdateAtivacao(serial_key) {
    await ensureDBInitialized();
    try {
        const query = `
            UPDATE serial_key
            SET startedDate = ?, expirationDate = ?, ativado = ?
            WHERE serialKey = ?
        `;

        const result = db.prepare(query).run(
            serial_key.startedDate,
            serial_key.expirationDate,
            serial_key.ativado ? 1 : 0,
            serial_key.serialKey
        );

        console.log('Registro atualizado com sucesso:', result.changes);
        return result.changes;
    } catch (error) {
        console.error('Erro ao atualizar sqlite:', error.message);
        throw error;
    }
}

module.exports = {
    getAtivacaoMysql,
    postAtivacao,
    UpdateAtivacao,
};
