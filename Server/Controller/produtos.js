const multer = require('multer');
const path = require('path');
const { app } = require('electron'); // Importando o Electron para acessar caminhos dinâmicos

const {
    getAllProdutos,
    findProductByBarcode,
    postNewProduct,
    UpdateProduto
} = require(path.join(__dirname, '../../db/model/modelProduto'));


/// Define o caminho de destino para salvar as imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Aqui usamos app.getPath('userData') para garantir que estamos usando um diretório acessível
        const uploadPath = path.join(app.getPath('userData'), 'img', 'produtos');
        
        // Crie a pasta caso ela não exista
        const fs = require('fs');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath); // Caminho para salvar as imagens
    },
    filename: function (req, file, cb) {
        // Usar o nome original do arquivo ou criar um nome único
        const uniqueFilename = file.originalname; // Adiciona um timestamp para evitar conflitos
        cb(null, uniqueFilename); // Define o nome do arquivo
    }
});

const upload = multer({ storage: storage }).single('image'); // Usa o campo "image" do formulário para upload

const controllersProduto = {

    getAllProducts: async (req, res) => {
        try {
            const produtos = await getAllProdutos();
            res.json(produtos);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            res.status(500).json({ error: 'Erro ao buscar produtos' });
        }
    },

   

    findOneProduct: async (req, res) => {
        try {
            const barcode = req.params.codigoDeBarras;
            const produto = await findProductByBarcode(barcode);
            if (produto.length === 0) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            res.json(produto);
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            res.status(500).json({ error: 'Erro ao buscar produto' });
        }
    },

    postNewProductWithImage: async (req, res) => {
        upload(req, res, async function (err) {
            if (err) {
                console.error('Erro no upload da imagem:', err);
                return res.status(500).json({ message: 'Erro no upload da imagem.', error: err.message });
            }

            // Extrair o caminho da imagem carregada
            const imagePath = req.file ? req.file.path : null;

            // Garantir que os dados do produto sejam um objeto JSON
            let produtoData;
            try {
                produtoData = JSON.parse(req.body.produtoData); // Garantindo que os dados sejam tratados como um objeto
            } catch (parseError) {
                console.error('Erro ao analisar os dados do produto:', parseError);
                return res.status(400).json({ message: 'Dados do produto inválidos.', error: parseError.message });
            }

            // Adiciona o caminho da imagem aos dados do produto, se a imagem foi carregada
            if (imagePath) {
                produtoData.caminho_imagem = imagePath; // Usando o campo correto para salvar no banco de dados
            }

            try {
                // Tente inserir o produto no banco de dados
                const newProductId = await postNewProduct(produtoData); // Certifique-se de que esta função insere corretamente o produto no banco

                // Se a inserção for bem-sucedida, retorne uma resposta de sucesso
                res.status(201).json({
                    message: 'Produto e imagem inseridos com sucesso!',
                    produto_id: newProductId,
                    caminho_imagem: imagePath,
                });
            } catch (error) {
                console.error('Erro ao inserir o produto no banco de dados:', error);
                res.status(500).json({ message: 'Erro ao inserir o produto.', error: error.message });
            }
        });
    },
    // Função para atualizar dados do produto
UpdateProdutoAlterar : async (req, res) => {
    try {
        const produto = req.body; // Dados do produto recebidos no corpo da requisição
        console.log('Recebido no backend (produto):', produto);

        // Função importada para realizar o update no banco
        await UpdateProduto(produto);

        res.json({
            message: 'Update Produto alterado com sucesso!',
        });
    } catch (error) {
        console.error('Erro ao alterar Update produto:', error);
        res.status(500).json({ error: 'Erro ao alterar update produto.' });
    }
},

  UploadImagem : (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Erro ao fazer upload da imagem:', err);
            return res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
        }

        const imagePath = req.file ? req.file.path : null;
        console.log('Imagem salva no caminho:', imagePath);

        res.json({
            message: 'Imagem enviada com sucesso!',
            caminho_imagem: imagePath,
        });
    });
},

};


module.exports = controllersProduto;
