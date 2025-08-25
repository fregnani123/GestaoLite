// ==== ELEMENTOS DO DOM ====
const inputCpfCliente = document.getElementById('cpfFiltrar');
const btnFiltrarCrediario = document.getElementById('filterButtonCrediario');
const nomeClienteFiltrado = document.getElementById('nomeClienteFiltrado');
const credito = document.getElementById('credito');
const creditoUtilizado = document.getElementById('credito-utilizado');
const linkID_7 = document.querySelector('.list-a7');
const limparButtonFilter = document.getElementById('limparButton');
const multaSpan = document.getElementById('multaSpan');
const moraSpan = document.getElementById('moraSpan');
const btnExitNome = document.getElementById('btn-exit-nome-2');
const inputNome = document.getElementById('buscaCliente-2');
const divNomes = document.querySelector('.divNomes-2');
const lista = document.getElementById("listaClientes-2");
const btnAtivo = document.getElementById('btn-ativo');

let parcelas = [];
let multaParcela = '';
let taxaJurosAtraso = '';
let GlobalClienteID = null;

// ==== ESTILIZA LINK ATIVO ====
function estilizarLinkAtivo(linkID) {
    if (btnAtivo.id === 'btn-ativo') {
        linkID.style.background = '#3a5772';
        linkID.style.textShadow = 'none'; 
        linkID.style.color = 'white';  
        linkID.style.borderBottom = '2px solid #d7d7d7'; 
    }
}
document.addEventListener('DOMContentLoaded', () => estilizarLinkAtivo(linkID_7));

