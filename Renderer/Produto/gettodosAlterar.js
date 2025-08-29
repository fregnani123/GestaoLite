// Seleciona os elementos do dropdown
const selectGrupo = document.querySelector('#grupo');
const selectSubGrupo = document.querySelector('#sub-grupo');
const inputFornecedor = document.getElementById('showFornecedor');
const inputFornecedorRazãoSocial = document.querySelector('#inputFornecedorRazãoSocial');
const cnpjFilter = document.querySelector('#cnpjFilter');
const cpfFilter = document.querySelector('#cpfFilter');
const inputSaveIdFornecedor = document.querySelector('#fornecedorID');
const showFornecedor = document.getElementById('showFornecedor')
const selectTamanhoLetras = document.querySelector('#tamanhoLetras');
const selectTamanhoNumeros = document.querySelector('#tamanhoNumeros');
const selectUnidadeMassa = document.querySelector('#unidadeDeMassa');
const selectMedidaVolume = document.querySelector('#medidaVolume');
const selectUnidadeComprimento = document.querySelector('#unidadeComprimento');
const selectUnidadeEstoque = document.querySelector('#unidadeEstoque');
const selectCorProduto = document.querySelector('#corProduto');
const btnConfirmarFornecedor = document.querySelector('#btn-alterar-confirmar');


const inputEstoqueMim = document.getElementById('estoque_minimo');
const inputEstoqueMax = document.getElementById('estoque_maximo');
const selectMarca = document.getElementById('marca_nome');


// Seleciona todos os campos de input
const inputCodigoEANProduto = document.querySelector('#codigoDeBarras');
const btnNomeBuscar = document.querySelector('#btn-nome-buscar');

const inputNomeProduto = document.querySelector('#nomeProduto');
const inputFornecedorFiltrado = document.getElementById('fornecedorEncontrado');
const inputObservacoes = document.querySelector('#observacoes');
const inputMassa = document.querySelector('#massaNumero');
const inputVolume = document.querySelector('#volumeNumero');
const inputComprimento = document.querySelector('#comprimento');
const inputQuantidadeEstoque = document.querySelector('#estoqueQtd');
const inputQuantidadeVendido = document.querySelector('#Qtd_vendido'); //Input Oculto, salva codidade 0 
// const inputPathImg = document.querySelector('#produto-imagem');
// const divImgProduct = document.querySelector('.quadro-img');
const divBuscarPorNome = document.getElementById('divBuscarPorNome');
// const btnFornecedorMenu = document.querySelector('.li-fornecedor');
const containerRegister = document.querySelector('.container-register');
const btnCadGrupo = document.querySelector('#add-grupo');
const btnMarca = document.querySelector('#btnMarca');
const btnCadSubGrupo = document.querySelector('#add-subGrupo');
const btnCadCor = document.querySelector('#add-cor');
const limparButtonFornecedor = document.getElementById('limparButton-fornecedor');
const exitNome = document.getElementById('exit-nome-fornecedor');
const select = document.getElementById("escolhaUM");

// Seleciona os campos de input
const inputMarkup = document.querySelector('#inputMarkup');
const inputPrecoCompra = document.querySelector('#precoCusto');
const inputprecoVenda = document.querySelector('#precoVenda');
const inputLucro = document.querySelector('#lucro');

btnCadGrupo.addEventListener('click', (e) => {
    e.preventDefault();
    containerRegister.style.display = 'flex';
    renderizarInputsGrupo();
});

btnCadSubGrupo.addEventListener('click', (e) => {
    e.preventDefault();
    containerRegister.style.display = 'flex';
    renderizarInputsSubGrupo();
});

btnCadCor.addEventListener('click', (e) => {
    e.preventDefault();
    containerRegister.style.display = 'flex';
    renderizarInputsColor();
});

btnMarca.addEventListener('click', (e) => {
    e.preventDefault();
    containerRegister.style.display = 'flex';
    selectMarca.innerHTML=''
    renderizarMarca();
});


//Metodos criado por mim que renderizam os values iniciais padrões ou cadastrados no DB.
getGrupo(selectGrupo);
getSubGrupo(selectSubGrupo);
getTamanhoLetras(selectTamanhoLetras);
getTamanhoNumeros(selectTamanhoNumeros);
getunidadeComprimento(selectUnidadeComprimento);
getunidadeEstoque(selectUnidadeEstoque);
getMedidaVolume(selectMedidaVolume);
getCorProduto(selectCorProduto);
getunidadeDeMassa(selectUnidadeMassa);
getMarca(selectMarca);


const divTamanho = document.getElementById("divTamanho");
const divTamanhoNum = document.getElementById("divTamanhoNUm");
const volumeDiv = document.getElementById("volumeDiv");
const comprimentoDiv = document.getElementById("comprimentoDiv");
const massaDiv = document.getElementById("massaDiv");

