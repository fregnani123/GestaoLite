const inputCpfCliente = document.getElementById('cpfFiltrar');
const btnFiltrarCrediario = document.getElementById('filterButtonCrediario');
const nomeClienteFiltrado = document.getElementById('nomeClienteFiltrado');
const credito = document.getElementById('credito');
const creditoUtilizado = document.getElementById('credito-utilizado');
const linkID_7 = document.querySelector('.list-a7');
const limparButtonFilter = document.getElementById('limparButton');
const multaSpan = document.getElementById('multaSpan');
const moraSpan = document.getElementById('moraSpan');

function estilizarLinkAtivo(linkID) {
 linkID.style.background = '#5f8ac1'; 
  linkID.style.textShadow = 'none'; // Sem sombra de texto
  linkID.style.color = 'white'; // Cor do texto
  linkID.style.borderBottom = '2px solid black'; // Borda inferior
}
estilizarLinkAtivo(linkID_7);


let multaParcela = '';
let taxaJurosAtraso = '';

async function getTaxasCred() {
    try {
        const response = await fetch('http://localhost:3000/getTaxas', {
            method: 'GET',
            headers: { 
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json' }
        });

        const data = await response.json();

        multaParcela =  data[0].valor_multa_atraso;
        taxaJurosAtraso = data[0].juros_crediario_atraso;
      
        moraSpan.innerText = taxaJurosAtraso;
        multaSpan.innerText =converteMoeda(multaParcela);

        console.log('Taxas Crediário: ', data)

    } catch (error) {
        console.error('Erro ao buscar Taxas Crediario:', error);
        return [];
    }
};


document.addEventListener('DOMContentLoaded', () => {
    inputCpfCliente.focus();
    getTaxasCred()
   
});

formatarEVerificarCPF(inputCpfCliente);
inputMaxCaracteres(inputCpfCliente, 14);

let parcelas = []; // Definido fora para ser atualizado corretamente

async function getCrediarioCpf(cpf) {
    const dataCliente = `http://localhost:3000/getCrediario/${cpf}`;

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
        parcelas = data; // Agora substitui a lista em vez de empilhar os dados
        console.log('Dados do crediário:', data);
        nomeClienteFiltrado.value = data[0].nome || 'N/A';
        credito.value = data[0].credito_limite ? converteMoeda(data[0].credito_limite) : '0,00';
        creditoUtilizado.value = data[0].credito_utilizado ? converteMoeda(data[0].credito_utilizado) : '0,00';


        renderizarTabela(); // Atualiza a tabela imediatamente

        return data;
    } catch (error) {
        console.error('Erro ao buscar informações do crediário:', error);
        return null;
    }
}

async function updateCredito(dadosClienteId) {
    const updateCliente = 'http://localhost:3000/updateCredito';

    try {
        const patchResponse = await fetch(updateCliente, {
            method: 'PATCH',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosClienteId), // Usando o nome correto da variável
        });

        if (!patchResponse.ok) {
            alertMsg('Erro ao atualizar Crédito', 'info', 3000);
        }
        else {
            console.log('Crédito atualizado com sucesso', 'success', 3000);
        }
    } catch (error) {
        console.log('Erro durante a atualização do crédito:', error);
    }
}

async function baixarCrediario(dadosCred) {
    const dataCrediario = `http://localhost:3000/updateCrediario`;

    try {
        const response = await fetch(dataCrediario, {
            method: 'PATCH',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosCred),
        });

        if (!response.ok) {
            console.error('Erro ao atualizar parcela crediário');
        } else {
            console.log('Parcela atualizada com sucesso');
            atualizarParcelaLocalmente(dadosCred); // Atualiza a interface sem precisar refazer o fetch
        }
    } catch (error) {
        console.error('Erro durante a atualização do crediário:', error);
    }
}

async function atualizarParcelaLocalmente(dadosCred) {
    parcelas = parcelas.map((p) =>
        p.crediario_id === dadosCred.crediario_id
            ? { ...p, status: 'Paga', data_pagamento: dadosCred.data_pagamento, multa_atraso: dadosCred.multa_atraso }
            : p
    );

    renderizarTabela(); // Atualiza a interface com os novos dados
}

