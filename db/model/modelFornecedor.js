
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



function decode(encoded) {
    try {
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8');

        if (!decoded.startsWith("fgl") || !decoded.endsWith("1969")) {
            return encoded; // já está em formato normal, não precisa decodificar
        }

        const trimmed = decoded.slice(3, -4); // remove "fgl" e "1969"
        const reversed = reverseString(trimmed); // desfaz o reverse
        const parts = reversed.split('.');

        // Remove o número aleatório inserido entre os pontos
        if (parts.length >= 3) {
            parts.splice(1, 1); // remove o índice 1 (número aleatório)
        }

        return parts.join('.');
    } catch (err) {
        console.error("Erro ao decodificar:", err);
        return encoded;
    }
}


async function getFornecedor() {
    await ensureDBInitialized();
    try {
        const rows = db.prepare('SELECT * FROM fornecedor').all();

        const fornecedores = rows.map(row => {
            // Faça isso apenas para o campo de documento
            if (row.cnpj) {
                row.cnpj = decode(row.cnpj);
            }
            return row;
        });

        return fornecedores;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados SQLite ou executar a consulta de fornecedor:', error);
        throw error;
    }
}


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


async function postNewFornecedor(fornecedor) {
    await ensureDBInitialized();
    try {
        const existingFornecedor = db.prepare('SELECT fornecedor_id FROM fornecedor WHERE cnpj = ?').get(fornecedor.cnpj);
        if (existingFornecedor) {
            throw new Error('Um fornecedor com o mesmo CNPJ já existe.');
        }

        const insertQuery = `
        INSERT INTO fornecedor (
            cnpj, inscricao_estadual, razao_social, nome_fantasia,
            cep, cidade, bairro, uf, endereco,
            telefone, email, observacoes, pessoa, contribuinte, numero, 
            ramos_de_atividade, forma_de_Pgto, condicoes_Pgto 
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = db.prepare(insertQuery).run(
        encode(fornecedor.cnpj), 
        fornecedor.inscricao_estadual || null, 
        fornecedor.razao_social || null,
        fornecedor.nome_fantasia || null, 
        fornecedor.cep || null,
        fornecedor.cidade || null,
        fornecedor.bairro || null, 
        fornecedor.uf || null, 
        fornecedor.endereco || null,
        fornecedor.telefone || null, 
        fornecedor.email || null, 
        fornecedor.observacoes || null,
        fornecedor.pessoa || null, 
        fornecedor.contribuinte || null, 
        fornecedor.numero || null,
        fornecedor.ramos_de_atividade || null, 
        fornecedor.forma_de_Pgto || null, 
        fornecedor.condicoes_Pgto || null
    );
    
        return { insertId: result.lastInsertRowid };
    } catch (error) {
        console.error('Erro ao inserir fornecedor:', error.message);
        throw { status: 400, message: error.message };
    }
};


function isBase64EncodedCNPJ(cnpj) {
    try {
        const decoded = Buffer.from(cnpj, 'base64').toString('utf-8');
        return decoded.startsWith("fgl") && decoded.endsWith("1969");
    } catch {
        return false;
    }
}

async function updateFornecedor(dadosFornecedor) {
    await ensureDBInitialized();

    try {
        const cnpjOriginal = dadosFornecedor.cnpj;
        const cnpjCodificado = encode(cnpjOriginal);

        // Verifica se existe fornecedor com CNPJ puro
        const fornecedorExistenteOriginal = db
            .prepare(`SELECT fornecedor_id FROM fornecedor WHERE cnpj = ?`)
            .get(cnpjOriginal);

        const fornecedorExistenteCodificado = db
            .prepare(`SELECT fornecedor_id FROM fornecedor WHERE cnpj = ?`)
            .get(cnpjCodificado);

        let cnpjWhere;
        let precisaAtualizarCNPJ = false;

        if (fornecedorExistenteOriginal) {
            cnpjWhere = cnpjOriginal;
            precisaAtualizarCNPJ = true; // vamos atualizar o CNPJ para o codificado
        } else if (fornecedorExistenteCodificado) {
            cnpjWhere = cnpjCodificado;
        } else {
            throw new Error("CNPJ não encontrado no banco de dados.");
        }

        // Monta a query principal
        const query = `
            UPDATE fornecedor
            SET inscricao_estadual = ?, 
                razao_social = ?, 
                nome_fantasia = ?, 
                cep = ?, 
                cidade = ?, 
                bairro = ?, 
                uf = ?, 
                endereco = ?, 
                telefone = ?, 
                email = ?, 
                observacoes = ?, 
                pessoa = ?, 
                contribuinte = ?, 
                numero = ?, 
                ramos_de_atividade = ?, 
                forma_de_Pgto = ?, 
                condicoes_Pgto = ?,
                cnpj = ?
            WHERE cnpj = ?
        `;

        const result = db.prepare(query).run(
            dadosFornecedor.inscricao_estadual || null,
            dadosFornecedor.razao_social || null,
            dadosFornecedor.nome_fantasia || null,
            dadosFornecedor.cep || null,
            dadosFornecedor.cidade || null,
            dadosFornecedor.bairro || null,
            dadosFornecedor.uf || null,
            dadosFornecedor.endereco || null,
            dadosFornecedor.telefone || null,
            dadosFornecedor.email || null,
            dadosFornecedor.observacoes || null,
            dadosFornecedor.pessoa || null,
            dadosFornecedor.contribuinte || null,
            dadosFornecedor.numero || null,
            dadosFornecedor.ramos_de_atividade || null,
            dadosFornecedor.forma_de_Pgto || null,
            dadosFornecedor.condicoes_Pgto || null,
            cnpjCodificado,    // Novo valor do CNPJ (sempre codificado)
            cnpjWhere           // Onde: pode ser original ou codificado
        );

        console.log('Fornecedor atualizado com sucesso:', result.changes);
        return result.changes;

    } catch (error) {
        console.error('Erro ao atualizar fornecedor:', error.message);
        throw error;
    }
}


module.exports = {
    getFornecedor, 
    postNewFornecedor,
    updateFornecedor
};