const sections = {
    "Tamanho - P/GG": divTamanho,
    "Tamanho - Numeração": divTamanhoNum,
    "Medida de Volume": volumeDiv,
    "Unidade Comprimento": comprimentoDiv,
    "Unidade de Massa": massaDiv
};

function atualizarSelect() {
    for (const [nome, div] of Object.entries(sections)) {
        if (getComputedStyle(div).display === 'flex') {
            select.value = nome;
            break;  // Para assim que encontrar a primeira div visível
        }
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("escolhaUM");

    const sections = {
        "Tamanho - P/GG": divTamanho,
        "Tamanho - Numeração": divTamanhoNum,
        "Medida de Volume": volumeDiv,
        "Unidade Comprimento": comprimentoDiv,
        "Unidade de Massa": massaDiv
    };

    select.addEventListener("change", function () {
        // Oculta todos os divs
        Object.values(sections).forEach(div => {
            div.style.display = "none";
        });

        // Exibe o div correspondente, se um valor válido for selecionado
        const selectedValue = select.value;
        if (sections[selectedValue]) {
            sections[selectedValue].style.display = "flex";
        }

        // Atualiza o select (opcional, pode remover se quiser)
        atualizarSelect();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const codigoDeBarrasAlter = document.querySelector('.codigoDeBarras');
    if (codigoDeBarrasAlter) {
        codigoDeBarrasAlter.focus();
    }
    inputMaxCaracteres(codigoDeBarrasAlter, 13);
});

// Função para calcular lucro
function calcularLucro() {
    // Remove qualquer coisa que não seja número, e converte para float
    let precoCompraNum = parseFloat(inputPrecoCompra.value.replace(/\D/g, '')) / 100;
    let precoVendaNum = parseFloat(inputprecoVenda.value.replace(/\D/g, '')) / 100;

    // Verifica se os valores são números válidos
    if (isNaN(precoCompraNum) || isNaN(precoVendaNum)) {
        inputLucro.value = ''; // Se não for válido, limpa o campo
        return;
    }

    // Calcula o lucro
    const lucro = precoVendaNum - precoCompraNum;

    // Atualiza o campo de lucro com o valor calculado
    inputLucro.value = lucro < 0 ? '0,00' : lucro.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}


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
            console.log('Produtos do array:', produtoFilter);

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

function getFornecedorID(filter) {
    const url = 'http://localhost:3000/fornecedor';

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'segredo123'
        }
    })
        .then(response => {
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log('✅ Dados do fornecedor:', data);
            console.log('🔎 Fornecedor encontrado:', data);
            const fornecedor = data.find(f => f.fornecedor_id === Number(filter));

            if (fornecedor) {
                inputFornecedor.value = fornecedor.razao_social;
                console.log('🔎 Fornecedor encontrado:', fornecedor);
            } else {
                alertMsg('Fornecedor não encontrado', 'info', 3000);
            }
        })
        .catch(() => {
            alertMsg('Erro ao buscar dados do fornecedor', 'error', 3000);
            console.log('Erro ao buscar dados do fornecedor');
        });
}

// Função para preencher os inputs e ativar os divs necessários
async function preencherInputs(produtoEncontrado) {



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
    getFornecedorID(produtoEncontrado.fornecedor_id);
    inputSaveIdFornecedor.value = produtoEncontrado.fornecedor_id
    selectCorProduto.value = produtoEncontrado.cor_produto_id || '';
    inputObservacoes.value = produtoEncontrado.observacoes || '';
    inputEstoqueMim.value = produtoEncontrado.estoque_minimo;
    inputEstoqueMax.value = produtoEncontrado.estoque_maximo;
    selectMarca.value = produtoEncontrado.marca_nome;


    calcularLucro()
    // Exibir o div correto ao carregar a página conforme o select

    // Verificar se o caminho da imagem existe e definir a imagem correta
    if (imgPath && fs.existsSync(imgPath)) {
        imgProduto.src = imgPath;  // Caminho da imagem fornecido
    } else {
        relativePath.src = '../style/img/em-estoque.png';  // Imagem padrão caso não haja imagem
    }

    exibirDivsSeNecessario(produtoEncontrado); // Exibe os divs necessários
}


// Função para filtrar produto por código EAN
function filterProdutoEan(codigoEan) {
    const produtoEncontrado = produtoFilter.find(produto => produto.codigo_ean === codigoEan);
    if (produtoEncontrado) {
        console.log('Produto Filtrado EAN:', produtoEncontrado)
        preencherInputs(produtoEncontrado);
        calcularLucro()
        setTimeout(() => {
            atualizarSelect();
        }, 300); // espera 300ms — ajuste conforme necessário

    } else {
        alertMsg('Produto não encontrado, verifique se o código EAN está correto.', 'info');
    }
}



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
        inputFornecedor.value = '';
        selectCorProduto.value = '';
        inputObservacoes.value = '';
        select.value = '';
        relativePath.src = "../style/img/alterar-interno.png";
        inputEstoqueMim.value = '';
        inputEstoqueMax.value = '';
        inputMarca.value = '';
    }
});





