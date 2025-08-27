// Fetch dados da API
const filtrosDiv = document.querySelector('.total-filtradas');
const filterButton = document.getElementById('filterButton');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const titulo_relatorio = document.getElementById('titulo-relatorio');
const tdata_periodo = document.getElementById('data-periodo');
const numeroPedidoFiltro = document.getElementById('numeroPedidoFiltro');
const cpfFiltro = document.getElementById('clienteFiltro');
const limparButton = document.getElementById('limparButton');
const closeDiv = document.querySelector('.close-btn')
const vendasFiltradasDiv = document.querySelector('.vendas-filtradas');
const btnAtivo = document.getElementById('btn-ativo');
const linkID_3 = document.querySelector('.list-a3');

formatarEVerificarCPF(cpfFiltro)
inputMaxCaracteres(cpfFiltro, 14);

function estilizarLinkAtivo(linkID) {
    if (btnAtivo.id === 'btn-ativo') {
        linkID.style.background = '#3a5772';
        linkID.style.textShadow = 'none'; // Sem sombra de texto
        linkID.style.color = 'white'; // Cor do texto
        linkID.style.borderBottom = '2px solid #d7d7d7'; // Borda inferior
    }
}

document.addEventListener('DOMContentLoaded', () => {
    estilizarLinkAtivo(linkID_3)
})

// Função isolada para buscar histórico de vendas
async function fetchSalesHistory({ startDate, endDate, cpfCliente, numeroPedido }) {
    try {
        // Monta parâmetros da URL
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (cpfCliente) params.append('cpfCliente', cpfCliente);
        if (numeroPedido) params.append('numeroPedido', numeroPedido);

        const url = `http://localhost:3000/getHistoricoVendas?${params.toString()}`;
        console.log('URL de requisição:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'x-api-key': 'segredo123' }
        });

        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
        const data = await response.json();
        console.log('Dados recebidos da API:', data);

        // Agrupa vendas
        const groupedSales = groupSalesByOrder(data.rows);

        // Mostra histórico, se a função existir
        if (typeof displaySalesHistory === "function") {
            displaySalesHistory(groupedSales);
        }

        // Obtém primeiro e último pedido, se a função existir
        if (typeof obterPrimeiroEUltimoPedido === "function") {
            obterPrimeiroEUltimoPedido(groupedSales);
        }

        // Chama displayTotalSales somente se existir
        if (typeof displayTotalSales === "function") {
            displayTotalSales(data.totalRows);
        }

        // Calcula e exibe total líquido
        const totalLiquido = calculateTotalSales(groupedSales);
        if (typeof displayTotalLiquido === "function") {
            displayTotalLiquido(totalLiquido);
        }

        // Retorna os dados para uso em outra página, se necessário
        return { groupedSales, totalRows: data.totalRows, totalLiquido };

    } catch (error) {
        console.error('Erro ao buscar o histórico de vendas:', error);
        return { groupedSales: {}, totalRows: 0, totalLiquido: 0 };
    }
}


let primeiroPedido;
let ultimoPedido;

// Após agrupar os pedidos, obtenha o primeiro e o último pedido
function obterPrimeiroEUltimoPedido(grouped) {
    const pedidos = Object.keys(grouped).sort((a, b) => a - b); // Ordena os números dos pedidos

    if (pedidos.length > 0) {
        primeiroPedido = grouped[pedidos[0]];
        ultimoPedido = grouped[pedidos[pedidos.length - 1]];

        titulo_relatorio.innerHTML = `Período Filtrado`;
        tdata_periodo.innerHTML = `${formatarDataISOParaBR(primeiroPedido.data_venda)} até ${formatarDataISOParaBR(ultimoPedido.data_venda)}`
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
numeroPedidoFiltro.addEventListener('input', filterVendas);
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

        const rowsProdutos = saleGroup.produtos.map(product => `
            <tr class='tr-produto'>
                <td>${product.codigo_ean || 'Sem código'}</td>
                <td>${product.produto_nome || 'Produto desconhecido'}</td>
                <td>${product.quantidade || 0} ${product.unidade_estoque_nome || ''}</td>
                <td>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}</td>
                <td>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco * product.quantidade)}</td>
                
            </tr>
          
        `).join('');

        saleCard.innerHTML = `
<table class="tabela-comprovante">
    <tr class="tr-numero">
        <th colspan="5">
            <div class="alinha-centro">DOCUMENTO PARA CONFERÊNCIA DE MERCADORIAS</div>
        </th>
    </tr>
    <tr>
        <th colspan="5">
            <div class="th-numero-pedido">
                <span><strong class'strong'>Pedido Emitido:</strong>&nbsp;${formatarDataISOParaBR(saleGroup.data_venda)}</span>
                <span class="pedido-numero-botao">
                    Nº000${saleGroup.numero_pedido}
                       <div style="display: flex; align-items: center;">
                                            <button class="btnImprimir"
        style="margin-left: 2%;border: 1px solid gray; background-color: white;color: rgb(39, 39, 39) !important;"
        title="Imprimir"
        data-pedido="${saleGroup.numero_pedido}">
    Imprimir
    <img src="../style/img/impressora.png" alt="Imprimir"
         style="width: 24px; height: 24px;">
</button>

                                                </div>
                </span>
            </div>
        </th>
    </tr>
    <tr>
        <td colspan="5">
            <div class="alinha-esquerda"><strong>Cliente:</strong> ${saleGroup.cliente_nome}</div>
        </td>
    </tr>
    <tr>
        <td colspan="5">
            <div class="alinha-esquerda">Forma de Pagamento: ${saleGroup.tipo_pagamento}</div>
        </td>
    </tr>
  
    <tr>
        <th colspan="5">
            <div class="produtos-add"><strong>Produtos adicionados</strong></div>
        </th>
    </tr>
    <tr class="tr-produto">
        <th class="col-codigo">Código</th>
        <th class="col-produto">Produto</th>
        <th class="col-quantidade">Quantidade</th>
        <th class="col-unitario">Valor Unitário</th>
        <th class="col-total">Total</th>
    </tr>
    ${rowsProdutos}
     <tr class="tr-separador">
        <td colspan="5"></td>
    </tr>
      <tr  class="tr-troco">
        <th>Total Pedido </th>
        <th>Valor Recebido</th>
        <th colspan="5">Troco </th>
    </tr>
       <tr>
        <td>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saleGroup.total_liquido)}</td>
        <td>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saleGroup.valor_recebido)}</td>
        <td colspan="5">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saleGroup.troco)}</td>
    </tr>
     <tr class="tr-separador">
        <td colspan="5"></td>
    </tr>
</table>
<div class="linha-pontilhada"></div>
`;

        salesHistory.appendChild(saleCard);
    });
}


function displayTotalLiquido(totalLiquido) {
    const filtrosDiv = document.querySelector('.filtros');
    const existingTotalLiquidoDiv = filtrosDiv.querySelector('.total-relatorio');
    if (existingTotalLiquidoDiv) existingTotalLiquidoDiv.remove();

    const totalLiquidoDiv = document.createElement('div');
    totalLiquidoDiv.className = 'total-relatorio';
    totalLiquidoDiv.innerHTML = `
        <p class='p-total'>Total de valores para o período: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalLiquido)}</p>
    `;
    filtrosDiv.appendChild(totalLiquidoDiv);
}


limparButton.addEventListener('click', () => {
    location.reload();
}); 


