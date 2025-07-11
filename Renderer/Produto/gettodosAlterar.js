const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

// Constantes de API
const apiEndpointsAlterar = {
    getAllProdutos: 'http://localhost:3000/produtos',
    updateProduto: 'http://localhost:3000/UpdateProduto',
    uploadImagem: 'http://localhost:3000/upload-imagem',
};

const relativePath = document.querySelector('.img-produto');
const findProduto = document.querySelector('.codigoDeBarras');
const btnAlterarProduto = document.querySelector('.btn-alterar-produto');
let produtoFilter = []; // Array para armazenar os produtos retornados da API


// Função para buscar todos os produtos
function fetchAllProdutos() {
    fetch(apiEndpointsAlterar.getAllProdutos, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            produtoFilter = data; // Armazena os produtos no array global
            // console.log('Produtos do array:', produtoFilter);
        })
        .catch(error => console.error('Erro ao buscar produtos:', error));
}

// Chama a função para carregar os produtos
fetchAllProdutos();

// Função para mapear e exibir os divs necessários
function exibirDivsSeNecessario(produtoEncontrado) {
    const sections = {
        tamanho_letras_id: "divTamanho",
        tamanho_num_id: "divTamanhoNUm",
        medida_volume_id: "volumeDiv",
        unidade_comprimento_id: "comprimentoDiv",
        unidade_massa_id: "massaDiv"
    };

    Object.entries(sections).forEach(([campo, idDiv]) => {
        const valor = produtoEncontrado[campo];
        const div = document.getElementById(idDiv);

        if (valor && div) {
            div.style.display = "flex"; // Exibe o div se o valor for válido
        } else if (div) {
            div.style.display = "none"; // Oculta o div se o valor for inválido
        }
    });
}

let imagePath = '';

// Função para preencher os inputs e ativar os divs necessários
async function preencherInputs(produtoEncontrado) {

    getFornecedor(produtoEncontrado.fornecedor_id)

    // Solicitar o caminho APPDATA
    const appDataPath = await ipcRenderer.invoke('get-app-data-path');
    const imgDir = path.join(appDataPath, 'electronmysql', 'img', 'produtos');

    // Definir o caminho da imagem (se não houver, vai ser uma string vazia)
    imagePath = produtoEncontrado.caminho_img_produto || '';

    const imgPath = imagePath ? path.join(imgDir, imagePath) : null;
    const imgProduto = document.querySelector('.img-produto');

    inputCodigoEANProduto.value = produtoEncontrado.codigo_ean;
    selectGrupo.value = produtoEncontrado.grupo_id;
    selectSubGrupo.value = produtoEncontrado.sub_grupo_id;
    inputNomeProduto.value = produtoEncontrado.nome_produto;
    selectTamanhoLetras.value = produtoEncontrado.tamanho_letras_id;
    selectTamanhoNumeros.value = produtoEncontrado.tamanho_num_id;
    selectUnidadeMassa.value = produtoEncontrado.unidade_massa_id;
    selectMedidaVolume.value = produtoEncontrado.medida_volume_id;
    selectUnidadeComprimento.value = produtoEncontrado.unidade_comprimento_id;
    inputQuantidadeEstoque.value = produtoEncontrado.quantidade_estoque;
    inputQuantidadeVendido.value = produtoEncontrado.quantidade_vendido;
    inputPrecoCompra.value = produtoEncontrado.preco_compra.toFixed(2).replace('.', ',');
    inputMarkup.value = produtoEncontrado.markup.toFixed(2).replace('.', ',');
    inputprecoVenda.value = produtoEncontrado.preco_venda.toFixed(2).replace('.', ',');
    selectUnidadeEstoque.value = produtoEncontrado.unidade_estoque_id;
    inputMassa.value = produtoEncontrado.unidade_massa_qtd || '';
    inputVolume.value = produtoEncontrado.medida_volume_qtd || '';
    inputComprimento.value = produtoEncontrado.unidade_comprimento_qtd || '';
    selectFornecedor.value = produtoEncontrado.fornecedor_id;
    selectCorProduto.value = produtoEncontrado.cor_produto_id || '';
    inputObservacoes.value = produtoEncontrado.observacoes || '';

    // Verificar se o caminho da imagem existe e definir a imagem correta
    if (imgPath && fs.existsSync(imgPath)) {
        imgProduto.src = imgPath;  // Caminho da imagem fornecido
    } else {
        relativePath.src = '../style/img/alterar.png';  // Imagem padrão caso não haja imagem
    }

    exibirDivsSeNecessario(produtoEncontrado); // Exibe os divs necessários
}

