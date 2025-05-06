const mongoose = require('mongoose');

const MensagemSchema = new mongoose.Schema({
  remetente: {
    type: String,
    required: true
  },
  mensagem: {
    type: String,
    required: true
  },
  data_envio: {
    type: Date,
    default: Date.now
  },
  visualizado: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('MensagemUser', MensagemSchema, 'mensagemUsers');


