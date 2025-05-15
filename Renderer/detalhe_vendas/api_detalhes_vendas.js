// Fetch dados da API
const filtrosDiv = document.querySelector('.total-filtradas');
const filterButton = document.getElementById('filterButton');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const titulo_relatorio = document.getElementById('titulo-relatorio');
const numeroPedidoFiltro = document.getElementById('numeroPedidoFiltro');
const cpfFiltro = document.getElementById('clienteFiltro');
const linkID_3 = document.querySelector('.list-a3');
const limparButton = document.getElementById('limparButton');
const btnDiv = document.getElementById('btn-comprovante');
const closeDiv = document.querySelector('.close-btn')
const vendasFiltradasDiv = document.querySelector('.vendas-filtradas');

formatarEVerificarCPF(cpfFiltro)
inputMaxCaracteres(cpfFiltro, 14);


function estilizarLinkAtivo(linkID) {
 linkID.style.background = '#5f8ac1'; 
  linkID.style.textShadow = 'none'; // Sem sombra de texto
  linkID.style.color = 'white'; // Cor do texto
  linkID.style.borderBottom = '2px solid black'; // Borda inferior
}
estilizarLinkAtivo(linkID_3)

async function fetchSalesHistory({ startDate, endDate, cpfCliente, numeroPedido }) {
    try {
        // Constrói os parâmetros da URL dinamicamente
        const params = new URLSearchParams();

        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (cpfCliente) params.append('cpfCliente', cpfCliente);
        if (numeroPedido) params.append('numeroPedido', numeroPedido);

        const url = `http://localhost:3000/getHistoricoVendas?${params.toString()}`;
        console.log('URL de requisição:', url);

        // Faz a requisição com os parâmetros e o cabeçalho da API key
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123'
            }
        });

        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
        const data = await response.json();
        console.log('Dados recebidos da API:', data);

        const groupedSales = groupSalesByOrder(data.rows);
        displaySalesHistory(groupedSales);
        obterPrimeiroEUltimoPedido(groupedSales);

        const totalRows = data.totalRows;
        displayTotalSales(totalRows);
        const totalLiquido = calculateTotalSales(groupedSales);
        displayTotalLiquido(totalLiquido);

    } catch (error) {
        console.error('Erro ao buscar o histórico de vendas:', error);
    }
};

let primeiroPedido;
let ultimoPedido;

// Após agrupar os pedidos, obtenha o primeiro e o último pedido
function obterPrimeiroEUltimoPedido(grouped) {
 const pedidos = Object.keys(grouped).sort((a, b) => a - b); // Ordena os números dos pedidos

 if (pedidos.length > 0) {
     primeiroPedido = grouped[pedidos[0]];
     ultimoPedido = grouped[pedidos[pedidos.length - 1]];

     titulo_relatorio.innerHTML = `Período: De ${formatarDataISOParaBR(primeiroPedido.data_venda)} até ${formatarDataISOParaBR(ultimoPedido.data_venda)}`;
 }
}

// Função para filtrar as vendas
function filterVendas() {
    // Exibe as datas no título do relatório
    titulo_relatorio.innerHTML = `Forma de Pagamento<br>Período: ${validarDataVenda(startDate.value)} - ${validarDataVenda(endDate.value)}`;

    // Exibe os valores capturados para depuração
    console.log('Start Date:', startDate.value); // Verifique se o valor está sendo capturado
    console.log('End Date:', endDate.value); // Verifique se o valor está sendo capturado
    console.log('cpf Cliente:', cpfFiltro.value); // Verifique se o valor está sendo capturado
    console.log('Número Pedido:', numeroPedidoFiltro.value); // Verifique se o valor está sendo capturado

    // Captura as datas e filtros
    const startDateFormated = startDate.value;
    const endDateFormated = endDate.value;
    const cpfClienteFormated = cpfFiltro.value;
    const numeroPedidoFiltroFormated = numeroPedidoFiltro.value;

    const filtros = {
        startDate: startDateFormated,
        endDate: endDateFormated,
        cpfCliente: cpfClienteFormated,
        numeroPedido: numeroPedidoFiltroFormated,
    };

    // Exibe os filtros no console
    console.log('Filtros:', filtros);

  // Verifica se as datas foram informadas
if (!startDateFormated || !endDateFormated) {
    titulo_relatorio.innerHTML = `Forma de Pagamento<br>Período: não selecionado`;
}

    // Chama a função para buscar o histórico de vendas com os filtros
    fetchSalesHistory(filtros);
}

// Event listener para o botão de filtro
filterButton.addEventListener('click', filterVendas);
filterVendas();

