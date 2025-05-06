const path = require('path');
const {
    UpdateValores,
} = require(path.join(__dirname, '../../db/model/modelValores'));


const controllersAlterValores = {
    UpdateValores: async (req, res) => {
        try {
            const produto = req.body; 
            await UpdateValores(produto); 

            res.json({
                message: 'UpdateValores alterado com sucesso!',
            });
        } catch (error) {
            console.error('Erro ao alterar UpdateValores:', error);
            res.status(500).json({ error: 'Erro ao alterar UpdateValores.' });
        }
    },

}

module.exports = controllersAlterValores;