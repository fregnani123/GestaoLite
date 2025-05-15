// Constantes de API
const btnDesabilitar = document.getElementById('filtrarProdutos');
const apiEndpoints = {
    getAllProdutos: 'http://localhost:3000/produtos',
    updateDesativarProduto: 'http://localhost:3000/UpdateDesativar',
};

document.addEventListener('DOMContentLoaded',()=>{
    codigoEAN.focus();
})

// Seletores do DOM
const selectGrupo = document.getElementById('grupo');
const selectSubGrupo = document.getElementById('subgrupo');
const ulFiltros = document.getElementById('ul-filtros'); // Lista para renderizar os produtos
const codigoEAN = document.getElementById('codigoEAN');
const produtoNome = document.getElementById('produtoNome');
const btnFiltrar = document.getElementById('filtrarProdutos');
const btnDesativar = document.getElementById('btnDesativar');
const linkID_4 = document.querySelector('.list-a4')

function estilizarLinkAtivo(linkID) {
 linkID.style.background = '#5f8ac1'; 
  linkID.style.textShadow = 'none'; // Sem sombra de texto
  linkID.style.color = 'white'; // Cor do texto
  linkID.style.borderBottom = '2px solid black'; // Borda inferior
}
estilizarLinkAtivo(linkID_4);


let allProducts = []; // Variável para armazenar todos os produtos
let filteredProduct = null; // Constante para armazenar apenas um produto filtrado
formatarCodigoEANProdutos(codigoEAN);

// Função para formatar valores como moeda brasileira
function formatarMoedaBR(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

codigoEAN.addEventListener('input', () => {
    const ean = codigoEAN.value.trim();

    // Se tiver exatamente 13 dígitos, aplica o filtro
    if (ean.length === 13) {
        fetchAllProdutos(() => {
            applyFilters(); // Aplica os filtros após carregar os produtos
            codigoEAN.value = ''; // Limpa o campo após o filtro
        });
    }
});

// Ajuste em `fetchAllProdutos`
function fetchAllProdutos(callback) {
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
            if (callback) callback(); // Chama a função de callback, se existir
        })
        .catch(error => console.error('Erro ao buscar produtos:', error));
}


async function desativarProduto(produto) {
 try {
     const patchResponse = await fetch(apiEndpoints.updateDesativarProduto , {
         method: 'PATCH',
         headers: {
             'x-api-key': 'segredo123',
             'Content-Type': 'application/json',
         },
         body: JSON.stringify(produto), // Apenas serialize aqui
     });

     if (!patchResponse.ok) {
         console.log('Erro ao desativar estoque do produto');
     } else {
         console.log('produto desativado com sucesso');
     }
 } catch (error) {
     console.log('Erro durante a desativação do produto:', error);
 }
};


// Função para renderizar os produtos
function renderProdutos(renderer, produtos) {
    renderer.innerHTML = ''; // Limpa a lista antes de renderizar

    // Dados dos produtos
    let unidades = ['un', 'cx', 'rolo', 'pc'];

    produtos.forEach(produto => {
        const li = document.createElement('li');
        li.classList.add('li-list');
        const divBtns = document.getElementById('div-btns');

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

        spanNome.textContent = texto || 'Produto desconhecido';
        

        const spanPrecoCompra = document.createElement('span');
        spanPrecoCompra.textContent = `${formatarMoedaBR(parseFloat(produto.preco_compra || 0))}`;

        const spanPrecoVenda = document.createElement('span');
        spanPrecoVenda.textContent = `${formatarMoedaBR(parseFloat(produto.preco_venda || 0))}`;

        const spanVendido = document.createElement('span');
        spanVendido.textContent = produto.quantidade_vendido || 0;

        const spanEstoqueAtual = document.createElement('span');
        spanEstoqueAtual.textContent = `${produto.quantidade_estoque} ${unidades[produto.unidade_estoque_id - 1]}` || 0;
        const btnDesativar = document.createElement('button');
        btnDesativar.textContent = 'Desabilitar';
        btnDesativar.id = 'btnDesativar'; // Adiciona um id ao botão
        

        li.appendChild(spanCodigo);
        li.appendChild(spanNome);
        li.appendChild(spanPrecoCompra);
        li.appendChild(spanPrecoVenda);
        li.appendChild(spanVendido);
        li.appendChild(spanEstoqueAtual);
        divBtns.appendChild(btnDesativar);

        renderer.appendChild(li);
    });
}

// Variável global para armazenar o produto único selecionado
let produtoSelecionado = null;

function applyFilters() {
    const codigoEANValue = codigoEAN.value.trim();

    // Filtra os produtos com base no código EAN
    const filteredProducts = allProducts.filter(produto => {
        const produtoEAN = produto.codigo_ean ? String(produto.codigo_ean) : '';
 return Number(produto.produto_ativado) === 1 &&  codigoEANValue && produtoEAN.includes(codigoEANValue);
    });
    // Number(produto.produto_ativado) === 1 && 
    if (filteredProducts.length === 1) {
        // Salva o único produto encontrado
        produtoSelecionado = filteredProducts[0];
        console.log('Produto único encontrado:', produtoSelecionado);

        // Renderiza apenas o produto único
        renderProdutos(ulFiltros, [produtoSelecionado]);
    } else {
        // Reseta o produto selecionado se nenhum ou vários forem encontrados
        produtoSelecionado = null;

        if (filteredProducts.length === 0) {
           alertMsg('Nenhum produto encontrado,verifique o código digitado.','info');
           codigoEAN.value= ''
           codigoEAN.focus();
           return;
        } else {
            ulFiltros.innerHTML = '<li class="info-row">Mais de um produto encontrado. Refine a busca.</li>';
        }
    }
}

ulFiltros.addEventListener('click', (event) => {
    const produtoDesativar = {
        codigo_ean: produtoSelecionado.codigo_ean,
        quantidade_estoque: 0,
        produto_ativado: 0
    };
    
    if (event.target && event.target.id === 'btnDesativar') {
        desativarProduto(produtoDesativar)
        alertMsg('Produto desativado no sistema.', 'sucess');
        ulFiltros.innerHTML =  '';
        codigoEAN.focus();
    }
});

// Função para limpar os inputs
function clearInputs() {
    codigoEAN.value = '';
    produtoNome.value = '';
    selectGrupo.value = '';
    selectSubGrupo.value = '';
}

const filterButtonLimpar = document.getElementById('filterButtonLimpar');

filterButtonLimpar.addEventListener('click',()=>{
    location.reload();
  })