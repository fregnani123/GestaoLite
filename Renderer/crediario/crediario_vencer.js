const btnCobrar = document.getElementById('btn-flex');
const crediarioFiltradasDiv = document.getElementById('crediários-mes-vencer');
const crediariosVencidos = document.getElementById('crediarios-vencidos');
const btnCredVencer = document.getElementById('btnCredVencer');
const btnAtraso = document.getElementById('btn-atraso');
const closeDiv = document.querySelector('.close-btn'); // Certifique-se de que este elemento existe
const closeBtnVencidos = document.getElementById('close-btn-vencidos'); // Certifique-se de que este elemento existe

const mesVigente = document.querySelector('.mesAvencer');
const totalParcelas = document.querySelector('.parcelasTotal');
const parcelasTotalPagas = document.querySelector('.parcelasPagas');
const parcelasAReceber = document.querySelector('.parcelasAReceber');

document.addEventListener('DOMContentLoaded', () => {
    btnCobrar.style.background = 'var(--hover-color)';
    btnCobrar.style.color = 'white';
    btnCobrar.style.textShadow = 'none';
    btnCobrar.style.borderBottom = '2px solid black';
    btnCobrar.style.cursor = 'pointer';
});


const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const newMesVigente = new Date();
const mes = newMesVigente.getMonth();
mesVigente.innerHTML = meses[mes]


function toggleVendasFiltradas(targetDiv, targetBtn, otherDiv, otherBtn) {
    const isHidden = getComputedStyle(targetDiv).display === 'none';

    // Fecha a outra div, se estiver aberta
    if (getComputedStyle(otherDiv).display !== 'none') {
        otherDiv.style.display = 'none';
        otherBtn.removeAttribute('style');
    }

    // Alterna visibilidade da div alvo
    targetDiv.style.display = isHidden ? 'flex' : 'none';

    // Aplica ou remove estilos do botão alvo
    if (isHidden) {
        targetBtn.style.background = 'var(--hover-color)';
        targetBtn.style.color = 'black';
        targetBtn.style.textShadow = 'none';
        targetBtn.style.borderBottom = '2px solid black';
        targetBtn.style.cursor = 'pointer';
    } else {
        targetBtn.removeAttribute('style');
    }

    atualizarEstiloBotaoCobrar();
}

// Eventos para mostrar/ocultar cada div
btnCredVencer.addEventListener('click', () => toggleVendasFiltradas(crediarioFiltradasDiv, btnCredVencer, crediariosVencidos, btnAtraso));
btnAtraso.addEventListener('click', () => toggleVendasFiltradas(crediariosVencidos, btnAtraso, crediarioFiltradasDiv, btnCredVencer));

// Função para atualizar estilos do botão btnCobrar
function atualizarEstiloBotaoCobrar() {
    const isFiltradasVisible = getComputedStyle(crediarioFiltradasDiv).display !== 'none';
    const isVencidosVisible = getComputedStyle(crediariosVencidos).display !== 'none';

    if (isFiltradasVisible || isVencidosVisible) {
        btnCobrar.style.background = '';
        btnCobrar.style.color = '';
        btnCobrar.style.textShadow = '';
        btnCobrar.style.borderBottom = '';
        btnCobrar.style.cursor = 'pointer';
    } else {
        btnCobrar.style.background = 'var(--hover-color)';
        btnCobrar.style.color = 'black';
        btnCobrar.style.textShadow = 'none';
        btnCobrar.style.borderBottom = '2px solid black';
        btnCobrar.style.cursor = 'pointer';
    }
}

// Eventos para fechar as divs ao clicar no botão de fechar
[closeDiv, closeBtnVencidos, btnCobrar].forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        crediarioFiltradasDiv.style.display = 'none';
        crediariosVencidos.style.display = 'none';
        btnCredVencer.removeAttribute('style');
        btnAtraso.removeAttribute('style');

        atualizarEstiloBotaoCobrar();
    });
});


async function getTaxasCred() {
    try {
        const response = await fetch('http://localhost:3000/getTaxas', {
            method: 'GET',
            headers: { 
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json' 
            }
        });

        const data = await response.json();

        const multaParcela = parseFloat(data[0].valor_multa_atraso);
        const taxaJurosAtraso = parseFloat(data[0].juros_crediario_atraso);

        moraSpan.innerText = taxaJurosAtraso + '%';
        multaSpan.innerText = converteMoeda(multaParcela);

        return { multaParcela, taxaJurosAtraso };
    } catch (error) {
        console.error('Erro ao buscar Taxas Crediário:', error);
        return { multaParcela: 0, taxaJurosAtraso: 0 };
    }
}


