function rendererCarrinho(carrinho, ulDescricaoProduto, createSpan) {
    ulDescricaoProduto.innerHTML = ''; // Limpa a lista existente

    carrinho.forEach((item, index) => {
        const produto = document.createElement('li');
        produto.classList.add('li-produto');

        // Criação dos elementos usando a função createSpan
        const indexProduto = createSpan('spanIndex', `Item ${index + 1}`);
        const codigoSpan = createSpan('spanEan', `Cod. ${item.codigoEan}`);
        const descricaoSpan = createSpan(
            'spanDescricao',
            `${item.descricao} R$${item.preco} x ${item.Qtd}${item.unidadeEstoqueID}`
        );

        // Adiciona os elementos ao produto
        produto.append(indexProduto, codigoSpan, descricaoSpan);

        // Adiciona o produto à lista
        ulDescricaoProduto.appendChild(produto);

        inputQtd.readOnly = true;

    });

    carrinho.forEach((item) => {
        nomeProduto.innerHTML = `${item.codigoEan} - ${item.descricao}`;
    });

}

async function alteraEstoqueEVendido(carrinho) {
    // Validar se o carrinho é um array
    if (!Array.isArray(carrinho) || carrinho.length === 0) {
        console.error("O carrinho está vazio ou não é um array válido:", carrinho);
        return;
    }

    // Consolidar os produtos no carrinho
    const produtosAgrupados = carrinho.reduce((acc, item) => {
        const existente = acc.find(prod => prod.codigoEan === item.codigoEan);
        if (existente) {
            existente.Qtd += parseInt(item.Qtd, 10);
        } else {
            acc.push({
                codigoEan: item.codigoEan,
                descricao: item.descricao,
                quantidade_estoque: item.quantidade_estoque,
                quantidade_vendido: item.quantidade_vendido,
                Qtd: parseInt(item.Qtd, 10),
            });
        }
        return acc;
    }, []);

    // Atualizar o estoque para cada produto consolidado
    for (const produto of produtosAgrupados) {
        const estoqueAtualizado = {
            quantidade_estoque: produto.quantidade_estoque - produto.Qtd,
            quantidade_vendido: produto.quantidade_vendido + produto.Qtd,
            codigo_ean: produto.codigoEan,
        };

        try {
            await updateEstoque(estoqueAtualizado); // Certifique-se de que updateEstoque é assíncrono
        } catch (error) {
            console.error("Erro ao atualizar estoque para o produto:", produto.codigoEan, error);
        }
    }
}

// let desconto = parseFloat(inputdescontoPorcentagem.value.replace(',', '.')) || 0;

const inputDescontoEmReal = document.getElementById('desconto-valor');
const inputDescontoEmRealFormat = formatarMoedaBRL(inputDescontoEmReal);
const inputDescontoPorcentagem = document.getElementById('desconto');

inputDescontoEmReal.addEventListener('input', () => {
    calCarrinho(carrinho, converteMoeda, inputTotalLiquido);
    showSubtotal.innerHTML = inputTotalLiquido.value;
    mostrarDescontoReal.value = inputDescontoEmReal.value
});

inputDescontoPorcentagem.addEventListener('input', () => {
    calCarrinho(carrinho, converteMoeda, inputTotalLiquido);
});


function calCarrinho(carrinho, converteMoeda, inputTotalLiquido, textSelecionarQtd) {
    if (textSelecionarQtd) textSelecionarQtd.innerHTML = '1x'; // Atualiza o texto, se fornecido

    const total = carrinho.reduce((acc, item) => {
        const precoFormatado = parseFloat(
            item.preco.replace(/\./g, '').replace(',', '.')
        );
        return acc + precoFormatado * parseInt(item.Qtd, 10);
    }, 0);

    const inputDescontoPorcentagem = document.getElementById('inputdescontoPorcentagem');
    const descontoPorcentagem = parseFloat(inputDescontoPorcentagem?.value.replace(',', '.')) || 0;

    const inputDescontoEmReal = document.getElementById('desconto-valor');
    const descontoReais = parseFloat(inputDescontoEmReal?.value.replace(',', '.')) || 0;

    const descontoAplicado = Math.min(descontoPorcentagem, 100); // Garante máximo de 100%

    const valorDesconto = (total * descontoAplicado) / 100;
    const novoTotal = total - valorDesconto - descontoReais;

    if (inputTotalLiquido) inputTotalLiquido.value = converteMoeda(novoTotal);

    return novoTotal;
}


function pushProdutoCarrinho({
    carrinho,
    codigoEan,
    descricao,
    precoVenda,
    inputQtd,
    unidadeEstoqueRender,
    rendererCarrinho,
    ulDescricaoProduto,
    createSpan,
    resetInputs,
    calCarrinho,
    converteMoeda,
    inputTotalLiquido,

    getVenda,
    numeroPedido,
    alertLimparVenda,
}) {
    // Verifica se algum campo está vazio
    if (!codigoEan.value || !descricao.value || !inputQtd.value) {
        console.log('Existem inputs vazios');
        return;
    }

    // Cria o objeto do produto
    const produto = {
        produto_id: produtoIdGlobal,
        codigoEan: codigoEan.value,
        descricao: descricao.value,
        preco: precoVenda.value,
        Qtd: inputQtd.value,
        quantidade_estoque: quantidade_estoqueGlobal,
        quantidade_vendido: quantidade_vendidoGlobal,
        unidadeEstoqueID: unidadeEstoqueRender.value,
        unidadeIDGlobal: unIDGlobal
    };

    // Adiciona o produto ao carrinho
    carrinho.push(produto);
    console.log("Produto adicionado ao carrinho:", produto);

    // Renderiza o carrinho
    rendererCarrinho(carrinho, ulDescricaoProduto, createSpan);

    // Reseta os campos de entrada
    resetInputs();

    // Calcula o total do carrinho
    calCarrinho(
        carrinho,
        converteMoeda,
        inputTotalLiquido,
        inputdescontoPorcentagem,
    );


    // Atualiza o subtotal renderizado
    showSubtotal.innerHTML = inputTotalLiquido.value;

    // Obtém os dados da venda
    getVenda(numeroPedido);


    // Oculta o alerta de limpar venda
    alertLimparVenda.style.display = 'none';
}

const btnExitDesconto = document.getElementById('btn-exit-desconto')

btnExitDesconto.addEventListener('click', () => {
    inputDescontoEmReal.value = '0,00';
    inputDescontoPorcentagem.value = '';
    calCarrinho(carrinho, converteMoeda, inputTotalLiquido);
    showSubtotal.innerHTML = inputTotalLiquido.value;
    mostrarDesconto.value = '0';
    mostrarDescontoReal.value = '0,00';
});

// limparButtonDesconto.addEventListener('click', () => {
//     inputDescontoEmReal.value = '0,00';
//     inputDescontoPorcentagem.value = '';
//     calCarrinho(carrinho, converteMoeda, inputTotalLiquido);
//     showSubtotal.innerHTML = inputTotalLiquido.value;
//     mostrarDescontoReal.value = '0,00'
// });

// Limpa os campos de entrada
function resetInputs() {
    descricao.value = '';
    precoVenda.value = '';
    inputQtd.value = '';
    codigoEan.value = '';
    unidadeEstoqueRender.value = '';
}

// Cria elemento <span> com classe e texto
function createSpan(className, textContent) {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = textContent;
    return span;
}

// Função que reseta os inputs
function resetInputs() {
    descricao.value = '';
    precoVenda.value = '';
    inputQtd.value = '1';
    codigoEan.value = '';
    unidadeEstoqueRender.value = '';
};


