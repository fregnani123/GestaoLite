const mongoose = require('mongoose');
const { Licenca }= require('./model/modelMongo'); 
const cxMongo = "mongodb+srv://Fabiano:Freg_1308@cluster0.lkzntjb.mongodb.net/msguser?retryWrites=true&w=majority"
const SchemaMsg = require('./model/mensagemSchema');
const SchemaMsgChat = require('./model/modelMsgSuporte');
const { Mensagem } = require('./model/modelMongo');
const {  MsgSuporte } = require('./model/modelMongo');


const conectarMongoDB = async () => {
  try {
    await mongoose.connect(process.env.PASSWORD_MONGO_DB || cxMongo );  
    console.log('Conexão com o MongoDB bem-sucedida!');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
  }
};

const getLicenca = async (req, res) => {
  try {
    const { userID, serialKey } = req.params;

    console.log('Parâmetros recebidos em req.params:', req.params);

    if (!userID || !serialKey) {
      return res.status(400).json({ message: 'Parâmetros incompletos' });
    }

    console.log('Buscando licença para os parâmetros:', { userID, serialKey });

    const document = await Licenca.findOne({ userID, serialKey });

    if (!document) {
      return res.status(404).json({ message: 'Documento não encontrado' });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
    res.status(500).json({ message: 'Erro ao buscar os dados' });
  }
};


const getMensagensPorRemetente = async (req, res) => {
  try {
    const { remetente } = req.params;

    if (!remetente) {
      return res.status(400).json({ message: 'Remetente não informado' });
    }

    const mensagens = await Mensagem.find({ remetente });

    if (mensagens.length === 0) {
      return res.status(404).json({ message: 'Nenhuma mensagem encontrada para este remetente' });
    }

    res.status(200).json(mensagens);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

const getMensagensPorSuporte = async (req, res) => {
  try {
    const { cliente } = req.params;

    if (!cliente) {
      return res.status(400).json({ message: 'Cliente não informado' });
    }

    const mensagens = await  MsgSuporte.find({ cliente });

    if (mensagens.length === 0) {
      return res.status(404).json({ message: 'Nenhuma mensagem encontrada para este cliente' });
    }

    res.status(200).json(mensagens);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};


const postMensagem = async (req, res) => {
  try {
    const { remetente, mensagem } = req.body;

    // Verificações básicas
    if (!remetente || !mensagem) {
      return res.status(400).json({ message: 'Campos obrigatórios não enviados.' });
    }

    // Cria nova instância do schema
    const novaMensagem = new SchemaMsg({
      remetente,
      mensagem
    });

    // Salva no banco
    await novaMensagem.save();

    res.status(201).json({ message: 'Mensagem enviada com sucesso!', dados: novaMensagem });
  } catch (error) {
    console.error('Erro ao salvar mensagem:', error);
    res.status(500).json({ message: 'Erro interno ao salvar mensagem.' });
  }
};

const postMensagemChat = async (req, res) => {
  try {
    const { remetente, cliente , mensagem , finalizado} = req.body;

    // Verificações básicas
    if (!remetente || !cliente || !mensagem) {
      return res.status(400).json({ message: 'Campos obrigatórios não enviados.' });
    }

    // Cria nova instância do schema
    const novaMensagemChat = new SchemaMsgChat({
      remetente,
      cliente,
      mensagem,
      finalizado
    });

    // Salva no banco
    await novaMensagemChat.save();

    res.status(201).json({ message: 'Mensagem suporte enviada com sucesso!', dados: novaMensagemChat });
  } catch (error) {
    console.error('Erro ao salvar mensagem suporte:', error);
    res.status(500).json({ message: 'Erro interno ao salvar mensagem suporte.' });
  }
};


module.exports = {
  conectarMongoDB,
  getLicenca,
  postMensagem,
  getMensagensPorRemetente,
  postMensagemChat,
  getMensagensPorSuporte 
};
