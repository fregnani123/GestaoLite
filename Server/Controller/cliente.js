const path = require('path');
const {
    postNewCliente,
    getClientePorCPF,
    updateCliente,
    updateCreditoCliente,
    getClientePorNome
} = require(path.join(__dirname, '../../db/model/modelCLiente'));


const controllersCliente = {

    postNewCliente: async (req, res) => {
        try {
            const clienteData = req.body; 
            const newCliente = await postNewCliente(clienteData);

            res.json({
                message: 'Cliente inserido com sucesso!',
                cliente_id: newCliente
            });
        } catch (error) {
            console.error('Erro ao inserir o Cliente:', error);

            // Verifica se o erro possui uma mensagem personalizada (como para o CNPJ duplicado)
            if (error.message) {
                return res.status(400).json({ error: error.message });
            }

            // Retorna uma mensagem genérica para outros erros
            res.status(500).json({ error: 'Erro ao inserir o cliente.' });
        }
    },

    getCliente: async (req, res) => {
        try {
            let { cpf } = req.params;
            console.log("CPF recebido antes da formatação:", cpf);
    
            const cliente = await getClientePorCPF(cpf);
            // console.log("Resultado da consulta:", cliente);
    
            if (!cliente.length) {
                return res.status(404).json({ message: "Cliente não encontrado" });
            }
    
            return res.json(cliente);
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
            res.status(500).json({ error: "Erro interno do servidor." });
        }
    },

    getClienteNome: async (req, res) => {
        try {
            let { nome } = req.params;
            console.log("Nome recebido no parâmetro:", nome);  // Verifique o parâmetro recebido
    
            const cliente = await getClientePorNome(nome);  // Chama a função para buscar o cliente
            console.log("Resultado da consulta:", cliente);  // Verifique o resultado da consulta
    
            if (!cliente.length) {
                return res.status(404).json({ message: "Cliente não encontrado" });
            }
    
            return res.json(cliente);
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
            res.status(500).json({ error: "Erro interno do servidor." });
        }
    },

    updateCliente: async (req, res) => {
        try {
            const alterarCLi = req.body;
            await updateCliente(alterarCLi); 
            res.json({
                message: 'Cliente alterado com sucesso!',
            });
        } catch (error) {
            console.error('Erro ao alterar cliente:', error);
            res.status(500).json({ error: 'Erro ao alterar cliente.' });
        }
    },
    
    updateCreditoCliente : async (req, res) => {
        try {
            const alterarCredito = req.body;
            await updateCreditoCliente(alterarCredito); 
            res.json({
                message: 'Credito cliente alterado com sucesso!',
            });
        } catch (error) {
            console.error('Erro ao alterar credito cliente:', error);
            res.status(500).json({ error: 'Erro ao alterar cliente.' });
        }
    },
    
}


module.exports = controllersCliente;