// Seletores de elementos
const dataVenda = document.querySelector('#data-venda');
const codigoEan = document.querySelector('#codigo');
const descricao = document.querySelector('#input-descricao');
const precoVenda = document.querySelector('#valor-unitario');
const inputQtd = document.querySelector('#input-qtd');
const selectCliente = document.querySelector('#nome-cliente');
const alterCliente = document.querySelector('#alterClienteCPF');
const nomeClienteAlter = document.getElementById("nomeClienteAlter");

const clienteId = document.querySelector("#id-cliente");
const creditoUtilizado = document.querySelector("#creditoUtilizado");
const creditoLimite = document.querySelector("#creditoLimite");

const ulDescricaoProduto = document.querySelector('.ul-descricao-produto');
const numeroPedido = document.querySelector('#numero-pedido');

const inputTotalLiquido = document.querySelector('#total-liquido');
const inputTotalPago = document.querySelector('#total-pago');

const unidadeEstoqueRender = document.querySelector('#medidaEstoque');
const divSelecionarQtd = document.querySelector('.div-qtd');
const textSelecionarQtd = document.querySelector('.qtd-selecionada');
const alertLimparVenda = document.querySelector('.confirmation-clear');
const alertRemoverItem = document.querySelector('.remove-item');
const formaPagamento = document.querySelector('.square-2-2-2-4');
const inputExitVenda = document.querySelector('#exit-key');
const inputlimparTelakey = document.querySelector('#limpar-tela-key');
const inputExcluiItem = document.querySelector('#numero-Item');
const limparButtonDesconto = document.getElementById('limparButton-desconto');
const mensagemDiv = document.querySelector('#mensagem');
const mostrarDesconto = document.getElementById("mostrarDesconto");
const mostrarDescontoReal = document.getElementById("mostrarDescontoReal");

const inputTroco = document.querySelector('#troco');
const valorDinheiro = document.getElementById('valorDinheiro');
const PIX = document.getElementById('PIX');
const CartaoDebito = document.getElementById('Cartao-Debito');
const CartaoCredito = document.getElementById('Cartao-Credito');

const Crediario = document.getElementById('Crediario');
const CrediarioParcela = document.getElementById('Crediario-parcela');
const CrediarioCliente = document.getElementById('Crediario-cliente');

const info_container = document.querySelector('.info-container');
const imgProduto = document.querySelector('.img-produto');
const impressaoCupom = document.getElementById('impressaoCupom');

const inputdescontoPorcentagem = document.getElementById('desconto');
const divValorDinheiro = document.getElementById('div-valorDinheiro');
const divPIX = document.getElementById('div-PIX');
const divCartaoDebito = document.getElementById('div-Cartao-Debito');
const divCrediario = document.getElementById('parcelado');
const divCartaoCredito = document.getElementById('div-Cartao-Credito');
const divDesconto = document.querySelector('.desconto-venda');
const divPagamento = document.querySelector('.payment-form-section');
const divAlterarCliente = document.querySelector('.alterarCliente')
const nomeProduto = document.querySelector('.nomeProduto');
const infoPag = document.getElementById('info-pag');
// const infoPagCred = document.getElementById('info-cred');
const inputMaxParcelas = document.getElementById('numeroParcela');

const condicaoCrediario = document.getElementById('condicao-vencimento');
const tipoPagamento = document.getElementById('tipo-pagamento');
const entradaCrediario = document.getElementById('valorEntrada');

const spanMaxParcelas = document.getElementById('spanMaxParcelas');
const showSubtotal = document.querySelector('.span-subtotal')
const carrinhoShowRemover = document.querySelector(".div-carrinho");
const btnMsg = document.querySelector('.btn-msg');



// Mapeamento dos botões para as teclas de atalho desejadas
const atalhos = {
    'btn-pgto-dinheiro': 'F1',
    'btn-pgto-pix': 'F2',
    'btn-pgto-credito': 'F3',
    'btn-pgto-debito': 'F4',
    'btn-cancelar-item': 'F6',
    'btn-crediario-loja': 'F7',
    'btn-alterar-cliente': 'F8',
    'btn-desconto-venda': 'F10',
    'btn-reiniciar-venda': 'F12',
    'btn-esc': 'Escape',
    "btn-exit": 'Escape',
    "btn-exit-qtd": 'Escape',
    "btn-exit-parcelado": 'Escape',
    "btn-exit-desconto": 'Escape',
    "btn-exit-limpar": 'Escape',
    "btn-exit-remover": 'Escape',
    "btn-exit-pag-1": 'Escape',
    "btn-exit-pag-2": 'Escape',
    "btn-exit-pag-3": 'Escape',
    "btn-exit-pag-4": 'Escape',
    "btn-exit-pag-5": 'Escape',
};

