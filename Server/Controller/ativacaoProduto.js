const path = require('path');
const {
    getAtivacaoMysql,
    postAtivacao,
    UpdateAtivacao,
    
} = require(path.join(__dirname, '../../db/model/modelAtivacao'));


const controllersAtivacao = {

    getAtivacaoMysql: async (req, res) => {
        try {
            const ativacao = await getAtivacaoMysql();
            res.json(ativacao);
        } catch (error) {
            console.error('Erro ao buscar ativação:', error);
            res.status(500).json({ error: 'Erro ao buscar ativação' });
        }
    },

    UpdateAtivacao: async (req, res) => {
        try {
            const serialKeyData = req.body; // Renomear para evitar confusão
            await UpdateAtivacao(serialKeyData); // Chamar a função importada/definida

            res.json({
                message: 'UpdateAtivacao alterado com sucesso!',
            });
        } catch (error) {
            console.error('Erro ao alterar UpdateAtivacao:', error);
            res.status(500).json({ error: 'Erro ao alterar UpdateAtivacao.' });
        }
    },

    postAtivacao: async (req, res) => {
        try {
            const insertAtivacao = req.body;
    
            // Verificar se os dados estão no formato correto
            if (!insertAtivacao.userID || !insertAtivacao.serialKey ||
                !insertAtivacao.startedDate || !insertAtivacao.expirationDate ||
                insertAtivacao.ativado === undefined) {
                return res.status(400).json({ error: 'Dados inválidos fornecidos para a ativação.' });
            }
    
            console.log('Dados fornecidos:', insertAtivacao);
    
            await postAtivacao(insertAtivacao);
    
            res.json({
                message: 'Ativação inserida com sucesso!',
            });
        } catch (error) {
            console.error('Erro ao inserir a ativação:', error);
            res.status(500).json({ error: 'Erro ao inserir a ativação.' });
        }
    },

}

module.exports = controllersAtivacao;