const path = require('path');
const {
    postNewUsuario,
    getUsuario,
    updateUsuario
} = require(path.join(__dirname, '../../db/model/modelUsuario'));


const controllersUsuario = {

    getUsuario: async (req, res) => {
           try {
               const usuario = await getUsuario();
               res.json(usuario);
           } catch (error) {
               console.error('Erro ao buscar usuário:', error);
               res.status(500).json({ error: 'Erro ao buscar usuário:' });
           }
       },
 
    postNewUsuario: async (req, res) => {
         try {
             const usuario = req.body;
             const newUsuario = await postNewUsuario(usuario);
 
             res.json({
                 message: 'usúario inserido com sucesso!',
                 id: newUsuario
             });
         } catch (error) {
             console.error('Erro ao inserir novo usúario:', error);
             res.status(500).json({ error: 'Erro ao inserir novo usúario.' });
         }
     },

     updateUsuario: async (req, res) => {
        try {
            const usuario = req.body;
    
            // Verificar se o CNPJ foi enviado
            if (!usuario.id) {
                return res.status(400).json({ error: 'O campo id é obrigatório.' });
            }
    
            const changes = await  updateUsuario(usuario);
    
            if (changes > 0) {
                res.json({ message: 'Usuário atualizado com sucesso!' });
            } else {
                res.status(404).json({ error: 'Usuário não encontrado ou nenhuma alteração realizada.' });
            }
    
        } catch (error) {
            console.error('Erro ao alterar Usuário:', error);
            res.status(500).json({ error: 'Erro ao alterar Usuário.' });
        }
    }
 
 }
 
 module.exports = controllersUsuario;