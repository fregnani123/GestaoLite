const mongoose = require('mongoose');

// Schema de Licença
const serialKeySchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  serialKey: { type: String, required: true, unique: true },
  startedDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  at: { type: Boolean, required: true },
}, { collection: 'serialKeySchema' });

const Licenca = mongoose.model('Licenca', serialKeySchema);

// Schema de Mensagem
const mensagemUsersSchema = new mongoose.Schema({
  remetente: { type: String, required: true },
  mensagem: { type: String, required: true },
  visualizado: { type: Boolean, required: true },
  data_envio: { type: Date, required: true },
}, { collection: 'mensagemUsers' });

const Mensagem = mongoose.model('Mensagem', mensagemUsersSchema);


// Schema de Mensagem suporte
const mensagemSuporteSchema = new mongoose.Schema({
  remetente: { type: String, required: true },
  cliente: { type: String, required: true },
  mensagem: { type: String, required: true },
  visualizado: { type: Boolean, required: true },
  data_envio: { type: Date, required: true },
}, { collection: 'msgChat' });

const MsgSuporte = mongoose.model('MensagemSuporte', mensagemSuporteSchema);

// Exportar os dois modelos corretamente
module.exports = {
  Licenca,
  Mensagem,
  MsgSuporte
};