// Função para filtrar produto por código EAN
function filterProdutoEan(codigoEan) {
    const produtoEncontrado = produtoFilter.find(produto => produto.codigo_ean === codigoEan);
    if (produtoEncontrado) {
        console.log('Produto Filtrado EAN:', produtoEncontrado)
        preencherInputs(produtoEncontrado);
    } else {
        alertMsg('Produto não encontrado, verifique se o código EAN está correto.', 'info');
    }
}



function getFornecedor() {
    const url = 'http://localhost:3000/fornecedor';

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'segredo123'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('✅ Dados do fornecedor:', data);
        // Aqui você pode processar os dados como necessário
    })
    .catch(error => {
        console.error('❌ Erro ao buscar dados do fornecedor:', error);
    });
}
getFornecedor()

fetchAllProdutos(); // Aguarda o carregamento dos produtos
let ultimoCodigoEan = ''; // Variável para armazenar o último valor digitado

findProduto.addEventListener('input', (e) => {
    const codigoEan = e.target.value.trim();

    if (codigoEan.length === 13) {
        if (codigoEan !== ultimoCodigoEan) {
            filterProdutoEan(codigoEan);
            ultimoCodigoEan = codigoEan;
        }
    } else if (codigoEan.length < 13 && ultimoCodigoEan !== '') {
        ultimoCodigoEan = '';
        document.getElementById('divTamanho').style.display = 'none';
        document.getElementById('divTamanhoNUm').style.display = 'none';
        document.getElementById('volumeDiv').style.display = 'none';
        document.getElementById('comprimentoDiv').style.display = 'none';
        document.getElementById('massaDiv').style.display = 'none';
        inputCodigoEANProduto.value = '';
        selectGrupo.value = '';
        selectSubGrupo.value = '';
        inputNomeProduto.value = '';
        selectTamanhoLetras.value = '';
        selectTamanhoNumeros.value = '';
        selectUnidadeMassa.value = '';
        selectMedidaVolume.value = '';
        selectUnidadeComprimento.value = '';
        inputQuantidadeEstoque.value = '';
        inputQuantidadeVendido.value = '';
        inputPrecoCompra.value = '0,00';
        inputMarkup.value = '0';
        inputprecoVenda.value = '0,00';
        selectUnidadeEstoque.value = '';
        inputMassa.value = '';
        inputVolume.value = '';
        inputComprimento.value = '';
        selectFornecedor.value = '';
        selectCorProduto.value = '';
        inputObservacoes.value = '';
        relativePath.src = "../style/img/alterar.png";
    }
});

// Atualizar apenas os dados do produto
async function updateProduto(produto) {
    try {
        const patchResponse = await fetch(apiEndpointsAlterar.updateProduto, {
            method: 'PATCH',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produto),
        });

        if (!patchResponse.ok) {
            console.log('Erro ao atualizar informações do produto');
        } else {
            const data = await patchResponse.json();
            console.log('Produto atualizado com sucesso:', data);
        }
    } catch (error) {
        console.log('Erro ao atualizar o produto:', error);
    }
}

// Upload da imagem do produto
async function uploadImagem(imagemFile) {
    try {
        const formData = new FormData();
        formData.append('image', imagemFile);

        const uploadResponse = await fetch(apiEndpointsAlterar.uploadImagem, {
            method: 'POST',
            headers: {
                'x-api-key': 'segredo123',
            },
            body: formData
        });

        if (!uploadResponse.ok) {
            console.log('Erro ao fazer upload da imagem');
        } else {
            const data = await uploadResponse.json();
            console.log('Imagem enviada com sucesso:', data);
        }
    } catch (error) {
        console.log('Erro no envio da imagem:', error);
    }
}



