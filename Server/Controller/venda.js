const path = require('path');
const {
    postNewVenda,
    fetchVenda,
    historicoDeVendas,
    getVendasPorNumeroVenda,
} = require(path.join(__dirname, '../../db/model/modeVenda'));

const controllersVenda = {
    postNewVenda: async (req, res) => {
        try {
            const vendaData = req.body;
            const newVendaId = await postNewVenda(vendaData);
            res.json({
                message: 'Venda inserida com sucesso!',
                venda_id: newVendaId
            });
        } catch (error) {
            console.error('Erro ao inserir a venda:', error.message);
            // Exibindo detalhes do erro para depuração
            console.error('Detalhes do erro:', error);
    
            res.status(500).json({ error: 'Erro ao inserir a venda.' });
        }
    },
    getVenda: async (req, res) => {
        try {
            const vendas = await fetchVenda(); // Chama a função para buscar as vendas
            res.json(vendas); // Retorna os dados como JSON
        } catch (error) {
            console.error('Erro ao buscar Venda:', error);
            res.status(500).json({ error: 'Erro ao buscar Venda' });
        }
    },

    getHistoricoDeVenda: async (req, res) => {
        try {
            // Extrai parâmetros da requisição
            const { startDate, endDate, cpfCliente, numeroPedido } = req.query;
    
            // Verifica se os parâmetros de data estão presentes, caso contrário, define como NULL
            const startDateFormatted = startDate || null;
            const endDateFormatted = endDate || null;
            const cpfClienteFormatted = cpfCliente || null;
            const numeroPedidoFormatted = numeroPedido || null;
    
            
            // LOG PARA DEBUGAR O NOME ANTES DA BUSCA
            console.log("Buscando por clienteNome:", cpfClienteFormatted);
    
            // Chama a função para buscar o histórico de vendas com os filtros
            const historicoVendas = await historicoDeVendas({
                startDate: startDateFormatted,
                endDate: endDateFormatted,
                cpfCliente: cpfClienteFormatted,
                numeroPedido: numeroPedidoFormatted,
            });
    
            res.json(historicoVendas); // Retorna os dados como JSON
        } catch (error) {
            console.error('Erro ao buscar histórico de vendas:', error);
            res.status(500).json({ error: 'Erro ao buscar histórico de vendas' });
        }
    },
    
    getVendasPorNumeroVenda: async (req, res) => {
        const { numero_pedido } = req.params;  // Pegando o numero_pedido da URL
        try {
            // Chama a função que busca as vendas pelo numero_pedido
            const vendas = await getVendasPorNumeroVenda(numero_pedido);
            if (vendas.length === 0) {
                return res.status(404).json({ message: 'Venda não encontrada' });
            }
            res.json(vendas);  // Retorna todos os itens da venda
        } catch (error) {
            console.error('Erro ao buscar vendas:', error);
            res.status(500).json({ error: 'Erro ao buscar vendas' });
        }
    },
}

module.exports = controllersVenda;