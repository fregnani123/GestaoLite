const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../config/.env') });

async function initializeDB(db) {
    try {

        console.log('Conectado ao banco de dados SQLite.');

        const queries = [
            // Criar Schema e Tabelas (SQLite não precisa de CREATE SCHEMA)

            // Criar Tabela Serial_Key
            ` CREATE TABLE IF NOT EXISTS usuario (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              nome_fantasia TEXT,
              razao_social TEXT,
              cep TEXT,
              endereco TEXT NOT NULL,
              numero TEXT NOT NULL,
              bairro TEXT NOT NULL,
              cidade TEXT NOT NULL,
              estado TEXT NOT NULL,
              contato TEXT NOT NULL,
              cnpj_cpf TEXT UNIQUE,
              inscricao_estadual TEXT,
              email TEXT UNIQUE,
              site TEXT,
              usuario TEXT UNIQUE NOT NULL DEFAULT 'adm',
              senha TEXT NOT NULL DEFAULT 'ZmdsbWRhMTk2OQ==',
              tipo_usuario TEXT NOT NULL,
              slogan TEXT,
              path_img TEXT,
              ativo INTEGER DEFAULT 1,
              data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
              contribuinte TEXT NOT NULL DEFAULT 'isento',
              atividade TEXT,
              senha_venda TEXT NOT NULL DEFAULT 'adm'
               );`,

            // Criar Tabela Serial_Key
            `CREATE TABLE IF NOT EXISTS Serial_Key (
                serial_key_id INTEGER PRIMARY KEY AUTOINCREMENT,
                userID TEXT NOT NULL,
                serialKey TEXT NOT NULL, 
                startedDate TEXT NOT NULL, 
                expirationDate TEXT NOT NULL, 
                ativado INTEGER NOT NULL, 
                UNIQUE (userID), 
                UNIQUE (serialKey)
            );`,

            // Criar Tabela grupo
            `CREATE TABLE IF NOT EXISTS grupo (
                grupo_id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome_grupo TEXT
            );`,

            // Criar Tabela sub-grupo
            `CREATE TABLE IF NOT EXISTS sub_grupo (
                sub_grupo_id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome_sub_grupo TEXT
            );`,

            // Criar Tabela tamanho_letras
            `CREATE TABLE IF NOT EXISTS tamanho_letras (
                tamanho_id INTEGER PRIMARY KEY AUTOINCREMENT,
                tamanho TEXT
            );`,

            // Criar Tabela tamanho_numero
            `CREATE TABLE IF NOT EXISTS tamanho_numero (
            tamanho_id INTEGER PRIMARY KEY AUTOINCREMENT,
            tamanho TEXT
            );
            `,

            // Criar Tabela unidade_massa
            `CREATE TABLE IF NOT EXISTS unidade_massa (
                unidade_massa_id INTEGER PRIMARY KEY AUTOINCREMENT,
                unidade_nome TEXT
            );`,

            // Criar Tabela medida_volume
            `CREATE TABLE IF NOT EXISTS medida_volume (
                medida_volume_id INTEGER PRIMARY KEY AUTOINCREMENT,
                medida_nome TEXT
            );`,

            // Criar Tabela unidade_comprimento
            `CREATE TABLE IF NOT EXISTS unidade_comprimento (
                unidade_comprimento_id INTEGER PRIMARY KEY AUTOINCREMENT,
                unidade_nome TEXT
            );`,

            // Criar Tabela unidade_estoque
            `CREATE TABLE IF NOT EXISTS unidade_estoque (
                unidade_estoque_id INTEGER PRIMARY KEY AUTOINCREMENT,
                estoque_nome TEXT
            );`,

            // Criar Tabela fornecedor
            `CREATE TABLE IF NOT EXISTS fornecedor (
                fornecedor_id INTEGER PRIMARY KEY AUTOINCREMENT,
                cnpj TEXT NOT NULL,
                inscricao_estadual TEXT,
                razao_social TEXT NOT NULL,
                nome_fantasia TEXT NOT NULL,
                cep TEXT NOT NULL,
                cidade TEXT NOT NULL,
                bairro TEXT NOT NULL,
                uf TEXT NOT NULL,
                endereco TEXT NOT NULL, 
                telefone TEXT NOT NULL,
                email TEXT NOT NULL,
                observacoes TEXT,
                pessoa TEXT NOT NULL DEFAULT 'Jurídica',
                contribuinte TEXT NOT NULL DEFAULT 'isento',
                numero TEXT NOT NULL DEFAULT '0',
                ramos_de_atividade TEXT NOT NULL DEFAULT 'Outros',
                forma_de_Pgto TEXT NOT NULL DEFAULT 'Boleto',
                condicoes_Pgto TEXT NOT NULL DEFAULT 'À vista'
            );`,

            // Criar Tabela cor produto
            `CREATE TABLE IF NOT EXISTS cor_produto (
                cor_produto_id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome_cor_produto TEXT
            );`,

            // Criar Tabela cliente
            `CREATE TABLE IF NOT EXISTS cliente (
            cliente_id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            data_nascimento TEXT NOT NULL,
            telefone TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            cep TEXT NOT NULL,
            logradouro TEXT,
            numero TEXT,
            bairro TEXT,
            estado TEXT NOT NULL,
            cidade TEXT NOT NULL,
            observacoes TEXT,
            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            credito_limite DECIMAL(10,2),  
            credito_utilizado DECIMAL(10,2) DEFAULT 0.00,
            ocupacao TEXT NOT NULL DEFAULT 'Desconhecido'
            );
           `,

            // Criar Tabela venda
            `CREATE TABLE IF NOT EXISTS venda (
                venda_id INTEGER PRIMARY KEY AUTOINCREMENT,
                data_venda TEXT NOT NULL,
                cliente_id INTEGER,
                total_liquido REAL NOT NULL,
                valor_recebido REAL NOT NULL,
                troco REAL NOT NULL,
                numero_pedido TEXT NOT NULL,
                desconto_venda TEXT DEFAULT 0
            );`,

            // Criar Tabela forma_pagamento
            `CREATE TABLE IF NOT EXISTS forma_pagamento (
                pagamento_id INTEGER PRIMARY KEY AUTOINCREMENT,
                venda_id INTEGER NOT NULL,
                tipo_pagamento TEXT NOT NULL,
                valor REAL NOT NULL,
                FOREIGN KEY (venda_id) REFERENCES venda(venda_id)
            );`,

            // Criar Tabela item_venda
            `CREATE TABLE IF NOT EXISTS item_venda (
                item_venda_id INTEGER PRIMARY KEY AUTOINCREMENT,
                venda_id INTEGER NOT NULL,
                produto_id INTEGER NOT NULL,
                preco REAL NOT NULL,
                quantidade INTEGER NOT NULL,
                unidade_estoque_id INTEGER NOT NULL,
                FOREIGN KEY (venda_id) REFERENCES venda(venda_id)
            );`,

            // Criar Tabela controle_estoque
            `CREATE TABLE IF NOT EXISTS controle_estoque (
                controle_estoque_id INTEGER PRIMARY KEY AUTOINCREMENT,
                produto_id INTEGER NOT NULL,
                qtde_movimentada INTEGER NOT NULL,
                preco_compra_anterior REAL NOT NULL,
                preco_compra_atual REAL NOT NULL,
                preco_markup_anterior REAL,
                preco_markup_atual REAL,
                preco_venda_anterior REAL NOT NULL,
                preco_venda_atual REAL NOT NULL,
                situacao_movimento TEXT NOT NULL,
                motivo_movimentacao TEXT NOT NULL,
                numero_compra_fornecedor TEXT,
                venda_id INTEGER,
                data_movimentacao TEXT NOT NULL,
                FOREIGN KEY (produto_id) REFERENCES produto(produto_id),
                FOREIGN KEY (venda_id) REFERENCES venda(venda_id)
            );`,

            //Criar Tabela crediario
            `CREATE TABLE IF NOT EXISTS crediario (
            crediario_id INTEGER PRIMARY KEY AUTOINCREMENT, -- Ajuste para SQLite
            cliente_id INT NOT NULL, -- Relacionado ao cliente
            venda_id INT NOT NULL, -- Relacionado à venda
            parcela_numero INT NOT NULL, -- Número da parcela
            valor_parcela DECIMAL(10, 2) NOT NULL, -- Valor da parcela
            data_vencimento DATE NOT NULL, -- Data de vencimento
            data_pagamento DATE DEFAULT NULL, -- Data em que foi paga (NULL se não foi paga)
            status TEXT DEFAULT 'PENDENTE', -- Status da parcela,
            multa_atraso DECIMAL(10, 2) DEFAULT 0.00,
            FOREIGN KEY (cliente_id) REFERENCES cliente(cliente_id),
            FOREIGN KEY (venda_id) REFERENCES venda(venda_id)
           );`,

            //Criar Tabela taxas crediário
            `CREATE TABLE IF NOT EXISTS taxa (
             taxa_id INTEGER PRIMARY KEY AUTOINCREMENT,
             juros_parcela_acima TEXT NOT NULL DEFAULT '0',
             juros_crediario_venda DECIMAL(10, 2) DEFAULT 0.00,
             valor_multa_atraso DECIMAL(10, 2) DEFAULT 0.00,
             juros_crediario_atraso DECIMAL(10, 2) DEFAULT 0.00
            );
            `,

            //Criar Tabela agendamento
            `CREATE TABLE IF NOT EXISTS agendamento (
            agendamento_id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER NOT NULL,
            data TEXT NOT NULL,
            hora TEXT NOT NULL,
            motivo TEXT NOT NULL,
            status TEXT CHECK(status IN ('Pendente', 'Confirmado', 'Cancelado')) DEFAULT 'Pendente',
            data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cliente_id) REFERENCES cliente(cliente_id) ON DELETE CASCADE
            );`,


            // Criar Tabela produto
            `CREATE TABLE IF NOT EXISTS produto (
                produto_id INTEGER PRIMARY KEY AUTOINCREMENT,
                codigo_ean TEXT,
                grupo_id INTEGER,
                sub_grupo_id INTEGER,
                nome_produto TEXT,
                tamanho_letras_id INTEGER,
                tamanho_num_id INTEGER,
                unidade_massa_id INTEGER,
                medida_volume_id INTEGER,
                unidade_comprimento_id INTEGER,
                quantidade_estoque INTEGER,
                quantidade_vendido INTEGER,
                preco_compra REAL,
                markup REAL,
                preco_venda REAL,
                unidade_estoque_id INTEGER,
                unidade_massa_qtd INTEGER,
                medida_volume_qtd INTEGER,
                unidade_comprimento_qtd INTEGER,
                fornecedor_id INTEGER,
                caminho_img_produto TEXT,
                cor_produto_id INTEGER,
                observacoes TEXT,
                produto_ativado INTEGER DEFAULT 1,
                FOREIGN KEY (grupo_id) REFERENCES grupo(grupo_id),
                FOREIGN KEY (sub_grupo_id) REFERENCES sub_grupo(sub_grupo_id),
                FOREIGN KEY (tamanho_letras_id) REFERENCES tamanho_letras(tamanho_id),
                FOREIGN KEY (tamanho_num_id) REFERENCES tamanho_numero(tamanho_id),
                FOREIGN KEY (unidade_massa_id) REFERENCES unidade_massa(unidade_massa_id),
                FOREIGN KEY (medida_volume_id) REFERENCES medida_volume(medida_volume_id),
                FOREIGN KEY (unidade_comprimento_id) REFERENCES unidade_comprimento(unidade_comprimento_id),
                FOREIGN KEY (unidade_estoque_id) REFERENCES unidade_estoque(unidade_estoque_id),
                FOREIGN KEY (fornecedor_id) REFERENCES fornecedor(fornecedor_id),
                FOREIGN KEY (cor_produto_id) REFERENCES cor_produto(cor_produto_id)
            );`
        ];


        // Executar cada query para criar tabelas
        queries.forEach(query => {
            db.prepare(query).run();
        });
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
        throw err;
    }
}

// Fecha o banco de dados ao desligar o servidor
process.on('SIGINT', () => {
    console.log('Servidor está sendo desligado...');
    db.close();
    console.log('Banco de dados SQLite fechado com sucesso.');
    process.exit(0); // Sai do processo com sucesso
});


// Exporta a função initializeDB
module.exports = initializeDB;