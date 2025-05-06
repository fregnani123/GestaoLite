const path = require('path');
const {
    postNewProductGrupo,
    postNewProductSubGrupo,
    getGrupo,
    getSubGrupo
} = require(path.join(__dirname, '../../db/model/modelGrupo'));


const controllersGruposProduto = {

    getGrupo: async (req, res) => {
        try {
            const categorias = await getGrupo();
            res.json(categorias);
        } catch (error) {
            console.error('Erro ao buscar Categoria de Produto:', error);
            res.status(500).json({ error: 'Erro ao buscar Categoria de Produto' });
        }
    },

   
    getSubGrupo: async (req, res) => {
        try {
            const grupoProduto = await getSubGrupo();
            res.json(grupoProduto);
        } catch (error) {
            console.error('Erro ao buscar grupo_produto:', error);
            res.status(500).json({ error: 'Erro ao buscar grupo_produto' });
        }
    },

    postNewProductGrupo: async (req, res) => {
        try {
            const grupoData = req.body;
            const newGrupoProductId = await postNewProductGrupo(grupoData);

            res.json({
                message: 'Grupo inserido com sucesso!',
                grupo_id: newGrupoProductId
            });
        } catch (error) {
            console.error('Erro ao inserir novo grupo:', error);
            res.status(500).json({ error: 'Erro ao inserir novo grupo.' });
        }
    },

    postNewProductSubGrupo: async (req, res) => {
        try {
            const subGrupoData = req.body;
            const newGrupoProductId = await postNewProductSubGrupo(subGrupoData);

            res.json({
                message: 'Grupo inserido com sucesso!',
                subGrupo_id: newGrupoProductId
            });
        } catch (error) {
            console.error('Erro ao inserir novo sub-grupo:', error);
            res.status(500).json({ error: 'Erro ao inserir novo sub-grupo.' });
        }
    },

}

module.exports = controllersGruposProduto;