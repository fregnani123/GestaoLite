const path = require('path');
const {
   desativarProdutoSistema
} = require(path.join(__dirname, '../../db/model/model_desabilitar'));


const controllersAtivarProdutoSis = {
    
    desativarProdutoSistema: async (req, res) => {
        try {
            const produto = req.body; // Renomear para evitar confusão
            await desativarProdutoSistema(produto); // Chamar a função importada/definida

            res.json({
                message: 'Produto desativado com sucesso!',
            });
        } catch (error) {
            console.error('Erro ao desativar produto:', error);
            res.status(500).json({ error: 'Erro ao desativar produto.' });
        }
    },
}

module.exports = controllersAtivarProdutoSis;