function groupSalesByOrder(sales) {
    const grouped = sales.reduce((grouped, sale) => {
        if (!grouped[sale.numero_pedido]) {
            grouped[sale.numero_pedido] = {
                numero_pedido: sale.numero_pedido,
                data_venda: sale.data_venda,
                cliente_nome: sale.nome_cliente,
                produtos: [],
                tipo_pagamento: sale.tipo_pagamento,
                total_liquido: sale.total_liquido,
                valor_recebido: sale.valor_recebido,
                troco: sale.troco,
            };
        }

        grouped[sale.numero_pedido].produtos.push({
            codigo_ean: sale.codigo_ean,
            produto_nome: sale.produto_nome,
            quantidade: sale.quantidade,
            unidade_estoque_nome: sale.unidade_estoque_nome,
            preco: sale.preco,
        });

        return grouped;
    }, {});

    return grouped;
}

function formatarDataISOParaBR(dataISO) {
    const date = new Date(dataISO);
    
    // Ajustar para o fuso horário correto
    const dia = String(date.getUTCDate()).padStart(2, '0');
    const mes = String(date.getUTCMonth() + 1).padStart(2, '0');
    const ano = date.getUTCFullYear();

    return `${dia}/${mes}/${ano}`;
}

// Funções de exibição
function calculateTotalSales(groupedSales) {
    return Object.values(groupedSales).reduce((total, saleGroup) => {
        return total + parseFloat(saleGroup.total_liquido);
    }, 0);
}

function displaySalesHistory(groupedSales) {
    const salesHistory = document.getElementById('sales-history');
    salesHistory.innerHTML = ''; // Limpa os dados anteriores

    // Ordena os pedidos do maior para o menor (mais recente primeiro)
    const sortedSales = Object.values(groupedSales).sort((a, b) => b.numero_pedido - a.numero_pedido);

    sortedSales.forEach(saleGroup => {
        const saleCard = document.createElement('div');
        saleCard.className = 'sale-card';

        const productDetails = saleGroup.produtos
            .map(product => `
                <p>
                    ${product.codigo_ean ? product.codigo_ean.toString() : 'Sem código'} - 
                    ${product.produto_nome ? product.produto_nome : 'Produto desconhecido'} - 
                    ${product.quantidade || 0}${product.unidade_estoque_nome || ''} x 
                    ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}
                </p>
            `)
            .join('');

        saleCard.innerHTML = `
            <p>
                <strong>Comprovante de Venda Nº000${saleGroup.numero_pedido}</strong><br>
                <strong>Data da Venda:</strong> ${formatarDataISOParaBR(saleGroup.data_venda)}<br>
                <strong>Cliente:</strong> ${saleGroup.cliente_nome}
            </p>
            ${productDetails}
            <p>
                <strong>Forma de Pagamento:</strong> ${saleGroup.tipo_pagamento}<br>
                <strong>Total Líquido da Venda:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saleGroup.total_liquido)}<br>
                <strong>Valor Recebido:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saleGroup.valor_recebido)}<br>
                <strong>Troco:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saleGroup.troco)}<br>
            </p>
        `;

        salesHistory.appendChild(saleCard);
    });
}

function displayTotalSales(totalRows) {
    const filtrosDiv = document.querySelector('.total-filtradas');
    filtrosDiv.innerHTML = ''; // Limpa a div

    if (totalRows.length === 0) {
        const noSalesMessage = document.createElement('div');
        noSalesMessage.className = 'no-sales-message';
        noSalesMessage.innerHTML = `<p>Sem vendas para o filtro selecionado</p>`;
        filtrosDiv.appendChild(noSalesMessage);
        return;
    }

    // Criar um objeto para armazenar os valores
    let salesData = {
        cartao_credito: 0,
        cartao_debito: 0,
        crediario: 0,
        dinheiro: 0,
        pix: 0,
        total_vendas_filtradas: 0
    };

    totalRows.forEach(item => {
        const saleTotal = document.createElement('div');
        saleTotal.className = 'sale-total';
    
        // Criar uma div para a cor correspondente
        const colorDiv = document.createElement('div');
        colorDiv.classList.add('cores');
        colorDiv.style.width = '1rem';
        colorDiv.style.height = '2.9rem';
        colorDiv.style.display = 'inline-block';
        colorDiv.style.marginLeft = '10px';
        colorDiv.style.verticalAlign = 'middle';
    
        // Definir a cor e armazenar o valor no objeto salesData
        switch (item.tipo_pagamento.toLowerCase()) {
            case 'cartão crédito':
                colorDiv.style.backgroundColor = '#2c3e6c'; // Azul mais claro
                salesData.cartao_credito = item.total_vendas;
                break;
            case 'cartão débito':
                colorDiv.style.backgroundColor = '#3f5481'; // Azul intermediário
                salesData.cartao_debito = item.total_vendas;
                break;
            case 'crediário':
                colorDiv.style.backgroundColor = '#334c74'; // Azul mais escuro
                salesData.crediario = item.total_vendas;
                break;
            case 'dinheiro':
                colorDiv.style.backgroundColor = '#5a6e96'; // Azul suave
                salesData.dinheiro = item.total_vendas;
                break;
            case 'pix':
                colorDiv.style.backgroundColor = '#6a74c2'; // Azul claro
                salesData.pix = item.total_vendas;
                break;
        }
        
        saleTotal.innerHTML = `
            <h3 class='h3-total'>${item.tipo_pagamento}</h3>
            <p class='p-total'>
                <strong>Total de Vendas:</strong> 
                ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total_vendas)}
            </p>
        `;
    
        // Adicionar a div colorida ao lado do texto dentro de `saleTotal`
        saleTotal.querySelector('p').appendChild(colorDiv);
        filtrosDiv.appendChild(saleTotal);

    });
    
    // Calcular o total de vendas filtradas
    salesData.total_vendas_filtradas = 
        (salesData.cartao_credito || 0) +
        (salesData.cartao_debito || 0) +
        (salesData.crediario || 0) +
        (salesData.dinheiro || 0) +
        (salesData.pix || 0);
    
    console.log("Dados processados para o gráfico:", salesData);
    
    // Chamar a função para atualizar o gráfico
    atualizarGrafico(salesData);
}    

