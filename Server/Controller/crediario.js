const path = require('path');
const {
    registrarCrediario,
    getCrediarioByCPF,
    updateCrediario,
    getCrediariosMesVigente,
    getTaxas,
    updateTaxas,
    getCrediarioNumeroPed
} = require(path.join(__dirname, '../../db/model/modelCrediario'));

const controllersCrediario = {

    postNewCrediario: async (req, res) => {
        try {
            const {
                venda_id,
                cliente_id,
                valorTotal,
                numParcelas,
                dataPrimeiroVencimento,
                condicao,
                tipoPagamento,
                entrada
            } = req.body;

            // Verificar se algum campo importante está vazio ou faltando
            if (!venda_id || !cliente_id || !valorTotal || !numParcelas || !dataPrimeiroVencimento) {
                console.log('Dados do crediário incompletos ou ausentes:', {
                    venda_id,
                    cliente_id,
                    valorTotal,
                    numParcelas,
                    dataPrimeiroVencimento,
                    condicao,
                    tipoPagamento,
                    entrada
                });

                return res.status(200).json({
                    message: 'Crediário não inserido por dados incompletos, mas continuando o processo.'
                });
            }

            // Se todos os dados estiverem presentes, prosseguir com o registro
            const insertedRows = await registrarCrediario(
                venda_id,
                cliente_id,
                valorTotal,
                numParcelas,
                dataPrimeiroVencimento,
                condicao,
                tipoPagamento,
                entrada
            );

            if (insertedRows > 0) {
                res.json({
                    message: 'Crediário inserido com sucesso!',
                    parcelas_inseridas: insertedRows
                });
            } else {
                res.status(500).json({ error: 'Nenhum crediário foi inserido!' });
            }
        } catch (error) {
            console.error('Erro ao inserir o Crediário:', error);

            if (error.message) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Erro ao inserir o Crediário.' });
        }
    },

    getCrediario: async (req, res) => {
        const { cpf } = req.params;  // O CPF vem como parâmetro de URL

        if (!cpf) {
            return res.status(400).json({ error: 'CPF não informado.' });
        }

        try {
            // Passa o CPF para a função de consulta
            const crediario = await getCrediarioByCPF(cpf);
            if (crediario.length === 0) {
                return res.status(404).json({ error: 'Nenhum crediário encontrado para este CPF.' });
            }
            res.json(crediario);
        } catch (error) {
            console.error('Erro ao buscar Crediário:', error);
            res.status(500).json({ error: 'Erro ao buscar Crediário' });
        }
    },

    getCrediarioNumeroPedido: async (req, res) => {
        const { venda_id } = req.params;  // O CPF vem como parâmetro de URL

        if (!venda_id) {
            return res.status(400).json({ error: 'venda_id não informado.' });
        }

        try {
            // Passa o CPF para a função de consulta
            const crediario = await getCrediarioNumeroPed(venda_id);
            if (crediario.length === 0) {
                return res.status(404).json({ error: 'Nenhum crediário encontrado para esta venda_id.' });
            }
            res.json(crediario);
        } catch (error) {
            console.error('Erro ao buscar Crediário:', error);
            res.status(500).json({ error: 'Erro ao buscar Crediário' });
        }
    },

  getCrediariosMesVigente: async (req, res) => {
    try {
        const { ano, mes } = req.query; // pega ?ano=2025&mes=01 da URL

        if (!ano || !mes) {
            return res.status(400).json({ error: 'Informe ano e mês. Exemplo: ?ano=2025&mes=01' });
        }

        const allCrediario = await getCrediariosMesVigente(ano, mes);
        res.json(allCrediario);

    } catch (error) {
        console.error('Erro ao buscar Crediários:', error);
        res.status(500).json({ error: 'Erro ao buscar Crediários' });
    }
},

    getTaxas: async (req, res) => {
        try {
            const taxas = await getTaxas();
            res.json(taxas);
        } catch (error) {
            console.error('Erro ao buscar Taxas:', error);
            res.status(500).json({ error: 'Erro ao buscar Taxas' });
        }
    },

   

    updateCrediario: async (req, res) => {
        try {
            const baixaParcela = req.body;
            await updateCrediario(baixaParcela);
            res.json({
                message: 'Parcela baixada do Crediario com sucesso!',
            });
        } catch (error) {
            console.error('Erro ao alterar Parcela crediário:', error);
            res.status(500).json({ error: 'Erro ao alterar UpdateEstoque.' });
        }
    },

    updateTaxas: async (req, res) => {
        try {
            const alterTaxa = req.body;
            await updateTaxas(alterTaxa);
            res.json({
                message: 'Alterado taxas do Crediario com sucesso!',
            });
        } catch (error) {
            console.error('Erro ao alterar taxas crediário:', error);
            res.status(500).json({ error: 'Erro ao alterar Updatetaxas.' });
        }
    },

}

module.exports = controllersCrediario;