btnFiltrarCrediario.addEventListener('click', async () => {
    const cpf = inputCpfCliente.value.trim();

    if (cpf === '') {
        console.log('Por favor, digite um CPF.');
        return;
    }

    await getCrediarioCpf(cpf);
});

function renderizarTabela() {
    const div = document.querySelector('.div-filtrados');
    div.innerHTML = '';

    const table = document.createElement('table');
    table.classList.add('tableCred');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.border = '1';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Nº da Venda</th>
            <th>Parcela</th>
            <th>Valor</th>
            <th>Multa</th>
            <th>Valor C/juros</th>
            <th>Vencimento</th>
            <th>Data Pagamento</th>
            <th>Status</th>
            <th>Ação</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    parcelas.sort((a, b) => {
        // Se 'a' for PENDENTE e 'b' não for, 'a' sobe
        if (a.status === 'PENDENTE' && b.status !== 'PENDENTE') return -1;
        // Se 'b' for PENDENTE e 'a' não for, 'b' sobe
        if (b.status === 'PENDENTE' && a.status !== 'PENDENTE') return 1;
        // Se 'a' for PAGA e 'b' não for, 'b' sobe
        if (a.status === 'PAGA' && b.status !== 'PAGA') return 1;
        // Se 'b' for PAGA e 'a' não for, 'a' sobe
        if (b.status === 'PAGA' && a.status !== 'PAGA') return -1;
        // Se os status forem iguais, ordenar por data de vencimento
        return new Date(a.data_vencimento) - new Date(b.data_vencimento);
    });

    parcelas.forEach((p) => {
        GlobalClienteID = p.cliente_id;
        const tr = document.createElement('tr');
    
        let multa = 0;
        let juros = 0;
        let totalComMulta = p.valor_parcela;
        const dataVencimento = new Date(p.data_vencimento);
        const hoje = new Date();
    
        if (dataVencimento < hoje) {
            multa = parseFloat(multaParcela); // Multa fixa
    
            // Cálculo de meses completos de atraso
            let mesesAtraso = (hoje.getFullYear() - dataVencimento.getFullYear()) * 12 +
                              (hoje.getMonth() - dataVencimento.getMonth());
    
            if (hoje.getDate() < dataVencimento.getDate()) {
                mesesAtraso--;
            }
    
            mesesAtraso = Math.max(0, mesesAtraso);
    
            juros = p.valor_parcela * (taxaJurosAtraso / 100) * mesesAtraso;
    
            totalComMulta = p.valor_parcela + multa + juros;
    
            console.log(`Venda ${p.venda_id} | Parcela ${p.parcela_numero}`);
            console.log(`Meses de atraso: ${mesesAtraso}`);
            console.log(`Multa: R$ ${multa.toFixed(2)} | Juros: R$ ${juros.toFixed(2)} | Total: R$ ${totalComMulta.toFixed(2)}`);
        }
    
        tr.innerHTML = `
            <td>${p.venda_id}</td>
            <td>${p.parcela_numero}</td>
            <td>R$ ${p.valor_parcela.toFixed(2)}</td>
            <td>R$ ${converteMoeda(multa)}</td>
            <td>R$ ${converteMoeda(totalComMulta)}</td>
            <td>${validarDataVenda(p.data_vencimento)}</td>
            <td>${p.data_pagamento ? validarDataVenda(p.data_pagamento) : '-'}</td>
            <td>${p.status}</td>
            <td>${p.status === 'PENDENTE' ? `<div class='divBtn'><button class="pagar-btn" data-id="${p.crediario_id}">Baixar</button>` : '-'}</div></td>
        `;
    
        tbody.appendChild(tr);
    
        if (dataVencimento < hoje && p.status !== 'Paga') {
            tr.style.background = 'red';
            tr.style.color = 'white';
        } else if (p.status === 'Paga') {
            tr.style.background = 'green';
            tr.style.color = 'white';
        }
    });
    
    

    table.appendChild(tbody);
    div.appendChild(table);

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

            // Aguarda um tempo para garantir que o banco de dados foi atualizado antes de atualizar a tela
            setTimeout(() => {
                btnFiltrarCrediario.click();
            }, 2000); // Tempo de 1 segundo (ajuste conforme necessário)
        });
    });

};

limparButtonFilter.addEventListener('click', () => {
    location.reload();
});