function displayTotalLiquido(totalLiquido) {
    const filtrosDiv = document.querySelector('.filtros');
    const existingTotalLiquidoDiv = filtrosDiv.querySelector('.total-relatorio');
    if (existingTotalLiquidoDiv) existingTotalLiquidoDiv.remove();

    const totalLiquidoDiv = document.createElement('div');
    totalLiquidoDiv.className = 'total-relatorio';
    totalLiquidoDiv.innerHTML = `
        <h3 class='h3-total-2'><div class='totalDiv'></div>Total de Vendas filtradas: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalLiquido)}</h3>
    `;
    filtrosDiv.appendChild(totalLiquidoDiv);
}

function atualizarGrafico(salesData) {
    const { cartao_credito, cartao_debito, crediario, dinheiro, pix, total_vendas_filtradas } = salesData;

    if (total_vendas_filtradas === 0) {
        console.log("Nenhuma venda encontrada para atualizar o gráfico.");
        return;
    }

    // Calcular as porcentagens
    const porcentagemCredito = (cartao_credito / total_vendas_filtradas) * 100;
    const porcentagemDebito = (cartao_debito / total_vendas_filtradas) * 100;
    const porcentagemCrediario = (crediario / total_vendas_filtradas) * 100;
    const porcentagemDinheiro = (dinheiro / total_vendas_filtradas) * 100;
    const porcentagemPix = (pix / total_vendas_filtradas) * 100;

    // Atualizar as barras de progresso
    document.querySelector('.credito').style.width = `${porcentagemCredito}%`;
    document.querySelector('.debito').style.width = `${porcentagemDebito}%`;
    document.querySelector('.crediario').style.width = `${porcentagemCrediario}%`;
    document.querySelector('.dinheiro').style.width = `${porcentagemDinheiro}%`;
    document.querySelector('.pix').style.width = `${porcentagemPix}%`;

    // Atualizar os valores de texto nas barras
    document.getElementById('credito').innerText = `${porcentagemCredito.toFixed(2)}%`;
    document.getElementById('debito').innerText = `${porcentagemDebito.toFixed(2)}%`;
    document.getElementById('crediario').innerText = `${porcentagemCrediario.toFixed(2)}%`;
    document.getElementById('dinheiro').innerText = `${porcentagemDinheiro.toFixed(2)}%`;
    document.getElementById('pix').innerText = `${porcentagemPix.toFixed(2)}%`;
}


function toggleVendasFiltradas() {
    const isHidden = getComputedStyle(vendasFiltradasDiv).display === 'none';
    
    vendasFiltradasDiv.style.display = isHidden ? 'flex' : 'none';

    // Aplicar ou remover estilos do botão
    btnDiv.style.background = isHidden ? 'var(--hover-color)' : '';
    btnDiv.style.color = isHidden ? 'black' : '';
    btnDiv.style.textShadow = isHidden ? 'none' : '';
    btnDiv.style.borderBottom = isHidden ? '2px solid black' : '';
    btnDiv.style.cursor = isHidden ? 'pointer' : '';
}

// Adicionar evento de clique nos botões
btnDiv.addEventListener('click', toggleVendasFiltradas);
closeDiv.addEventListener('click', toggleVendasFiltradas);


limparButton.addEventListener('click',()=>{
    location.reload();
})