async function getCrediariosMesVigente() {
    const taxas = await getTaxasCred();

    const dataCliente = `http://localhost:3000/getCrediariosMesVigente`;

    try {
        const response = await fetch(dataCliente, {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            alertMsg('CPF digitado não foi encontrado para compras no crediário.', 'info', 4000);
            return null;
        }

        const data = await response.json();
        parcelas = data;

        console.log('Dados do crediário:', data);

        renderizarTabelaAVencer(taxas); // passa as taxas aqui

        return data;
    } catch (error) {
        console.error('Erro ao buscar informações do crediário:', error);
        return null;
    }
}


function renderizarTabelaAVencer({ multaParcela, taxaJurosAtraso }) {
    const divAVencer = document.querySelector('.container-cmv');
    divAVencer.innerHTML = '';

    const table = document.createElement('table');
    table.classList.add('tableCred');
    table.id = 'tableCred';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.border = '1';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>CPF Cliente</th>
            <th>Nome Cliente</th>
            <th>Nº da Venda</th>
            <th>Parcela</th>
            <th>Valor</th>
            <th>Multa</th>
            <th>Valor C/juros</th>
            <th>Vencimento</th>
            <th>Data Pagamento</th>
            <th>Status</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    const totalGeral = parcelas.reduce((acc, p) => acc + (p.valor_parcela || 0), 0);
    const totalPagas = parcelas.reduce((acc, p) => p.status.trim().toUpperCase() === 'PAGA' ? acc + (p.valor_parcela || 0) : acc, 0);
    const totalPendentes = parcelas.reduce((acc, p) => p.status.trim().toUpperCase() === 'PENDENTE' ? acc + (p.valor_parcela || 0) : acc, 0);

    totalParcelas.innerHTML = converteMoeda(totalGeral);
    parcelasTotalPagas.innerHTML = converteMoeda(totalPagas);
    parcelasAReceber.innerHTML = converteMoeda(totalPendentes);

    const hoje = new Date();

    parcelas.sort((a, b) => {
        if (a.status === 'PENDENTE' && b.status !== 'PENDENTE') return -1;
        if (b.status === 'PENDENTE' && a.status !== 'PENDENTE') return 1;
        if (a.status === 'PAGA' && b.status !== 'PAGA') return 1;
        if (b.status === 'PAGA' && a.status !== 'PAGA') return -1;
        return new Date(a.data_vencimento) - new Date(b.data_vencimento);
    });

    parcelas.forEach((p) => {
        GlobalClienteID = p.cliente_id;

        const tr = document.createElement('tr');
        const dataVencimento = new Date(p.data_vencimento);
        let multaComJuros = 0;

        if (dataVencimento < hoje && p.status.toUpperCase() !== 'PAGA') {
            const mesesDeAtraso = Math.floor((hoje - dataVencimento) / (1000 * 60 * 60 * 24 * 30));
            const juros = (p.valor_parcela || 0) * (taxaJurosAtraso * mesesDeAtraso);
            const multaFixa = multaParcela;
            multaComJuros = juros + multaFixa;
        }

        const totalComJuros = (parseFloat(p.valor_parcela) || 0) + multaComJuros;

        tr.innerHTML = `
            <td>${decode(p.cpf)}</td>
            <td>${p.nome}</td>
            <td>${p.venda_id}</td>
            <td>${p.parcela_numero}</td>
            <td>${converteMoeda(p.valor_parcela)}</td>
            <td>${converteMoeda(multaComJuros)}</td>
            <td>${converteMoeda(totalComJuros)}</td>
            <td>${validarDataVenda(p.data_vencimento)}</td>
            <td>${p.data_pagamento || '-'}</td>
            <td>${p.status}</td>
        `;

        if (dataVencimento < hoje && p.status.toUpperCase() !== 'PAGA') {
            tr.style.background = 'red';
            tr.style.color = 'white';
        } else if (p.status.toUpperCase() === 'PAGA') {
            tr.style.background = 'green';
            tr.style.color = 'white';
        }

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    divAVencer.appendChild(table);

    function formatarParaNumero(valor) {
        return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
    }

    document.querySelectorAll('.pagar-btn').forEach((button) => {
        button.addEventListener('click', async function () {
            const crediarioId = this.getAttribute('data-id');
            const tr = this.closest('tr'); // Pega a linha correspondente ao botão
            const valorParcela = parseFloat(tr.children[2].textContent.replace('R$ ', '').replace(',', '.')); // Obtém o valor correto da parcela

            const dataVencimento = tr.children[5].textContent;
            const multa = tr.children[3].textContent.replace('R$ ', '').replace(',', '.');

            const dataParcela = {
                data_pagamento: dataVencimento,
                status: 'Paga',
                multa_atraso: parseFloat(multa) || 0,
                crediario_id: parseInt(crediarioId),
            };

            const retornarSaldoCli = {
                credito_limite: formatarParaNumero(credito.value),
                credito_utilizado: (formatarParaNumero(creditoUtilizado.value) - valorParcela).toFixed(2),
                cliente_id: GlobalClienteID,
            };

            console.log('Enviando dados para atualização:', dataParcela);

            alertMsg('Parcela paga!', 'success', 3000);
            await baixarCrediario(dataParcela);
            await updateCredito(retornarSaldoCli);


        });
    });

};

getCrediariosMesVigente();








