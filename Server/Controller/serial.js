const path = require('path');
const {
  postNewSerial,
  getSerial,
  updateSerial,
} = require(path.join(__dirname, '../../db/model/modelSerial'));

const controllersSerial = {
  postNewSerial: async (req, res) => {
    try {
      const serialData = req.body;

      // ✅ Validação de chave autorizada (exemplo: chave fixa para venda)
      const serialPermitida = '1947199120022006';

      if (serialData.serialKey !== serialPermitida) {
        return res.status(401).json({ error: 'Chave serial inválida ou não autorizada.' });
      }

      // Se passou, então segue para o model codificar e inserir
      const newSerial = await postNewSerial(serialData);

      res.json({
        message: 'Serial inserido com sucesso!',
        serial_key_id: newSerial
      });

    } catch (error) {
      console.error('Erro ao inserir o serial:', error);

      if (error.message) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Erro ao inserir o serial.' });
    }
  },

  getSerial: async (req, res) => {
    try {
      const serial = await getSerial();
      res.json(serial);
    } catch (error) {
      console.error('Erro ao buscar o serial:', error);
      res.status(500).json({ error: 'Erro ao buscar o serial' });
    }
  },

  alterarTermo: async (req, res) => {
    try {
      const serial = req.body;
      await updateSerial(serial);

      res.json({
        message: 'Update termos de uso alterado com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao alterar termos de uso:', error);
      res.status(500).json({ error: 'Erro ao alterar termos de uso' });
    }
  }

};

module.exports = controllersSerial;
