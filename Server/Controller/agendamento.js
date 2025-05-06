const path = require('path');
const {

   postNewAgendamento,
   getAgendamento,
   statusAgendamento

} = require(path.join(__dirname, '../../db/model/model_agendamentos'));


const controllersAgenda = {
    postNewAgendamento: async (req, res) => {
        try {
            const agendamento = req.body; 
            const newAgendamento = await postNewAgendamento(agendamento);

            res.json({
                message: 'Agendamento inserido com sucesso!',
                cliente_id: newAgendamento
            });
        } catch (error) {
            console.error('Erro ao inserir o agendamento:', error);

            // Verifica se o erro possui uma mensagem personalizada (como para o CNPJ duplicado)
            if (error.message) {
                return res.status(400).json({ error: error.message });
            }

            // Retorna uma mensagem genérica para outros erros
            res.status(500).json({ error: 'Erro ao inserir agendamento.' });
        }
    }, 
    updateAgendamento: async (req, res) => {
        try {
            const updateAgendamento = req.body; 
            const status = await statusAgendamento(updateAgendamento);

            res.json({
                message: 'Update agendamento inserido com sucesso!',
                agendamento_id : status
            });
        } catch (error) {
            console.error('Erro ao atualizar o agendamento:', error);

            // Verifica se o erro possui uma mensagem personalizada (como para o CNPJ duplicado)
            if (error.message) {
                return res.status(400).json({ error: error.message });
            }

            // Retorna uma mensagem genérica para outros erros
            res.status(500).json({ error: 'Erro ao atualizar status agendamento.' });
        }
    }, 

    getAgendamento: async (req, res) => {
        try {

            const cliente = await getAgendamento();
            console.log("Resultado da consulta:", cliente);
    
            if (!cliente.length) {
                return res.status(404).json({ message: "Cliente não encontrado" });
            }
    
            return res.json(cliente);
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
            res.status(500).json({ error: "Erro interno do servidor." });  
        }
    },


}

module.exports = controllersAgenda;