document.addEventListener('DOMContentLoaded', (event) => {
    const inputPathImg = document.querySelector('#produto-imagem');
    const divImgProduct = document.querySelector('.quadro-img');

    inputPathImg.onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            // Verifica se já existe uma imagem com a classe .img-produto e a remove
            let imgProduto = divImgProduct.querySelector('.img-produto');
            if (imgProduto) {
                divImgProduct.removeChild(imgProduto);
            }

            // Cria um novo elemento de imagem
            imgProduto = document.createElement('img');
            imgProduto.className = 'img-produto';

            const reader = new FileReader();

            reader.onload = function (e) {
                imgProduto.src = e.target.result;
            };

            reader.readAsDataURL(file);

            // Adiciona a nova imagem à div.quadro-img
            divImgProduct.appendChild(imgProduto);

            const relativePath = file.name.replace(/\.[^/.]+$/, "");
            inputPathImg.setAttribute('data-relative-path', relativePath);
        }
    };
});








btnNomeBuscar.addEventListener('click', (e) => {
    e.preventDefault();
    divBuscarPorNome.style.display = 'block';
    setTimeout(() => {
        inputBuscaNome.focus()
    }, 100)
});

btnConfirmarFornecedor.addEventListener('click', (e) => {
    e.preventDefault();
    if (inputFornecedorRazãoSocial.value.trim() === '') {
        alertMsg('Nenhum fornecedor selecionado.', 'info', 3000);
        return;
    }
    else {
        divContainerFornecedor.style.display = 'none';
        setTimeout(() => {
            inputCodigoEANProduto.focus()
        }, 100)
    }
});

// Adiciona um atraso para evitar requisições a cada digitação
let timeout;

cnpjFilter.addEventListener('input', (e) => {
    cpfFilter.value = ''
    formatarCNPJ(cnpjFilter);
    inputMaxCaracteres(cnpjFilter, 18);

    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const cnpj = cnpjFilter.value;

        if (cnpj.length === 18) {
            getFornecedor(cnpjFilter);
        } else {
            limparFornecedor(); // sua função de limpeza aqui
        }
    }, 100);
});

cpfFilter.addEventListener('input', (e) => {
    cnpjFilter.value = ''
    formatarCNPJ(cpfFilter);
    inputMaxCaracteres(cpfFilter, 18);

    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const cnpj = cpfFilter.value;

        if (cnpj.length === 18) {
            getFornecedor(cpfFilter);
        } else {
            limparFornecedor(); // sua função de limpeza aqui
        }
    }, 100);
});

limparButtonFornecedor.addEventListener('click', () => {
    limparFornecedor();
    cpfFilter.value = '';
    cnpjFilter.value = '';
})

function limparFornecedor() {
    inputFornecedorFiltrado.value = '';
    inputFornecedorRazãoSocial.value = '';
    inputSaveIdFornecedor.value = '';
    showFornecedor.value = '';

}



const btnBuscarFornecedor = document.getElementById('buscar-fornecedor');
const divContainerFornecedor = document.getElementById('divFornecedor');
const btnExitFornecedor = document.getElementById('btn-exit-fornecedor-prod');

btnBuscarFornecedor.addEventListener('click', (e) => {
    e.preventDefault();
    divContainerFornecedor.style.display = 'flex';
    cnpjFilter.focus();
})
btnExitFornecedor.addEventListener('click', (e) => {
    e.preventDefault();
    divContainerFornecedor.style.display = 'none';
    cnpjFilter.value = '';
    cpfFilter.value = '';
    inputBuscaNome.value = '';
    if (inputBuscaNome.value === '') {
        resultadoNomes.innerHTML = ''
    }
    limparFornecedor(); // sua função de limpeza aqui
})

exitNome.addEventListener('click', (e) => {
    e.preventDefault();
    if (divBuscarPorNome.style.display === 'block') {
        divBuscarPorNome.style.display = 'none';
        cnpjFilter.focus();
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

inputFile.addEventListener('click', function (e) {
    if (inputCodigoEANProduto.value === '') {
        alertMsg('Filtre o produto antes de selecionar a imagem', 'info', 3000);
        e.preventDefault(); // Impede a abertura da janela de arquivos
    }
});

inputFile.addEventListener('change', function () {
    if (inputCodigoEANProduto.value === '') {
        alertMsg('Filtre o produto antes de selecionar a imagem', 'info', 3000)
        return;
    }
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
        fornecedor_id: inputSaveIdFornecedor.value || null,
        caminho_img_produto: fileNameGlobal || imagePath || '',
        cor_produto_id: selectCorProduto.value || null,
        observacoes: inputObservacoes.value.trim() || '',
        codigo_ean: inputCodigoEANProduto.value.trim(),
        estoque_minimo: inputEstoqueMim.value,
        estoque_maximo: inputEstoqueMax.value,
        marca_nome: selectMarca.value
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
filterButtonAlterar.addEventListener('click', () => {
    location.reload();
})