let inputFile = document.getElementById('produto-imagem');
let fileNameGlobal = ''
const codigoDeBarras = document.querySelector('#codigoDeBarras');

inputFile.addEventListener('change', function () {
    if (this.files && this.files[0]) {
        const fileName = this.files[0].name;
        fileNameGlobal = fileName;
        console.log('Nome do arquivo:', fileName);
        // Você pode exibir o nome do arquivo em algum lugar na página, se desejar
    }
});

function alterarProduto(e) {
    e.preventDefault(); // Evitar comportamento padrão do botão

    // Verificar se campos obrigatórios estão preenchidos
    if (!inputCodigoEANProduto.value.trim()) {
        alertMsg("O código de barras é obrigatório!", 'info');
        return;
    }
    if (!inputNomeProduto.value.trim()) {
        alertMsg("O nome do produto é obrigatório!", 'info');
        return;
    }
    if (!inputPrecoCompra.value.trim() || isNaN(parseFloat(inputPrecoCompra.value.replace(',', '.')))) {
        alertMsg("O preço de compra é obrigatório e deve ser um número válido!", 'info');
        return;
    }
    if (!inputMarkup.value.trim() || isNaN(parseFloat(inputMarkup.value.replace(',', '.')))) {
        alertMsg("O markup é obrigatório e deve ser um número válido!", 'info');
        return;
    }
    if (!inputprecoVenda.value.trim() || isNaN(parseFloat(inputprecoVenda.value.replace(',', '.')))) {
        alertMsg("O preço de venda é obrigatório e deve ser um número válido!", 'info');
        return;
    }

    const coletarDadosAtualizados = {
        grupo_id: selectGrupo.value || null,
        sub_grupo_id: selectSubGrupo.value || null,
        nome_produto: inputNomeProduto.value.trim(),
        tamanho_letras_id: selectTamanhoLetras.value || null,
        tamanho_num_id: selectTamanhoNumeros.value || null,
        unidade_massa_id: selectUnidadeMassa.value || null,
        medida_volume_id: selectMedidaVolume.value || null,
        unidade_comprimento_id: selectUnidadeComprimento.value || null,
        quantidade_estoque: parseInt(inputQuantidadeEstoque.value, 10) || 0,
        quantidade_vendido: parseInt(inputQuantidadeVendido.value, 10) || 0,
        preco_compra: parseFloat(inputPrecoCompra.value.replace(',', '.')),
        markup: parseFloat(inputMarkup.value.replace(',', '.')),
        preco_venda: parseFloat(inputprecoVenda.value.replace(',', '.')),
        unidade_estoque_id: selectUnidadeEstoque.value || null,
        unidade_massa_qtd: parseFloat(inputMassa.value || 0),
        medida_volume_qtd: parseFloat(inputVolume.value || 0),
        unidade_comprimento_qtd: parseFloat(inputComprimento.value || 0),
        fornecedor_id: selectFornecedor.value || null,
        caminho_img_produto: fileNameGlobal || imagePath || '',
        cor_produto_id: selectCorProduto.value || null,
        observacoes: inputObservacoes.value.trim() || '',
        codigo_ean: inputCodigoEANProduto.value.trim()
    };

    try {
        updateProduto(coletarDadosAtualizados);
        
        if (inputFile.files.length > 0) {
            uploadImagem(inputFile.files[0]);
        }

        console.log('Dados a serem enviados:', coletarDadosAtualizados);
        limpar();
        alertMsg("Produto atualizado com sucesso!", 'success');
    } catch (error) {
        console.error("Erro ao atualizar o produto:", error.message);
        alertMsg(`Erro ao atualizar o produto: ${error.message}`, 'error');
    }
}


document.addEventListener('DOMContentLoaded', function () {
    btnAlterarProduto.addEventListener('click', alterarProduto);
});


function limpar() {
    setTimeout(() => {
        // Recarregar a página 
        location.reload();
    }, 2000);
}

const filterButtonAlterar = document.getElementById('limparButton');
filterButtonAlterar.addEventListener('click',()=>{
    location.reload();
  })