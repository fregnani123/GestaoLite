const mongoose = require('mongoose');

const MensagemChat = new mongoose.Schema({
    remetente: {
      type: String,
      required: true
    },
    cliente: {
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
    },
    finalizado: {
      type: Boolean,
      default: false
    }
  });

module.exports = mongoose.model('msgChat', MensagemChat, 'msgChat');