async function insertGrupo(db) {
    try {
        const query = `INSERT OR IGNORE INTO grupo (nome_grupo) VALUES ('Geral')`;
        const info = db.prepare(query).run();

        if (info.changes) {
            console.log('Grupo de produtos inserido com sucesso.');
            return info.changes;
        } else {
            console.log('Grupo de produtos já existe.');
            return 0;
        }
    } catch (error) {
        console.error('Erro ao inserir grupo de produtos:', error);
        throw error;
    }
}

async function insertSubGrupo(db) {
    try {
        const query = `INSERT OR IGNORE INTO sub_grupo (nome_sub_grupo) VALUES ('Geral')`;
        const info = db.prepare(query).run();

        if (info.changes) {
            console.log('Sub-grupo de produtos inserido com sucesso.');
            return info.changes;
        } else {
            console.log('Sub-grupo de produtos já existe.');
            return 0;
        }
    } catch (error) {
        console.error('Erro ao inserir sub-grupo de produtos:', error);
        throw error;
    }
}

async function insertTamanhoLetras(db) {
    try {
        const query = `INSERT OR IGNORE INTO tamanho_letras (tamanho) 
        VALUES ('PP'), ('P'), ('M'), ('G'), ('GG'), ('XG'), ('XXG')`;
        const info = db.prepare(query).run();

        console.log('Tamanhos de letras inseridos com sucesso.');
        return info.changes;
    } catch (error) {
        console.error('Erro ao inserir tamanhos de letras dos produtos:', error);
        throw error;
    }
}

async function insertCorProduto(db) {
    try {
        const query = `INSERT OR IGNORE INTO cor_produto (nome_cor_produto) 
        VALUES ('Vermelho'), ('Azul'), ('Verde'), ('Amarelo'), ('Preto'), ('Branco'), 
        ('Roxo'), ('Laranja'), ('Rosa'), ('Marrom'), ('Cinza'), ('Ciano'), ('Magenta'), 
        ('Lima'), ('Índigo'), ('Violeta'), ('Dourado'), ('Prata'), ('Bege'), ('Bordô')`;
        const info = db.prepare(query).run();

        console.log('Cores de produtos inseridas com sucesso.');
        return info.changes;
    } catch (error) {
        console.error('Erro ao inserir cores dos produtos:', error);
        throw error;
    }
}

async function insertTamanhoNumeros(db) {
    try {
        const query = `INSERT OR IGNORE INTO tamanho_numero (tamanho) 
        VALUES ${Array.from({ length: 100 }, (_, i) => `('${i + 1}')`).join(', ')}`;
        const info = db.prepare(query).run();

        console.log('Tamanhos numéricos inseridos com sucesso.');
        return info.changes;
    } catch (error) {
        console.error('Erro ao inserir tamanhos numéricos dos produtos:', error);
        throw error;
    }
}

async function insertUnidadeMassa(db) {
    try {
        const query = `INSERT OR IGNORE INTO unidade_massa (unidade_nome)
        VALUES ('G'), ('KG'), ('MG'), ('TON')`;
        const info = db.prepare(query).run();

        console.log('Unidades de massa inseridas com sucesso.');
        return info.changes;
    } catch (error) {
        console.error('Erro ao inserir unidades de massa dos produtos:', error);
        throw error;
    }
}

async function insertUnidadeVolume(db) {
    try {
        const query = `INSERT OR IGNORE INTO medida_volume (medida_nome) 
        VALUES ('ML'), ('L'), ('M³'), ('CM³')`;
        const info = db.prepare(query).run();

        console.log('Unidades de volume inseridas com sucesso.');
        return info.changes;
    } catch (error) {
        console.error('Erro ao inserir unidades de volume dos produtos:', error);
        throw error;
    }
}

async function insertUnidadeComprimento(db) {
    try {
        const query = `INSERT OR IGNORE INTO unidade_comprimento (unidade_nome) 
        VALUES ('MM'), ('CM'), ('M')`;
        const info = db.prepare(query).run();

        console.log('Unidades de comprimento inseridas com sucesso.');
        return info.changes;
    } catch (error) {
        console.error('Erro ao inserir unidades de comprimento dos produtos:', error);
        throw error;
    }
}

async function insertUnidadeEstoque(db) {
    try {
        const query = `INSERT OR IGNORE INTO unidade_estoque (estoque_nome) 
        VALUES ('un'), ('cx'), ('rolo'), ('pc')`;
        const info = db.prepare(query).run();

        console.log('Unidades de estoque inseridas com sucesso.');
        return info.changes;
    } catch (error) {
        console.error('Erro ao inserir unidades de estoque dos produtos:', error);
        throw error;
    }
}

async function insertFornecedorPadrao(db) {
    try {
        const query = `
            INSERT OR IGNORE INTO fornecedor (
                cnpj,
                inscricao_estadual,
                razao_social,
                nome_fantasia,
                cep,
                cidade,
                bairro,
                uf,
                endereco,
                telefone,
                email,
                observacoes,
                pessoa,
                contribuinte,
                numero,
                ramos_de_atividade,
                forma_de_Pgto,
                condicoes_Pgto
            ) VALUES (
                '00.000.000/0000-00',
                'ISENTO',
                'Fornecedor Padrão LTDA',
                'Fornecedor não Cadastrado',
                '00000-000',
                'Cidade Padrão',
                'Bairro Padrão',
                'SP',
                'Rua Padrão',
                '(00) 0000-0000',
                'fornecedor@padrao.com',
                'Fornecedor padrão criado automaticamente.',
                'Jurídica',
                'isento',
                '0',
                'Outros',
                'Boleto',
                'À vista'
            )
        `;
        const info = db.prepare(query).run();
        console.log('Fornecedor padrão inserido com sucesso.');
        return info.changes;
    } catch (error) {
        console.error('Erro ao inserir fornecedor padrão:', error);
        throw error;
    }
}

async function insertClienteDefault(db) {
    try {
        const query = `INSERT OR IGNORE INTO cliente (nome, cpf, telefone, email, cep, estado, cidade, data_nascimento) 
        VALUES ('Consumidor Final', 'ZmdsMDAtMDAwLjAwMC44MjYuMDAwMTk2OQ==', '', '', '', 'SP', 'São Paulo', CURRENT_TIMESTAMP)`;
        const info = db.prepare(query).run();

        console.log('Cliente padrão inserido com sucesso.');
        return info.changes;
    } catch (error) {
        console.error('Erro ao inserir cliente padrão:', error);
        throw error;
    }
}

async function insertTaxaDefault(db) {
    try {
        const query = `INSERT OR IGNORE INTO taxa (juros_parcela_acima, juros_crediario_venda, valor_multa_atraso, juros_crediario_atraso) 
        VALUES ('0', '0', '0', '0')`;
        const info = db.prepare(query).run();

        console.log('Cliente padrão inserido com sucesso.');
        return info.changes;
    } catch (error) {
        console.error('Erro ao inserir cliente padrão:', error);
        throw error;
    }
}

module.exports = {
    insertGrupo,
    insertSubGrupo,
    insertTamanhoLetras,
    insertCorProduto,
    insertTamanhoNumeros,
    insertUnidadeMassa,
    insertUnidadeVolume,
    insertUnidadeComprimento,
    insertUnidadeEstoque,
    insertFornecedorPadrao,
    insertClienteDefault,
    insertTaxaDefault
};














