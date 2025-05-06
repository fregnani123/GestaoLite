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

// Função para inserir uma nova venda
async function postNewVenda(newSale) {

    await ensureDBInitialized();

    const insertSaleQuery = `
        INSERT INTO venda (data_venda, cliente_id, total_liquido, valor_recebido, troco, numero_pedido, desconto_venda)
        VALUES (?, ?, ?, ?, ?, ? , ?)
    `;
    const insertItemQuery = `
        INSERT INTO item_venda (venda_id, produto_id, preco, quantidade, unidade_estoque_id)
        VALUES (?, ?, ?, ?, ?)
    `;
    const insertPaymentQuery = `
        INSERT INTO forma_pagamento (venda_id, tipo_pagamento, valor)
        VALUES (?, ?, ?)
    `;

    try {
        db.transaction(() => {
            const vendaResult = db.prepare(insertSaleQuery).run(
                newSale.data_venda,
                newSale.cliente_id,
                newSale.total_liquido,
                newSale.valor_recebido,
                newSale.troco || 0,
                newSale.numero_pedido,
                newSale.desconto_venda || 0
            );

            const vendaId = vendaResult.lastInsertRowid;

            newSale.itens.forEach(item => {
                db.prepare(insertItemQuery).run(
                    vendaId,
                    item.produto_id,
                    item.preco,
                    item.quantidade,
                    item.unidade_estoque_id
                );
            });

            newSale.pagamentos.forEach(pagamento => {
                db.prepare(insertPaymentQuery).run(
                    vendaId,
                    pagamento.tipo,
                    pagamento.valor
                );
            });

            return vendaId;
        })();
    } catch (error) {
        console.error('Erro ao inserir a venda:', error.message);
        throw error;
    }
}

// Função para buscar a última venda
async function fetchVenda() {
    await ensureDBInitialized();
    try {
        const query = 'SELECT * FROM venda ORDER BY venda_id DESC LIMIT 1';
        return db.prepare(query).get();
    } catch (error) {
        console.error('Erro ao buscar a última venda:', error.message);
        throw error;
    }
}

async function historicoDeVendas({ startDate, endDate, cpfCliente, numeroPedido }) {
    await ensureDBInitialized();
    try {
        let whereConditions = [];
        let queryParams = [];

        if (startDate && endDate) {
            whereConditions.push('v.data_venda BETWEEN ? AND ?');
            queryParams.push(startDate, endDate);
        }
        if (cpfCliente) {
            whereConditions.push('c.cpf = ?');
            queryParams.push(cpfCliente);
        }

        if (numeroPedido) {
            whereConditions.push('v.numero_pedido = ?');
            queryParams.push(numeroPedido);
        }

        const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

        const totalQuery = `
            SELECT SUM(v.total_liquido) AS total_vendas, fp.tipo_pagamento, SUM(fp.valor) AS total_pago
            FROM venda v
            LEFT JOIN forma_pagamento fp ON v.venda_id = fp.venda_id
            LEFT JOIN cliente c ON v.cliente_id = c.cliente_id
            ${whereClause}
            GROUP BY fp.tipo_pagamento;
        `;

        const query = `
        SELECT v.data_venda, c.cpf AS cpf, c.nome AS nome_cliente, v.total_liquido,
        v.valor_recebido, v.troco, v.numero_pedido, v.desconto_venda, iv.produto_id,
        p.codigo_ean AS codigo_ean, p.nome_produto AS produto_nome, iv.preco, iv.quantidade,
        ue.estoque_nome AS unidade_estoque_nome, fp.tipo_pagamento, fp.valor AS valor_pagamento
        FROM venda v
        LEFT JOIN cliente c ON v.cliente_id = c.cliente_id
        LEFT JOIN item_venda iv ON v.venda_id = iv.venda_id
        LEFT JOIN produto p ON iv.produto_id = p.produto_id
        LEFT JOIN unidade_estoque ue ON iv.unidade_estoque_id = ue.unidade_estoque_id
        LEFT JOIN forma_pagamento fp ON v.venda_id = fp.venda_id
        ${whereClause}
        ORDER BY v.numero_pedido DESC;
    `;

        const totalStmt = db.prepare(totalQuery);
        const totalRows = totalStmt.all(...queryParams);

        const dataStmt = db.prepare(query);
        const rows = dataStmt.all(...queryParams);

        return { totalRows, rows };
    } catch (err) {
        console.error('Erro ao consultar histórico de vendas:', err.message);
        throw err;
    }
}

async function getVendasPorNumeroVenda(numeroPedido) {
    await ensureDBInitialized();
    try {
        const query = `
       SELECT 
    v.data_venda, 
    c.nome AS cliente_nome, 
    c.cpf,
    v.total_liquido,
    v.valor_recebido,
    v.troco,
    v.numero_pedido,
    v.desconto_venda,
    iv.produto_id,
    p.codigo_ean,
    p.nome_produto AS produto_nome,
    cp.nome_cor_produto,
    tl.tamanho AS tamanho_letras,
    tn.tamanho AS tamanho_numero,
    mv.medida_nome AS medida_volume,
    um.unidade_nome AS unidade_massa,
    uc.unidade_nome AS unidade_comprimento,
    iv.preco,
    iv.quantidade,
    ue.estoque_nome AS unidade_estoque_nome,
    fp.tipo_pagamento,
    fp.valor AS valor_pagamento
FROM 
    venda v
LEFT JOIN 
    cliente c ON v.cliente_id = c.cliente_id
LEFT JOIN 
    item_venda iv ON v.venda_id = iv.venda_id
LEFT JOIN 
    produto p ON iv.produto_id = p.produto_id
LEFT JOIN 
    cor_produto cp ON p.cor_produto_id = cp.cor_produto_id
LEFT JOIN 
    tamanho_letras tl ON p.tamanho_letras_id = tl.tamanho_id
LEFT JOIN 
    tamanho_numero tn ON p.tamanho_num_id = tn.tamanho_id
LEFT JOIN 
    medida_volume mv ON p.medida_volume_id = mv.medida_volume_id
LEFT JOIN 
    unidade_massa um ON p.unidade_massa_id = um.unidade_massa_id
LEFT JOIN 
    unidade_comprimento uc ON p.unidade_comprimento_id = uc.unidade_comprimento_id
LEFT JOIN 
    unidade_estoque ue ON iv.unidade_estoque_id = ue.unidade_estoque_id
LEFT JOIN 
    forma_pagamento fp ON v.venda_id = fp.venda_id
WHERE 
    v.numero_pedido = ?;

        `;

        const stmt = db.prepare(query);
        const rows = stmt.all(numeroPedido);
        return rows;
    } catch (error) {
        console.error('Erro ao buscar vendas por número do pedido:', error.message);
        throw error;
    }
}

module.exports = {
    postNewVenda,
    fetchVenda,
    historicoDeVendas,
    getVendasPorNumeroVenda,
};