// ==== BUSCA TAXAS ====
async function getTaxasCred() {
    try {
        const response = await fetch('http://localhost:3000/getTaxas', {
            method: 'GET',
            headers: { 'x-api-key': 'segredo123', 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        multaParcela = data[0].valor_multa_atraso;
        taxaJurosAtraso = data[0].juros_crediario_atraso;
        moraSpan.innerText = taxaJurosAtraso;
        multaSpan.innerText = converteMoeda(multaParcela);
        console.log('Taxas Crediário: ', data);
    } catch (error) {
        console.error('Erro ao buscar Taxas Crediario:', error);
    }
}

// ==== FILTROS E INPUTS ====
document.addEventListener('DOMContentLoaded', () => {
    inputCpfCliente.focus();
    getTaxasCred();
    formatarEVerificarCPF(inputCpfCliente);
    inputMaxCaracteres(inputCpfCliente, 14);
});

// ==== LIMPAR DIV NOMES E INPUT ====
btnExitNome.addEventListener('click', () => {
    divNomes.style.display = 'none';
    inputCpfCliente.focus();
    inputNome.value = '';
    lista.innerHTML = '';
});

btnFiltrarCrediario.addEventListener('click', () => {
    divNomes.style.display = 'block';
    inputNome.focus();
});

limparButtonFilter.addEventListener('click', () => location.reload());

// ==== BUSCA CLIENTE CREDIÁRIO ====
async function buscarClienteCrediario() {
    if (!inputNome || !lista) {
        console.error("Erro: Elementos do input ou lista não encontrados.");
        return;
    }

    inputNome.addEventListener("input", async () => {
        const nome = inputNome.value.trim();

        // Limpa lista se input estiver vazio
        if (nome === '') {
            lista.innerHTML = '';
            return;
        }

        if (nome.length < 2) return;

        try {
            const response = await fetch(`http://localhost:3000/getClienteNome/${nome}`, {
                method: "GET",
                headers: { "x-api-key": "segredo123", "Content-Type": "application/json" }
            });

            const data = await response.json();
            lista.innerHTML = '';

            if (data.message) {
                lista.innerHTML = `<li>${data.message}</li>`;
                return;
            }

            data.forEach(cliente => {
                const li = document.createElement("li");
                const cpfFormatado = decode(cliente.cpf);
                li.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>${cpfFormatado} - ${cliente.nome}</span>
                        <button data-cpf="${cpfFormatado}">Selecionar</button>
                    </div>
                `;
                lista.appendChild(li);
            });

            // Botões de selecionar
            lista.querySelectorAll("button").forEach(btn => {
                btn.addEventListener("click", () => {
                    const cpfSelecionado = btn.getAttribute("data-cpf");
                    inputCpfCliente.value = cpfSelecionado;
                    inputCpfCliente.dispatchEvent(new Event("input"));
                    inputCpfCliente.focus();

                    // Limpa lista e inputNome
                    lista.innerHTML = '';
                    inputNome.value = '';
                    divNomes.style.display = "none";
                });
            });

        } catch (error) {
            console.error("Erro ao buscar clientes do crediário:", error);
        }
    });
}
document.addEventListener('DOMContentLoaded', buscarClienteCrediario);

// ==== GET CREDIÁRIO POR CPF ====
async function getCrediarioCpf(cpf) {
    try {
        const response = await fetch(`http://localhost:3000/getCrediario/${cpf}`, {
            method: 'GET',
            headers: { 'x-api-key': 'segredo123', 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            alertMsg('CPF não encontrado para compras no crediário.', 'info', 4000);
            return null;
        }

        const data = await response.json();
        parcelas = data;
        GlobalClienteID = data[0].cliente_id;

        nomeClienteFiltrado.value = data[0].nome || 'N/A';
        credito.value = data[0].credito_limite ? converteMoeda(data[0].credito_limite) : '0,00';
        creditoUtilizado.value = data[0].credito_utilizado ? converteMoeda(data[0].credito_utilizado) : '0,00';

        renderizarTabela();
        return data;

    } catch (error) {
        console.error('Erro ao buscar informações do crediário:', error);
        return null;
    }
}

inputCpfCliente.addEventListener('input', async () => {
    const cpf = inputCpfCliente.value.trim();
    if (cpf.length === 14) await getCrediarioCpf(cpf);
});

// ==== UPDATE CRÉDITO E BAIXA PARCELA ====
async function updateCredito(dadosClienteId) {
    try {
        const patchResponse = await fetch('http://localhost:3000/updateCredito', {
            method: 'PATCH',
            headers: { 'x-api-key': 'segredo123', 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosClienteId)
        });

        if (!patchResponse.ok) alertMsg('Erro ao atualizar Crédito', 'info', 3000);
        else console.log('Crédito atualizado com sucesso');
    } catch (error) {
        console.error('Erro ao atualizar crédito:', error);
    }
}

async function baixarCrediario(dadosCred) {
    try {
        const response = await fetch('http://localhost:3000/updateCrediario', {
            method: 'PATCH',
            headers: { 'x-api-key': 'segredo123', 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosCred)
        });

        if (!response.ok) console.error('Erro ao atualizar parcela crediário');
        else atualizarParcelaLocalmente(dadosCred);

    } catch (error) {
        console.error('Erro durante a atualização do crediário:', error);
    }
}

function atualizarParcelaLocalmente(dadosCred) {
    parcelas = parcelas.map(p =>
        p.crediario_id === dadosCred.crediario_id
            ? { ...p, status: 'Paga', data_pagamento: dadosCred.data_pagamento, multa_atraso: dadosCred.multa_atraso }
            : p
    );
    renderizarTabela();
}

// ==== Função para aplicar eventos nos botões "Baixar" ====
function aplicarEventosBaixa() {
    document.querySelectorAll('.pagar-btn').forEach(button => {
        button.addEventListener('click', async function () {
            const crediarioId = parseInt(this.dataset.id);
            const tr = this.closest('tr');
            const valorParcela = parseFloat(tr.children[2].textContent.replace('R$ ', '').replace(',', '.'));
            const multa = parseFloat(tr.children[3].textContent.replace('R$ ', '').replace(',', '.'));

            const dataParcela = {
                data_pagamento: tr.children[5].textContent,
                status: 'Paga',
                multa_atraso: multa,
                crediario_id: crediarioId
            };

            const retornarSaldoCli = {
                credito_limite: parseFloat(credito.value.replace(/\./g,'').replace(',','.')),
                credito_utilizado: (parseFloat(creditoUtilizado.value.replace(/\./g,'').replace(',','.') - valorParcela)).toFixed(2),
                cliente_id: GlobalClienteID
            };

            alertMsg('Parcela paga!', 'success', 3000);
            await baixarCrediario(dataParcela);
            await updateCredito(retornarSaldoCli);

            setTimeout(() => {
                getCrediarioCpf(inputCpfCliente.value.trim());
            }, 2000);
        });
    });
}

// ==== RENDERIZAR TABELA (recebe lista de parcelas) ====
function renderizarTabela(listaParcelas = parcelas) {
    const div = document.querySelector('.div-filtrados');
    div.innerHTML = '';

    if (!listaParcelas || listaParcelas.length === 0) {
        div.innerHTML = `<p>Nenhuma parcela encontrada.</p>`;
        return;
    }

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

    listaParcelas.sort((a, b) => {
        if (a.status === 'PENDENTE' && b.status !== 'PENDENTE') return -1;
        if (b.status === 'PENDENTE' && a.status !== 'PENDENTE') return 1;
        if (a.status === 'PAGA' && b.status !== 'PAGA') return 1;
        if (b.status === 'PAGA' && a.status !== 'PAGA') return -1;
        return new Date(a.data_vencimento) - new Date(b.data_vencimento);
    });

    listaParcelas.forEach(p => {
        GlobalClienteID = p.cliente_id;
        const tr = document.createElement('tr');

        let multa = 0, juros = 0, totalComMulta = p.valor_parcela;
        const dataVencimento = new Date(p.data_vencimento);
        const hoje = new Date();

        if (dataVencimento < hoje) {
            multa = parseFloat(multaParcela);
            let mesesAtraso = (hoje.getFullYear() - dataVencimento.getFullYear()) * 12 + (hoje.getMonth() - dataVencimento.getMonth());
            if (hoje.getDate() < dataVencimento.getDate()) mesesAtraso--;
            mesesAtraso = Math.max(0, mesesAtraso);
            juros = p.valor_parcela * (taxaJurosAtraso / 100) * mesesAtraso;
            totalComMulta = p.valor_parcela + multa + juros;
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
            <td>${p.status === 'PENDENTE' ? `<div class='divBtn'><button class="pagar-btn" data-id="${p.crediario_id}">Baixar</button></div>` : '-'}</td>
        `;

        if (dataVencimento < hoje && p.status !== 'Paga') {
            tr.style.background = 'red'; tr.style.color = 'white';
        } else if (p.status === 'Paga') {
            tr.style.background = 'green'; tr.style.color = 'white';
        }

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    div.appendChild(table);

    // Reaplica eventos de baixa
    aplicarEventosBaixa();
}

// ==== FILTRO POR VENDA ====
document.getElementById('btnFiltrarVenda').addEventListener('click', () => {
    const filtro = document.getElementById('filtroVenda').value.trim();

    if (filtro === '') {
        renderizarTabela(parcelas); // sem filtro = mostra todas
        return;
    }

    const parcelasFiltradas = parcelas.filter(p => p.venda_id == filtro);

    renderizarTabela(parcelasFiltradas);
});

// ==== LIMPAR FILTRO ====
document.getElementById('btnLimparFiltro').addEventListener('click', () => {
    document.getElementById('filtroVenda').value = '';
    renderizarTabela(parcelas);
});
