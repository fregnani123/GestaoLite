const path = require('path');
const { getCrediario } = require('../../db/model/modelCrediario');
const {
    postControleEstoque,
    getUnidadeEstoque,
    UpdateEstoque,
    getControleEstoque
} = require(path.join(__dirname, '../../db/model/modelEstoque'));


const controllersEstoque = {
    postNewControleEstoque: async (req, res) => {
        try {
            const controleEstoqueData = req.body; 
            const newControleEstoqueId = await postControleEstoque(controleEstoqueData);

            res.json({
                message: 'Controle estoque inserido com sucesso!',
                controle_estoque_id: newControleEstoqueId
            });
        } catch (error) {
            console.error('Erro ao inserir o controleEstoque:', error);

            if (error.message) {
                return res.status(400).json({ error: error.message }); 
            }
            res.status(500).json({ error: 'Erro ao inserir o controleEstoqueId.' });
        }
    },

    getUnidadeEstoque: async (req, res) => {
        try {
            const unidadeEstoque = await getUnidadeEstoque();
            res.json(unidadeEstoque);
        } catch (error) {
            console.error('Erro ao buscar UnidadeEstoque:', error);
            res.status(500).json({ error: 'Erro ao buscar UnidadeEstoque' });
        }
    },

    getControleEstoque: async (req, res) => {
        try {
            const controleEstoque = await getControleEstoque();
            res.json(controleEstoque);
        } catch (error) {
            console.error('Erro ao buscar getControleEstoque:', error);
            res.status(500).json({ error: 'Erro ao buscar getControleEstoque' });
        }
    },


    UpdateEstoque: async (req, res) => {
        try {
            const produto = req.body; // Renomear para evitar confusão
            await UpdateEstoque(produto); // Chamar a função importada/definida

            res.json({
                message: 'UpdateEstoque alterado com sucesso!',
            });
        } catch (error) {
            console.error('Erro ao alterar UpdateEstoque:', error);
            res.status(500).json({ error: 'Erro ao alterar UpdateEstoque.' });
        }
    },
}

module.exports = controllersEstoque;