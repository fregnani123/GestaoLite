
function displayTotalSales(totalRows) {
    const filtrosDiv = document.querySelector('.total-filtradas');
    filtrosDiv.innerHTML = ''; // Limpa a div

    if (totalRows.length === 0) {
        const noSalesMessage = document.createElement('div');
        noSalesMessage.className = 'no-sales-message';
        noSalesMessage.innerHTML = `<p>Nenhum pedido encontrado com o filtro aplicado.</p>`;
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


        // Definir a cor e armazenar o valor no objeto salesData
        switch (item.tipo_pagamento.toLowerCase()) {
            case 'cartão crédito':
                saleTotal.style.backgroundColor = '#2c3e6c'; // Azul mais claro
                salesData.cartao_credito = item.total_vendas;
                break;
            case 'cartão débito':
                saleTotal.style.backgroundColor = '#3f5481'; // Azul intermediário
                salesData.cartao_debito = item.total_vendas;
                break;
            case 'crediário':
                saleTotal.style.backgroundColor = '#334c74'; // Azul mais escuro
                salesData.crediario = item.total_vendas;
                break;
            case 'dinheiro':
                saleTotal.style.backgroundColor = '#5a6e96'; // Azul suave
                salesData.dinheiro = item.total_vendas;
                break;
            case 'pix':
                saleTotal.style.backgroundColor = '#6a74c2'; // Azul claro
                salesData.pix = item.total_vendas;
                break;
        }

        saleTotal.innerHTML = `
            <p class='p-1-total'>${item.tipo_pagamento}</p>
            <p class='p-total-tipo'>
             
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

