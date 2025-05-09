const express = require('express');
const path = require('path');
const Routes = require(path.join(__dirname, '../Server/Router/routes'));
const { conectarMongoDB } = require(path.join(__dirname, '../db/mongoDB'));
const cors = require('cors');
const { getAllProdutos } = require(path.join(__dirname, '../db/model/modelProduto'));
require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

const serverApp = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
serverApp.use(express.json());
serverApp.use(cors());

// 🔒 Middleware para verificar a chave de API
const apiKey = process.env.API_KEY;

serverApp.use((req, res, next) => {
    const userKey = req.headers['x-api-key'];
    if (userKey && userKey === apiKey) {
        next();
    } else {
        res.status(401).json({ message: 'Acesso não autorizado' });
    }
});

// Rotas protegidas
serverApp.use(Routes);

// Inicialização do servidor
const startServer = async () => {
    try {
        
        await getAllProdutos();
        console.log('Servidor Sqlite-Better conectado com sucesso!');

        serverApp.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao conectar ao sqlite-better ou MongoDB:', error);
    }
};

module.exports = startServer;
