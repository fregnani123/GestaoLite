const nomeFantasia = document.getElementById('nomeFantasia');
const ulFiltros = document.getElementById('ul-filtros');
const cnpjInfo = document.getElementById('cnpjInfo');
const fornecedorId = document.getElementById('fornecedorId');
const razaoSocial = document.getElementById('razaoSocial');
const linkID_8 = document.querySelector('.list-a8');
const filterButtonLimpar = document.querySelector('.limparButton-info');

function estilizarLinkAtivo(linkID) {
    linkID.style.background = '#5f8ac1';
    linkID.style.textShadow = 'none'; // Sem sombra de texto
    linkID.style.color = 'white'; // Cor do texto
    linkID.style.borderBottom = '2px solid black'; // Borda inferior
}
estilizarLinkAtivo(linkID_8);

filterButtonLimpar.addEventListener('click', () => location.reload());

const apiEndpoints = {
    getGrupo: 'http://localhost:3000/grupos',
    getSubGrupo: 'http://localhost:3000/subGrupos',
    getAllProdutos: 'http://localhost:3000/produtos',
    getAllFornecedor: 'http://localhost:3000/fornecedor'
};

let allProducts = [];

function getFornecedor(cnpj) {
    fetch(apiEndpoints.getAllFornecedor, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const fornecedor = data.find(f => f.cnpj === cnpj) || {};
        razaoSocial.value = fornecedor.razao_social || "";
        nomeFantasia.value = fornecedor.nome_fantasia || "";
        fornecedorId.value = fornecedor.fornecedor_id || "";

        // Se encontrou fornecedor, aplica os filtros automaticamente
        if (fornecedorId.value) {
            applyFilters();
        }
    })
    .catch(error => console.error('Erro ao buscar dados:', error));
}


formatarCNPJ(cnpjInfo);
inputMaxCaracteres(cnpjInfo, 18);
cnpjInfo.addEventListener('input', (e) => getFornecedor(e.target.value));

document.addEventListener('DOMContentLoaded', async () => {
    cnpjInfo.focus();
    await fetchAllProdutos(); // Buscar produtos antes de executar o filtro
    produtoSemFornecedor(); // Agora os produtos já foram carregados
});


function formatarMoedaBR(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

// Buscar todos os produtos ao carregar a página
async function fetchAllProdutos() {
    try {
        const response = await fetch(apiEndpoints.getAllProdutos, {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            }
        }
        );
        const data = await response.json();
        allProducts = data; // Agora a variável tem os produtos carregados
        console.log(allProducts);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}


function produtoSemFornecedor() {
    const allProductsSF = allProducts.filter(produtosSF => produtosSF.fornecedor_id === 1 || produtosSF.fornecedor_id === null)
    renderProdutos(ulFiltros, allProductsSF)
}

function renderProdutos(renderer, produtos) {
    renderer.innerHTML = '';

    const totalItens = produtos.length;
    const valorEstoque = produtos.reduce((acc, produto) => acc + (parseFloat(produto.preco_compra || 0) * parseInt(produto.quantidade_estoque || 0)), 0);

    const semVinculo = document.querySelector('.div-info-row')
    // Verifica se os produtos exibidos são aqueles sem fornecedor vinculado (fornecedor_id === 1 ou null)
    const produtosSemFornecedor = produtos.every(produto => produto.fornecedor_id === 1 || produto.fornecedor_id === null);

    if (produtosSemFornecedor) {
        semVinculo.textContent = `⚠️ Total de produtos sem vínculo com fornecedor: ${totalItens} | Valor total em estoque (baseado no preço de compra): ${formatarMoedaBR(valorEstoque)}`;
        semVinculo.style.background = 'rgb(255, 255, 192)';
        semVinculo.style.fontSize = '1.2';
    }



    const headerRow = document.createElement('li');
    headerRow.classList.add('header-row');


    let unidades = ['un', 'cx', 'Rolo', 'pc'];
    produtos.forEach(produto => {
        const li = document.createElement('li');
        li.classList.add('li-list');
        li.innerHTML = `
            <span>${produto.codigo_ean || 'Sem código'}</span>
            <span>${produto.nome_produto || 'Produto desconhecido'}</span>
            <span>${formatarMoedaBR(parseFloat(produto.preco_compra || 0))}</span>
            <span>${produto.quantidade_vendido || 0}</span>
            <span>${produto.quantidade_estoque} ${unidades[produto.unidade_estoque_id - 1] || ''}</span>`;
        renderer.appendChild(li);
    });
}


function applyFilters() {
    if (!fornecedorId.value) {
        alertMsg('Por favor, preencha o CNPJ corretamente antes de filtrar os produtos.', 'info', 4000);
        return;
    }

    const filteredProducts = allProducts.filter(produto => produto.fornecedor_id == fornecedorId.value);
    renderProdutos(ulFiltros, filteredProducts);
    clearInputs();
}


function clearInputs() {
    document.getElementById('codigoEAN').value = '';
    document.getElementById('produtoNome').value = '';
    document.getElementById('selectGrupo').value = '';
    document.getElementById('selectSubGrupo').value = '';
}



produtoSemFornecedor()