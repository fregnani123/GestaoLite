// Constantes de API
const apiEndpoints = {
    getGrupo: 'http://localhost:3000/grupos',
    getSubGrupo: 'http://localhost:3000/subGrupos',
    getAllProdutos: 'http://localhost:3000/produtos',
};

// Seletores do DOM
const selectGrupo = document.getElementById('grupo');
const selectSubGrupo = document.getElementById('subgrupo');
const ulFiltros = document.getElementById('ul-filtros'); // Lista para renderizar os produtos
const codigoEAN = document.getElementById('codigoEAN');
const produtoNome = document.getElementById('produtoNome');
const filtrarProdutosButton = document.getElementById('filtrarProdutos');
const linkID_4 = document.querySelector('.list-a4')

function estilizarLinkAtivo(linkID) {
  linkID.style.background = '#ffcc00'; // Cor de fundo
  linkID.style.textShadow = 'none'; // Sem sombra de texto
  linkID.style.color = 'black'; // Cor do texto
  linkID.style.borderBottom = '2px solid black'; // Borda inferior
}
estilizarLinkAtivo(linkID_4);

document.addEventListener('DOMContentLoaded',()=>{
    codigoEAN.focus();
})

let allProducts = []; // Variável para armazenar todos os produtos
formatarCodigoEANProdutos(codigoEAN)

// Função para formatar valores como moeda brasileira
function formatarMoedaBR(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

// Função para buscar e renderizar os grupos
function getGrupo(renderer) {
    fetch(apiEndpoints.getGrupo, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => a.nome_grupo.localeCompare(b.nome_grupo));
            data.forEach(grupo => {
                const option = document.createElement('option');
                option.textContent = grupo.nome_grupo;
                option.value = grupo.grupo_id;
                renderer.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao buscar grupos:', error));
}

// Função para buscar e renderizar os subgrupos
function getSubGrupo(renderer) {
    fetch(apiEndpoints.getSubGrupo, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => a.nome_sub_grupo.localeCompare(b.nome_sub_grupo));
            data.forEach(subGrupo => {
                const option = document.createElement('option');
                option.textContent = subGrupo.nome_sub_grupo;
                option.value = subGrupo.sub_grupo_id;
                renderer.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao buscar subgrupos:', error));
}

// Função para buscar todos os produtos
function fetchAllProdutos(renderer) {
    fetch(apiEndpoints.getAllProdutos, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            renderProdutos(renderer, allProducts);
            console.log(data)
        })
        .catch(error => console.error('Erro ao buscar produtos:', error));
}

// Função para renderizar os produtos
function renderProdutos(renderer, produtos) {
    renderer.innerHTML = '';

    // Informações agregadas no topo
    const totalItens = produtos.length;
    const valorEstoque = produtos.reduce((acc, produto) => {
        return acc + (parseFloat(produto.preco_compra || 0) * parseInt(produto.quantidade_estoque || 0));
    }, 0);

    const infoRow = document.createElement('li');
    infoRow.classList.add('info-row');
    infoRow.textContent = `Total de itens: ${totalItens} | Valor total em estoque (baseado no preço de compra): ${formatarMoedaBR(valorEstoque)}`;
    renderer.appendChild(infoRow);

    // Cabeçalho das colunas
    const headerRow = document.createElement('li');
    headerRow.classList.add('header-row');
    headerRow.innerHTML = `
        <span>Código de Barras</span>
        <span id="spanDescricaoProduto">Nome do Produto / Características</span>
        <span>Estoque Atual</span>
        <span>Preço Compra</span>
        <span>Preço Venda</span>
        <span>Qtd Vendida</span>
      
    `;
    renderer.appendChild(headerRow);

    // Dados dos produtos
    let unidades = ['un', 'cx', 'Rolo', 'pc'];

    produtos.forEach(produto => {
        const li = document.createElement('li');
        li.classList.add('li-list');

        const spanCodigo = document.createElement('span');
        spanCodigo.textContent = produto.codigo_ean || 'Sem código';

        const spanNome = document.createElement('span');
        let texto = produto.nome_produto;
        
        if (produto.nome_cor_produto?.trim()) {
            texto += ` ${produto.nome_cor_produto}`;
        }
        
        if (produto.tamanho_letras?.trim()) {
            texto += ` ${produto.tamanho_letras}`;
        }

        if (produto.tamanho_numero?.trim()) {
            texto += ` tam.${produto.tamanho_numero}`;
        }
        
        if (produto.medida_volume?.trim()) {
            texto += ` ${produto.medida_volume_qtd}${produto.medida_volume}`;
        }
        
        if (produto.unidade_massa?.trim()) {
            texto += ` ${produto.unidade_massa_qtd}${produto.unidade_massa}`;
        }
        if (produto.unidade_comprimento?.trim()) {
            texto += ` ${produto.unidade_comprimento_qtd}${produto.unidade_comprimento}`;
        }

        spanNome.textContent = texto;
        
        spanNome.textContent = texto;
        
        const spanPrecoCompra = document.createElement('span');
        spanPrecoCompra.textContent = `${formatarMoedaBR(parseFloat(produto.preco_compra || 0))}`;

        const spanPrecoVenda = document.createElement('span');
        spanPrecoVenda.textContent = `${formatarMoedaBR(parseFloat(produto.preco_venda || 0))}`;

        const spanVendido = document.createElement('span');
        spanVendido.textContent = produto.quantidade_vendido || 0;

        const spanEstoqueAtual = document.createElement('span');
        spanEstoqueAtual.textContent = `${produto.quantidade_estoque} ${unidades[produto.unidade_estoque_id - 1]}` || 0;

        li.appendChild(spanCodigo);
        li.appendChild(spanNome);
        li.appendChild(spanEstoqueAtual);
        li.appendChild(spanPrecoCompra);
        li.appendChild(spanPrecoVenda);
        li.appendChild(spanVendido);
      

        renderer.appendChild(li);
    });
}

// Função para aplicar os filtros
function applyFilters() {
    const codigoEANValue = codigoEAN.value.trim();
    const produtoNomeValue = produtoNome.value.trim();
    const grupoValue = selectGrupo.value;
    const subgrupoValue = selectSubGrupo.value;

    const filteredProducts = allProducts.filter(produto => {
        return (
             produto.produto_ativado === 1 &&  // Exclui os produtos desativados
            (!codigoEANValue || produto.codigo_ean.includes(codigoEANValue)) &&
            (!produtoNomeValue || produto.nome_produto.toLowerCase().includes(produtoNomeValue.toLowerCase())) &&
            (!grupoValue || produto.grupo_id == grupoValue) &&
            (!subgrupoValue || produto.sub_grupo_id == subgrupoValue)
        );
    });

    renderProdutos(ulFiltros, filteredProducts);
    clearInputs();
}

// Função para limpar os inputs
function clearInputs() {
    codigoEAN.value = '';
    produtoNome.value = '';
    selectGrupo.value = '';
    selectSubGrupo.value = '';
}

// Eventos iniciais
filtrarProdutosButton.addEventListener('click', applyFilters);
getGrupo(selectGrupo);
getSubGrupo(selectSubGrupo);
fetchAllProdutos(ulFiltros);

const filterButtonInfor = document.getElementById('limparButton-info');
filterButtonInfor.addEventListener('click',()=>{
    location.reload();
  })