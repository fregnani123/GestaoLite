async function findClienteAlterar(cpf) {

    // Verifica se o CPF tem o formato correto (14 dígitos)
    if (cpf.length !== 14) {
        alertMsg("CPF inválido. Digite um CPF válido.", "error");
        document.getElementById("nomeClienteAlter").value = "";
        clienteId.value = "";
        return;
    }

    const findOneClient = `http://localhost:3000/getCliente/${cpf}`;

    try {
        const response = await fetch(findOneClient, {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json'
            }
        });

        // Verifica se a resposta não está OK antes mesmo de tentar convertê-la
        if (!response.ok) {
            throw new Error("Cliente não encontrado.");
        }

        const data = await response.json(); // Converte para JSON

        // Se a resposta for vazia, retorna erro
        if (!data || (Array.isArray(data) && data.length === 0) || Object.keys(data).length === 0) {
            throw new Error("Cliente não encontrado.");
        }

        const cliente = Array.isArray(data) ? data[0] : data; // Se for um array, pega o primeiro elemento

        if (!cliente || !cliente.cpf) {
            throw new Error("Cliente não encontrado.");
        }

        // Bloqueia o consumidor final
        if (cliente.cpf === "000.000.000-00" || cliente.cliente_id === 1) {
            alertMsg("Consumidor final já é inserido por padrão", "info");
            clienteId.value = "";
            return;
        }

        // Preenche os campos com os dados do cliente encontrado
        document.getElementById("nomeClienteAlter").value = cliente.nome || "Nome não disponível";
        document.getElementById("clienteNome").value = cliente.nome || "Nome não disponível";
        clienteId.value = cliente.cliente_id || "";

    } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        alertMsg("Cliente não encontrado. Verifique o CPF informado.", "info", 3000);
        clienteId.value = "";
    }
}



// Evento para disparar a busca ao digitar um CPF válido
alterCliente.addEventListener("input", async function () {
    let cpf = this.value

    if (cpf.length === 14) {
        await findClienteAlterar(cpf);
    } else {
        // Limpa o nome e o id quando o CPF tiver menos de 11 dígitos
        document.getElementById("nomeClienteAlter").value = "";
        clienteId.value = "1";
    }
});

// Funções extras que você pode ter para formatação
formatarEVerificarCPF(alterCliente);
inputMaxCaracteres(alterCliente, 14);


function parseCurrency(value) {
    if (!value) return 0;

    // Remove caracteres não numéricos (exceto vírgula e ponto)
    value = value.replace(/[^\d,-]/g, '');

    // Substitui vírgula por ponto, para tratar como decimal
    value = value.replace(',', '.');

    // Converte para número
    return parseFloat(value) || 0;
}

function parseValorMonetario(valor) {
    if (typeof valor !== 'string') return valor;

    return parseFloat(
        valor
            .replace(/\s/g, '')         // Remove espaços
            .replace('R$', '')          // Remove símbolo R$
            .replace(/\./g, '')         // Remove pontos dos milhares
            .replace(',', '.')          // Troca vírgula decimal por ponto
    );
}