// Faz o loop automático
for (const [btnId, tecla] of Object.entries(atalhos)) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.addEventListener('click', () => {
            const event = new KeyboardEvent('keydown', { key: tecla });
            document.dispatchEvent(event);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const linkID_2 = document.querySelector('.list-a2');
    if (linkID_2) {
        estilizarLinkAtivo(linkID_2);
    }
});

function estilizarLinkAtivo(linkID) {
    linkID.style.background = '#3a5772';
    linkID.style.textShadow = 'none';
    linkID.style.color = 'white';
    linkID.style.borderBottom = '2px solid #d7d7d7';
}
// Estado do carrinho
let carrinho = [];

// Define foco inicial
codigoEan.focus();

document.addEventListener('DOMContentLoaded', () => {

    validarDescontoPorcentagem(inputdescontoPorcentagem);
    inputMaxCaracteres(CrediarioParcela, 2);


    const numeroPedido = document.querySelector('#numero-pedido');
    getVenda(numeroPedido);
    const codigoEan = document.querySelector('#codigo');
    const inputQtd = document.querySelector('#input-qtd');
    const alertLimparVenda = document.querySelector('.confirmation-clear');
    const alertRemoverItem = document.querySelector('.remove-item');
    const divPagamento = document.querySelector('.payment-form-section');
    const divDesconto = document.querySelector('.desconto-venda');



    function limparInputsPagamento() {
        inputTroco.value = '0,00';
        inputTotalPago.value = '0,00'
        valorDinheiro.value = '';
        PIX.value = '';
        CartaoDebito.value = '';
        CartaoCredito.value = '';
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            limparInputsPagamento();
            limparCamposCrediario()
            carrinhoShowRemover.classList.remove('zindex-alto');

        }
    });

    document.addEventListener('keydown', (event) => {
        // Selecionar as divs principais
        const visibleDivs = [alertRemoverItem, divPagamento, alertLimparVenda, divDesconto, divAlterarCliente, divCrediario].filter(div => div.style.display === 'block');
        const visibleDivsPag = [divValorDinheiro, divPIX, divCartaoDebito, divCartaoCredito, divCrediario];

        // Função para gerenciar visibilidade de formas de pagamento
        function showOnlyThisDiv(targetDiv) {
            // Verifica se o Shift foi pressionado
            if (!(event.shiftKey)) {
                // Ocultar todas as divs, caso Shift não seja pressionado
                visibleDivsPag.forEach(div => div.style.display = 'none');
            }
            targetDiv.style.display = 'block'; // Exibir a div alvo
        }
        switch (event.key) {
            case 'F1': // Forma pagamento Dinheiro
                if (inputTotalLiquido.value === '0,00') {
                    alertMsg('Não é possível adicionar forma de pagamento sem itens no pedido.', 'info');
                    codigoEan.focus();

                } else if (event.shiftKey || visibleDivs.length === 0) {
                    divPagamento.style.display = 'block';
                    showOnlyThisDiv(divValorDinheiro);
                    valorDinheiro.focus();
                    infoPag.style.display = 'flex';
                    // infoPagCred.style.display = 'none'
                }
                break;

            case 'F2': // Forma pagamento PIX
                if (inputTotalLiquido.value === '0,00') {
                    alertMsg('Não é possível adicionar forma de pagamento sem itens no pedido.', 'info');
                    codigoEan.focus();
                } else if (event.shiftKey || visibleDivs.length === 0) {
                    divPagamento.style.display = 'block';
                    showOnlyThisDiv(divPIX);
                    PIX.value = inputTotalLiquido.value;
                    PIX.focus();
                    infoPag.style.display = 'flex';
                    // infoPagCred.style.display = 'none'
                }
                break;

            case 'F3': // Forma pagamento Cartão Crédito
                if (inputTotalLiquido.value === '0,00') {
                    alertMsg('Não é possível adicionar forma de pagamento sem itens no pedido.', 'info');
                    codigoEan.focus();
                } else if (event.shiftKey || visibleDivs.length === 0) {
                    divPagamento.style.display = 'block';
                    showOnlyThisDiv(divCartaoCredito);
                    CartaoCredito.value = inputTotalLiquido.value
                    CartaoCredito.focus();
                    infoPag.style.display = 'flex';
                    // infoPagCred.style.display = 'none'
                }
                break;

            case 'F4': // Forma pagamento Cartão Débito
                if (inputTotalLiquido.value === '0,00') {
                    alertMsg('Não é possível adicionar forma de pagamento sem itens no pedido.', 'info');
                    codigoEan.focus();
                } else if (event.shiftKey || visibleDivs.length === 0) {
                    divPagamento.style.display = 'block';
                    showOnlyThisDiv(divCartaoDebito);
                    CartaoDebito.value = inputTotalLiquido.value
                    CartaoDebito.focus();
                    infoPag.style.display = 'flex';
                    // infoPagCred.style.display = 'none'
                }
                break;

            case 'F8':
                if (event.shiftKey || visibleDivs.length === 0) {
                    divAlterarCliente.style.display = 'block';
                }
                alterCliente.focus()
                break;

            case 'F7': // Forma pagamento 
                if (inputTotalLiquido.value === '0,00') {
                    alertMsg('Não é possível adicionar forma de pagamento sem itens no pedido.', 'info');
                    codigoEan.focus();
                } else if (event.shiftKey || visibleDivs.length === 0) {
                    divPagamento.style.display = 'block';
                    showOnlyThisDiv(divCrediario);
                    Crediario.value = inputTotalLiquido.value;

                    formatarMoedaBRL(entradaCrediario)

                    CrediarioCliente.focus();
                    infoPag.style.display = 'none';
                    divPagamento.style.left = '60%'
                    // infoPagCred.style.display = 'flex'
                }
                break;

            case 'F6': // Remover item
                if (carrinho.length === 0) {
                    alertRemoverItem.style.display = 'none';
                    alertMsg('Não há itens para remover no pedido', 'info');
                    return;
                }
                if (visibleDivs.length === 0) {
                    alertRemoverItem.style.display = 'block';
                    inputExcluiItem.focus();
                    carrinhoShowRemover.classList.add('zindex-alto');
                }

                inputExcluiItem.focus();
                break;


            case 'F9': // Aplicar desconto na venda
                inputQtd.readOnly = false; // libera edição
                inputQtd.focus();          // foca no campo
                break;


            case 'F10': // Aplicar desconto na venda
                if (inputTotalLiquido.value === '0,00') {
                    alertMsg('Não é possível adicionar desconto sem itens no pedido.', 'info');
                } else if (visibleDivs.length === 0) {
                    divDesconto.style.display = 'block';
                    inputdescontoPorcentagem.focus();
                }
                break;

            case 'F12': // Limpar venda
                if (inputTotalLiquido.value === '0,00') {
                    alertMsg(`${'Não é possível reiniciar a venda sem itens adicionados ou com subtotal igual a zero.'}`, 'info', 4000);
                    return;
                }
                if (visibleDivs.length === 0) {
                    alertLimparVenda.style.display = 'block';
                }
                inputlimparTelakey.focus();
                break;

            case 'Delete': // Remover item do carrinho
                if (alertRemoverItem.style.display === 'block') {
                    const index = parseInt(inputExcluiItem.value, 10) - 1;
                    if (!isNaN(index) && index >= 0 && index < carrinho.length) {
                        carrinho.splice(index, 1);
                        calCarrinho(carrinho, converteMoeda, inputTotalLiquido, textSelecionarQtd, inputdescontoPorcentagem);
                        rendererCarrinho(carrinho, ulDescricaoProduto, createSpan);

                        // Verifica se o carrinho está vazio antes de alterar a imagem
                        if (carrinho.length === 0) {
                            imgProduto.src = "../style/img/carrinho-de-compras.png"; // Volta para o ícone padrão
                        } else {
                            // Se ainda houver itens, atualiza para o último item do carrinho
                            imgProduto.src = carrinho[carrinho.length - 1].imgSrc || "../style/img/carrinho-de-compras.png";
                        }

                        alertMsg(`Item ${index + 1} removido do carrinho.`, 'info', 4000);
                    }
                    nomeProduto.innerHTML = ''
                    alertRemoverItem.style.display = 'none';
                    inputExcluiItem.value = '';
                    codigoEan.focus();
                }
                break;


            case 'Escape': // Fechar janelas
                inputExcluiItem.value = '';
                // inputExitVenda.value = '';
                if (visibleDivs.length !== 0) {
                    visibleDivs.forEach(div => div.style.display = 'none');
                    codigoEan.focus();
                } else {
                    alertMsg('Todas as sub-telas foram fechadas.', 'info', 3000);
                }

                break;


        }
    });
});
// Valida entrada do código EAN
codigoEan.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 13);
    if (e.target.value.length === 13) {
        if (!descricao.value && !inputQtd.value) inputQtd.value = '1';
        getProduto(descricao, e.target.value, precoVenda, unidadeEstoqueRender);
        setTimeout(() => {
            pushProdutoCarrinho({
                carrinho, produtoIdGlobal, codigoEan, descricao, precoVenda, inputQtd, unidadeEstoqueRender, rendererCarrinho, ulDescricaoProduto, createSpan, resetInputs, calCarrinho, converteMoeda, inputTotalLiquido, textSelecionarQtd, getVenda, numeroPedido, alertLimparVenda
            });
            calCarrinho(
                carrinho,
                converteMoeda,
                inputTotalLiquido,

            );

        }, 100);
    } else if (e.target.value.length === 0) resetInputs();
    getVenda(numeroPedido.value);
});



