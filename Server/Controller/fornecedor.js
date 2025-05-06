const path = require('path');
const {
    postNewFornecedor,
    getFornecedor,
    updateFornecedor
} = require(path.join(__dirname, '../../db/model/modelFornecedor'));


const controllersFornecedor = {

    postNewFornecedor: async (req, res) => {
        try {
            const fornecedorData = req.body; // Dados do fornecedor recebidos do frontend
            const newFornecedorId = await postNewFornecedor(fornecedorData); // Insere o fornecedor no banco

            res.json({
                message: 'Fornecedor inserido com sucesso!',
                fornecedor_id: newFornecedorId
            });
        } catch (error) {
            console.error('Erro ao inserir o fornecedor:', error);

            // Verifica se o erro possui uma mensagem personalizada (como para o CNPJ duplicado)
            if (error.message) {
                return res.status(400).json({ error: error.message }); // Retorna a mensagem específica do erro
            }

            // Retorna uma mensagem genérica para outros erros
            res.status(500).json({ error: 'Erro ao inserir o fornecedor.' });
        }
    },

    getFornecedor: async (req, res) => {
        try {
            const fornecedor = await getFornecedor();
            res.json(fornecedor);
        } catch (error) {
            console.error('Erro ao buscar fornecedor:', error);
            res.status(500).json({ error: 'Erro ao buscar fornecedor' });
        }
    },

    UpdateFornecedor: async (req, res) => {
        try {
            const fornecedor = req.body;
    
            // Verificar se o CNPJ foi enviado
            if (!fornecedor.cnpj) {
                return res.status(400).json({ error: 'O campo CNPJ é obrigatório.' });
            }
    
            const changes = await updateFornecedor(fornecedor);
    
            if (changes > 0) {
                res.json({ message: 'Fornecedor atualizado com sucesso!' });
            } else {
                res.status(404).json({ error: 'Fornecedor não encontrado ou nenhuma alteração realizada.' });
            }
    
        } catch (error) {
            console.error('Erro ao alterar fornecedor:', error);
            res.status(500).json({ error: 'Erro ao alterar fornecedor.' });
        }
    }
    

}

module.exports = controllersFornecedor;