async function FinalizarVenda() {
    imgProduto.src = ''
    if (carrinho.length === 0) {
        alertMsg("Seu carrinho está vazio. Adicione itens antes de concluir a venda.", 'info', 5000);
        return;
    }

    if (divCrediario.style.display === 'block' && CrediarioCliente.value === '') {
        alertMsg('Para realizar um pedido parcelado na loja, é necessário informar o CPF de um cliente previamente cadastrado no sistema.', 'info', 4000)
        creditoUtilizado.value = '';
        creditoLimite.value = '';
        clienteId.value = '';
        cpfCliente.value = '';
        return;
    }
if ((entradaCrediario.value !== '' && entradaCrediario.value !== '0') && !tipoPagamento.value) {
    alertMsg('É necessário informar o tipo de pagamento da entrada.', 'info', 4000);
    tipoPagamento.focus();
    return;
}

    if (divCrediario.style.display === 'block' && parcela.value === '') {
        alertMsg('É necessário informar o numero de parcelas antes de realizar a venda', 'info', 4000);
        parcela.focus();
        return;
    }

    // Quando precisar usar totalComJuros:
    inputTotalLiquido.value = converteMoeda(totalComJuros || parseCurrency(inputTotalLiquido.value));


    const totalLiquido = parseCurrency(inputTotalLiquido.value);
    const valorPago = calcularValores();


    if (valorPago < totalLiquido) {
        alertMsg('O valor pago está menor que o valor da compra.', 'info', 4000);
        return;
    }
    const debito = parseCurrency(CartaoDebito.value);
    const credito = parseCurrency(CartaoCredito.value);

    if (debito > totalLiquido || credito > totalLiquido) {
        alertMsg('O valor pago no cartão não pode ser maior que o valor da compra.', 'info', 4000);
        inputTotalPago.value = '0,00';
        inputTroco.value = '0,00';
        return;
    }

    const carrinhoId = carrinho.map(produto => ({
        produto_id: produto.produto_id,
        preco: parseCurrency(produto.preco).toFixed(2),
        quantidade: produto.Qtd,
        unidade_estoque_id: produto.unidadeIDGlobal,
    }));

    const venda = {
        data_venda: validarDataVenda(dataVenda.value),
        itens: carrinhoId,
        cliente_id: clienteId.value,
        total_liquido: totalLiquido.toFixed(2),
        valor_recebido: valorPago.toFixed(2),
        troco: Math.max(0, valorPago - totalLiquido),
        numero_pedido: numeroPedido.value,
        pagamentos: getFormasDePagamento(),
        desconto_venda: inputdescontoPorcentagem.value
    };

    const dataCrediario = {
        venda_id: numeroPedido.value,
        cliente_id: clienteId.value,
        valorTotal: parseValorMonetario(Crediario.value),
        numParcelas: parseInt(parcela.value),
        dataPrimeiroVencimento: vencimentosCrediario.value,
        tipoPagamento: tipoPagamento.value  === '' ? 'Sem entrada' : tipoPagamento.value,
        condicao: condicaoCrediario.value,
        entrada: parseFloat(parcelaValor.value),
    };

    
    function formatarParaNumero(valor) {
        return parseFloat(valor.replace("R$", "").trim().replace(/\./g, "").replace(",", "."));
    }

  const credCli = {
    credito_limite: formatarParaNumero(creditoLimite.value),
    credito_utilizado: (entradaCrediario.value && Number(entradaCrediario.value) > 0)
        ? formatarParaNumero(creditoUtilizado.value) + formatarParaNumero(valorCrediario.value) - Number(entradaCrediario.value)
        : formatarParaNumero(creditoUtilizado.value) + formatarParaNumero(valorCrediario.value),
    cliente_id: clienteId.value
};


    // Verifica se o crédito utilizado mais o total líquido ultrapassa o crédito limite
    const excedente = credCli.credito_utilizado - credCli.credito_limite;

    // Validação do crédito
    if (divCrediario.style.display === 'block' && excedente > 0) {
        codigoEan.focus();
        alertMsg(
            `Crédito insuficiente! O valor da venda excede o limite disponível em ${parseFloat(excedente).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })}`,
            'info', 4000
        );

        // Restaurar o valor original antes dos juros
        inputTotalLiquido.value = converteMoeda(totalLiquidoOriginal);
        Crediario.value = converteMoeda(totalLiquidoOriginal);
        totalComJuros = totalLiquidoOriginal;
        codigoEan.focus();
        cpfCliente.value = '';
        creditoUtilizado.value = '';
        creditoLimite.value = '0,00';
        Crediario.value = '0,00';
        CrediarioParcela.value = '';
        CrediarioCliente.value = '';
        inputTotalPago.value = '0,00';
        clienteId.value = 1;

        return; // Bloqueia a continuação do processo
    }



    try {
        // Registra a venda no banco
        await postVendaDb(venda);

        if (clienteId.value !== 1) {
            await validarCrediarioLoja(dataCrediario);
            await updateCrediario(credCli);
            console.log('dados crediario enviado',dataCrediario);
        } else {
            console.log('crediario não foi chamado...')
        }


        alertMsg('Pedido finalizado com sucesso, obrigado!', 'success');

        // Altera o estoque e o vendido
        await alteraEstoqueEVendido(carrinho);
        console.log('Estoque atualizado com sucesso!', 'success');

        // Busca os dados do pedido registrado e imprime
        await imprimirVenda(numeroPedido.value);
        imgProduto.src = '../style/img/carrinho-de-compras.png';


    } catch (error) {
        console.error('Erro ao processar a venda ou atualizar estoque:', error);
        alertMsg('Erro ao registrar a venda ou atualizar o estoque. Tente novamente.', 'error');
    }
};

