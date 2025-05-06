const path = require('path');
const {
    getTamanhoLetras,
    getTamanhoNumeros,
    getUnidadeMassa,
    getMedidaVolume,
    getUnidadeComprimento,
    getCorProduto,
    postNewCor
} = require(path.join(__dirname, '../../db/model/modeUnidadeMedida'));


const controllersUnidadeMedida = {
   getTamanhoLetras: async (req, res) => {
          try {
              const tamanhoLetras = await getTamanhoLetras();
              res.json(tamanhoLetras);
          } catch (error) {
              console.error('Erro ao buscar tamanhoLetras:', error);
              res.status(500).json({ error: 'Erro ao buscar tamanhoLetras' });
          }
      },
  
  
      getTamanhoNumeros: async (req, res) => {
          try {
              const tamanhoNumeros = await getTamanhoNumeros();
              res.json(tamanhoNumeros);
          } catch (error) {
              console.error('Erro ao buscar tamanhoNumeros:', error);
              res.status(500).json({ error: 'Erro ao buscar tamanhoNumeros' });
          }
      },
  
      getMedidaVolume: async (req, res) => {
          try {
              const medidaVolume = await getMedidaVolume();
              res.json(medidaVolume);
          } catch (error) {
              console.error('Erro ao buscar MedidaVolume:', error);
              res.status(500).json({ error: 'Erro ao buscar MedidaVolume' });
          }
      },
  
      getUnidadeMassa: async (req, res) => {
          try {
              const unidadeMassa = await getUnidadeMassa();
              res.json(unidadeMassa);
          } catch (error) {
              console.error('Erro ao buscar UnidadeMassa:', error);
              res.status(500).json({ error: 'Erro ao buscar UnidadeMassa' });
          }
      },
  
      getUnidadeComprimento: async (req, res) => {
          try {
              const unidadeComprimento = await getUnidadeComprimento();
              res.json(unidadeComprimento);
          } catch (error) {
              console.error('Erro ao buscar UnidadeComprimento:', error);
              res.status(500).json({ error: 'Erro ao buscar UnidadeComprimento' });
          }
      },
  
      getCorProduto: async (req, res) => {
          try {
              const corProduto = await getCorProduto();
              res.json(corProduto);
          } catch (error) {
              console.error('Erro ao buscar Cor do Produto:', error);
              res.status(500).json({ error: 'Erro ao buscar Cor do Produto' });
          }
      },

      postNewProductCor: async (req, res) => {
        try {
            const CorData = req.body;
            const newCorProductId = await postNewCor(CorData);

            res.json({
                message: 'cCor inserido com sucesso!',
                cor_produto_id: newCorProductId
            });
        } catch (error) {
            console.error('Erro ao inserir nova cor:', error);
            res.status(500).json({ error: 'Erro ao inserir nova Cor.' });
        }
    },

}

 

module.exports = controllersUnidadeMedida;