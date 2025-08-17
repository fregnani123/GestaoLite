const nomeFantasia = document.getElementById('nomeFantasia');
const ulFiltros = document.getElementById('ul-filtros');
const cnpjInfo = document.getElementById('cnpjInfo');
const fornecedorId = document.getElementById('fornecedorId');
const razaoSocial = document.getElementById('razaoSocial');
const linkID_8 = document.querySelector('.list-a8');
const filterButtonLimpar = document.querySelector('.limparButton-info');
const pessoa = document.getElementById('tipoPessoa');
const labelCnpjCPF = document.getElementById('labelCnpjCPF');
const labelRazao = document.getElementById('labelRazao');
const contato = document.getElementById('contato');

const btnAtivo = document.getElementById('btn-ativo');

function estilizarLinkAtivo(linkID) {
    if (btnAtivo.id === 'btn-ativo') {
        linkID.style.background = '#3a5772';
        linkID.style.textShadow = 'none';
        linkID.style.color = 'white';
        linkID.style.borderBottom = '2px solid #d7d7d7';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    estilizarLinkAtivo(linkID_8)
})

filterButtonLimpar.addEventListener('click', () => location.reload());

const apiEndpoints = {
    getGrupo: 'http://localhost:3000/grupos',
    getSubGrupo: 'http://localhost:3000/subGrupos',
    getAllProdutos: 'http://localhost:3000/produtos',
    getAllFornecedor: 'http://localhost:3000/fornecedor'
};

let allProducts = [];

function getFornecedor(cnpjInfo) {
    fetch(apiEndpoints.getAllFornecedor, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const fornecedor = data.find(f => f.cnpj === cnpjInfo) || {};
            razaoSocial.value = fornecedor.razao_social || "";
            nomeFantasia.value = fornecedor.nome_fantasia || "";
            fornecedorId.value = fornecedor.fornecedor_id || "";
            contato.value = fornecedor.telefone || "";

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
    pessoa.focus();
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
    const allProductsSF = allProducts.filter(produtosSF => produtosSF.fornecedor_id === 1 || produtosSF.fornecedor_id === null);
    renderProdutos(ulFiltros, allProductsSF);
}

function renderProdutos(renderer, produtos) {
    renderer.innerHTML = '';
    const totalItens = produtos.length;
    const valorEstoque = produtos.reduce((acc, produto) => acc + (parseFloat(produto.preco_compra || 0) * parseInt(produto.quantidade_estoque || 0)), 0);

    // Atualiza o texto de resumo fora da tabela, ajustando o seletor conforme seu HTML
    const semVinculo = document.querySelector('.div-info-row table tr:nth-child(2) td:nth-child(1)');
    if (semVinculo) {
        semVinculo.textContent = `${totalItens}`;
        semVinculo.style.color = ''
    }

    const semVinculoValor = document.querySelector('.div-info-row table tr:nth-child(2) td:nth-child(2)');
    if (semVinculoValor) {
        semVinculoValor.textContent = `${formatarMoedaBR(valorEstoque)}`;
    }

    let unidades = ['un', 'cx', 'Rolo', 'pc'];
    produtos.forEach((produto, index) => {
        const tr = document.createElement('tr');
        tr.classList.add('table-row');
        // ✅ Alterna entre branco e azul
        tr.classList.add(index % 2 === 0 ? 'linha-branca' : 'linha-azul');
        tr.innerHTML = `
            <td>${produto.codigo_ean || 'Sem código'}</td>
            <td>${produto.nome_produto || 'Produto desconhecido'}</td>
            <td>${formatarMoedaBR(parseFloat(produto.preco_compra || 0))}</td>
            <td>${produto.quantidade_vendido || 0} ${unidades[produto.unidade_estoque_id - 1] || ''}</td>
            <td>${produto.quantidade_estoque || 0} ${unidades[produto.unidade_estoque_id - 1] || ''}</td>
          
        `;
        renderer.appendChild(tr);
    });


    const headerRow = document.createElement('li');
    headerRow.classList.add('header-row');

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




function criarLabelComImagem(texto, comImagem = false) {
    const spanWrapper = document.createElement('span');
    spanWrapper.style.display = 'inline-flex';
    spanWrapper.style.alignItems = 'center';
    spanWrapper.style.justifyContent = 'center';
    spanWrapper.style.gap = '5px';

    const textoNode = document.createTextNode(texto);
    spanWrapper.appendChild(textoNode);

    if (comImagem) {
        const imgLupa = document.createElement('img');
        imgLupa.classList.add('imgLupa');
        imgLupa.src = "../style/img/procurar-black.png";
        imgLupa.style.width = "25px";
        spanWrapper.appendChild(imgLupa);
    }

    return spanWrapper;
}

pessoa.addEventListener('change', () => {
    if (pessoa.value === "juridica") {
        // Texto + lupa
        labelCnpjCPF.innerHTML = '';
        labelCnpjCPF.appendChild(criarLabelComImagem('CNPJ', true));

        labelRazao.innerHTML = 'Razão Social';
        cnpjInfo.placeholder = "Digite o CNPJ";
        razaoSocial.placeholder = "Digite a Razão Social";
        cnpjInfo.style.display = '';
        razaoSocial.style.display = '';
        cnpjInfo.value = '';
        cnpjInfo.removeAttribute('readonly');
        razaoSocial.removeAttribute('readonly');
        formatarCNPJ(cnpjInfo);
        inputMaxCaracteres(cnpjInfo, 18);
        nomeFantasia.removeAttribute('readonly');
        nomeFantasia.placeholder = 'Digite o nome fantasia';
        pessoa.focus();

    } else if (pessoa.value === "fisica") {
        // Texto + lupa
        labelCnpjCPF.innerHTML = '';
        labelCnpjCPF.appendChild(criarLabelComImagem('CPF', true));

        cnpjInfo.placeholder = "Digite o CPF";
        labelRazao.innerHTML = 'Nome completo do fornecedor';
        razaoSocial.placeholder = "Digite o nome do Fornecedor";
        cnpjInfo.style.display = '';
        razaoSocial.style.display = '';
        nomeFantasia.placeholder = 'Campo bloqueado para fornecedor pessoa física';

        razaoSocial.addEventListener('change', () => {
            if (pessoa.value === "fisica") {
                nomeFantasia.value = razaoSocial.value;
            }
        });

        cnpjInfo.value = '';
        cnpjInfo.removeAttribute('readonly');
        razaoSocial.removeAttribute('readonly');
        nomeFantasia.setAttribute('readonly', true);
        nomeFantasia.value = razaoSocial.value;
        formatarEVerificarCPF(cnpjInfo);
        inputMaxCaracteres(cnpjInfo, 14);
        cnpjInfo.focus();

    } 
});

 pessoa.addEventListener('change', () => {
    if(pessoa.value === '') {
     location.reload();
    }
})



function clearInputs() {
    document.getElementById('codigoEAN').value = '';
    document.getElementById('produtoNome').value = '';
    document.getElementById('selectGrupo').value = '';
    document.getElementById('selectSubGrupo').value = '';
}



produtoSemFornecedor()