async function imprimirVenda(numeroPedido) {
    try {
        // Exibe a div do cupom
        if (divCupon.style.display === 'none' || divCupon.style.display === '') {
            divCupon.style.display = 'block'; // Exibe a div do cupom
        }

        // Busca os dados do último pedido
        await getUltimoPedidoImprimirFolha(numeroPedido, numeroPedido);

        // Atraso para garantir que a div foi preenchida antes de imprimir
        setTimeout(() => {
            // Salva o conteúdo original
            const bodyContent = document.body.innerHTML;

            // Oculta o conteúdo da página e remove o título
            document.body.innerHTML = '';
            document.title = ''; // Limpa o título da página

            // Copia a div do cupom para o conteúdo da página
            const cupomContent = divCupon.cloneNode(true);
            document.body.appendChild(cupomContent);

            // Chama a impressão da página
            window.print();

            // Restaura o conteúdo original após a impressão
            document.body.innerHTML = bodyContent;

            // Restaura o título da página
            document.title = 'Tela de Vendas'; // Coloque o título original de volta, se necessário

        }, 2000);  // 500ms de atraso para garantir que a div foi preenchida
        limparCampos();
    } catch (error) {
        console.error('Erro ao buscar o último pedido para impressão:', error);
    }
}

function limparCampos() {
    // Limpa o carrinho imediatamente
    carrinho = [];
    setTimeout(() => {
        location.reload();
    }, 6000);
}

const btnFinalizarVenda = document.getElementById('btn-finalizar-venda');


btnFinalizarVenda.addEventListener('click', (e) => {
    const estiloPagamento = getComputedStyle(divPagamento); 
    const estiloCrediario = getComputedStyle(divCrediario);

    if (estiloPagamento.display !== 'none' || estiloCrediario.display !== 'none') {
        FinalizarVenda();
        console.log('Venda finalizada');
    } else {
        alertMsg('Selecione uma forma de pagamento', 'info');
    }
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const estilo = getComputedStyle(divPagamento);
        if (estilo.display === 'block') {
            FinalizarVenda();
            console.log('Venda finalizada pelo Enter');
        } else {
            // Ignora ou não faz nada, pois a div está escondida
        }
    }
});


const enterButtons = document.querySelectorAll('.enter-trigger');

enterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const event = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true
        });

        document.dispatchEvent(event);
        divPagamento.style.display = 'none'
    });
});

const deleteButtons = document.querySelectorAll('.confirme-delete');

deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
        const event = new KeyboardEvent('keydown', {
            key: 'Delete',
            code: 'Delete',
            keyCode: 46,
            which: 46,
            bubbles: true
        });

        document.dispatchEvent(event);
        carrinhoShowRemover.classList.remove('zindex-alto');
    });
});


const btnCliente = document.getElementById('btn-alterar-confirmar');
btnCliente.addEventListener('click', () => {
    if (!alterCliente.value) {
        alertMsg('Para confirmar, altere o cliente', 'info', 4000);
        alterCliente.focus();
        return;
    }
    divAlterarCliente.style.display = 'none'
    return;
})

const limparButtonCliente = document.getElementById('limparButton-cliente');

limparButtonCliente.addEventListener('click', () => {
    document.getElementById("nomeClienteAlter").value = '';
    document.getElementById("clienteNome").value = '';
    clienteId.value = '1';
    alterCliente.value = ''
})