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



// Função para gerar um número aleatório de 3 dígitos
function generateRandomNumber() {
    return Math.floor(Math.random() * 900) + 100; // Gera um número aleatório entre 100 e 999
}

// Função para inverter a string
function reverseString(str) {
    return str.split('').reverse().join('');
}

// Função para codificar o CNPJ/CPF antes de salvar
function encode(cod) {
    const randomNumber = generateRandomNumber(); // Gerar número aleatório de 3 dígitos
    const codRandom = cod.replace('.', `.${randomNumber}.`); // Inserir número aleatório
    const valorComPrefixo = "fgl" + reverseString(codRandom || "") + "1969"; // Inverter string e adicionar prefixo
    return Buffer.from(valorComPrefixo).toString('base64'); // Codificar em base64
}


async function postNewSerial(serial) {
    await ensureDBInitialized();
    try {
        const tamanhoNovaSerial = serial.serialKey.length;

        // Verifica se existe serial com tamanho 18 ou menor que a nova
        const existingInvalid = db.prepare(
            `SELECT userID FROM Serial_Key WHERE LENGTH(serialKey) <= ?`
        ).all(18); // ou tamanhoNovaSerial, se quiser comparar com o tamanho da nova

        if (existingInvalid.length > 0) {
            // Exclui completamente os usuários encontrados
            const deleteStmt = db.prepare(
                `DELETE FROM Serial_Key WHERE LENGTH(serialKey) <= ?`
            );
            deleteStmt.run(18); // ou tamanhoNovaSerial

            console.log(`Removidos ${existingInvalid.length} registro(s) com chave inválida.`);
        }

        // Agora insere a nova serial normalmente
        const insertQuery = `
            INSERT INTO Serial_Key (
                userID, serialKey, startedDate, expirationDate, ativado
            ) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)
        `;

        const stmt = db.prepare(insertQuery);
        const result = stmt.run(
            serial.userID,
            encode(serial.serialKey),
            serial.ativado
        );

        return { insertId: result.lastInsertRowid };
    } catch (err) {
        console.error('Erro ao inserir a Serial:', err.message);
        throw err;
    }
}


function getSerial() {
     ensureDBInitialized();
    try {
        const rows =  db.prepare('SELECT * FROM Serial_Key').all();
        return rows;
    } catch (error) {
        console.error('Erro ao executar a consulta do serial:', error);
        throw error;
    }
};



async function updateSerial(serial) {
  await ensureDBInitialized();
 
  try {
    const query = `
      UPDATE Serial_Key
      SET ativado = ?
      WHERE userID = ?
    `;

    const result = db.prepare(query).run(
      serial.ativado,
      serial.userID
    );

    console.log('Registro atualizado com sucesso:', result.changes);
    return result.changes;
  } catch (error) {
    console.error('Erro ao atualizar termos de uso:', error.message);
    throw error;
  }
}





module.exports = {
    postNewSerial,
    getSerial,
    updateSerial,
};