const limparTelakey = (e) => {
    if (e.key === 'Enter') {
        if (inputlimparTelakey.value === 'adm') {
            alertMsg('Todos os campos serão limpos e a venda será reiniciada.', 'info', 4000);
            limparCampos();
        } else {
            alertMsg('Senha incorreta, tente novamente.', 'error', 3000);
            inputlimparTelakey.value = '';
            setTimeout(() => {
                inputlimparTelakey.focus();
            }, 4000);
        }
    }
};


inputlimparTelakey.addEventListener('keydown', limparTelakey);

document.getElementById('btn-limpar-formulario').addEventListener('click', limparCamposCrediario);

function limparCamposCrediario() {
    // Campos de texto e número
    document.getElementById('Crediario-cliente').value = '';
    document.getElementById('nomeCliente').value = '';
    document.getElementById('condicao-vencimento').value = '';
    document.getElementById('Crediario-parcela').value = '';
    document.getElementById('tipo-pagamento').value = '';
    document.getElementById('valorEntrada').value = '';
    document.getElementById('Crediario-valor').value = '';
    // document.getElementById('Crediario').value = '0,00';
    // document.getElementById('creditoLimite').value = '0,00';
    // document.getElementById('creditoUtilizado').value = '0,00';
    document.getElementById('vencimentos').value = '';

    // Campo de busca de cliente
    document.getElementById('buscaCliente').value = '';

    // Lista de clientes (ul) esvaziada
    const listaClientes = document.getElementById('listaClientes');
    if (listaClientes) {
        listaClientes.innerHTML = '';
    }

    // Oculta a div de nomes, se estiver visível
    const divNomes = document.querySelector('.divNomes');
    if (divNomes) {
        divNomes.style.display = 'none';
    }
    cpfCliente.focus();
}



const tipoDesconto = document.getElementById('tipoDesconto');

// Porcentagem
const thPorcentagem = document.getElementById('th-porcentagem');
const tdPorcentagem = document.getElementById('td-porcentagem');

// Valor real
const thReal = document.getElementById('th-real');
const tdReal = document.getElementById('td-real');

tipoDesconto.addEventListener('change', () => {
    if (tipoDesconto.value === 'porcentagem') {
        // Mostra porcentagem
        thPorcentagem.style.display = '';
        tdPorcentagem.style.display = '';
        // Esconde real
        thReal.style.display = 'none';
        tdReal.style.display = 'none';
    } else {
        // Mostra real
        thReal.style.display = '';
        tdReal.style.display = '';
        // Esconde porcentagem
        thPorcentagem.style.display = 'none';
        tdPorcentagem.style.display = 'none';
    }
});

// Garante que carregue certo
tipoDesconto.dispatchEvent(new Event('change'));
