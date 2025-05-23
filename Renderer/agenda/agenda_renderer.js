inputCPF.addEventListener("input", (e) => {
    const cpf = e.target.value
    if (cpf.length === 14) {
        findCliente(cpf);
    } else {
        clienteNome.value = "";
    }
});

cpfFilter.addEventListener("input", (e) => {
    const cpf = e.target.value
    if (cpf.length === 14) {
        findCliente(cpf);
    } else {
        clienteNome.value = "";
    }
});

// Função para renderizar os agendamentos na tabela
function renderizarAgendamentos(agendamentos) {
    const containerForm = document.getElementById('div-container-form');

    console.log("Agendamentos recebidos:", agendamentos);
    if (!containerForm) {
        console.error('Elemento de contêiner de formulário não encontrado!');
        return;
    }

    // Limpa o container antes de renderizar
    containerForm.innerHTML = '';

    if (agendamentos.length === 0) {
        const noDataMessage = document.createElement('p');
        noDataMessage.textContent = 'Nenhum agendamento encontrado.';
        containerForm.appendChild(noDataMessage);
        return;
    }

    // Ordena os agendamentos por data e status
    agendamentos.sort((a, b) => {
        const dataA = new Date(a.data.split('/').reverse().join('-'));
        const dataB = new Date(b.data.split('/').reverse().join('-'));

        if (a.status === "Cancelado" && b.status !== "Cancelado") return 1;
        if (a.status !== "Cancelado" && b.status === "Cancelado") return -1;
        if (a.status === "Confirmado" && b.status !== "Confirmado") return 1;
        if (a.status !== "Confirmado" && b.status === "Confirmado") return -1;

        return dataA - dataB;
    });

    // Função para normalizar a data (removendo horário)
    function normalizarData(dataStr) {
        const [dia, mes, ano] = dataStr.split('/');
        const data = new Date(`${ano}-${mes}-${dia}`);
        data.setHours(0, 0, 0, 0);
        return data;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const hojeMenos1 = new Date(hoje);
    hojeMenos1.setDate(hoje.getDate());

    agendamentos.forEach(agendamento => {
        // Cria a div container para as duas tabelas (com margem embaixo)
        const agendamentoContainer = document.createElement('div');
        agendamentoContainer.classList.add('agendamento')
        agendamentoContainer.style.marginBottom = '20px'; // margem entre cada bloco de agendamento

        // Tabela 1: Informações principais do agendamento
        const table1 = document.createElement('table');
        table1.classList.add('table1');
        table1.style.width = '100%';
        table1.style.borderCollapse = 'collapse';
        table1.style.marginBottom = '10px';

        const thead1 = document.createElement('thead');
        thead1.innerHTML = `
            <tr>
                <th>CPF</th>
                <th>Nome</th>
                <th>Data</th>
                <th>Hora</th>
            </tr>
        `;
        table1.appendChild(thead1);

        const tbody1 = document.createElement('tbody');
        const tr1 = document.createElement('tr');

        tr1.innerHTML = `
            <td>${decode(agendamento.cpf)}</td>
            <td>${agendamento.nome}</td>
            <td>${validarDataVenda(agendamento.data)}</td>
            <td>${agendamento.hora}</td>
        `;

        // Estiliza a linha pelo status (mesmo esquema anterior)
        const dataAgendamento = normalizarData(agendamento.data);

        if (agendamento.status === "Cancelado") {
            tr1.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
        } else if (agendamento.status === "Confirmado") {
            tr1.style.backgroundColor = "rgba(0, 128, 0, 0.2)";
        } else if (agendamento.status === "Pendente") {
            if (dataAgendamento.getTime() === hoje.getTime()) {
                tr1.style.backgroundColor = "rgba(255, 255, 0, 0.5)";
            } else if (dataAgendamento.getTime() < hojeMenos1.getTime()) {
                tr1.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
                [...tr1.children].forEach(td => td.style.color = 'white');
            }
        }

        tbody1.appendChild(tr1);
        table1.appendChild(tbody1);

        // Tabela 2: Detalhes + Ações
        const table2 = document.createElement('table');
        table2.classList.add('table2');
        table2.style.width = '100%';
        table2.style.borderCollapse = 'collapse';

        const thead2 = document.createElement('thead');
        thead2.innerHTML = `
            <tr>
                <th>Motivo</th>
                <th>Status</th>
                <th>Ações</th>
            </tr>
        `;
        table2.appendChild(thead2);

        const tbody2 = document.createElement('tbody');
        const tr2 = document.createElement('tr');

        const tdMotivo = document.createElement('td');
        tdMotivo.textContent = agendamento.motivo;
        tr2.appendChild(tdMotivo);

        const tdStatus = document.createElement('td');
        tdStatus.textContent = agendamento.status;
        tr2.appendChild(tdStatus);

        const tdAcoes = document.createElement('td');

        // Botões só se estiver pendente
        if (agendamento.status === "Pendente") {
            // Confirmar
            const btnConfirm = document.createElement('button');
            btnConfirm.className = 'btn btn-confirm';
            btnConfirm.textContent = 'Confirmar';
            btnConfirm.addEventListener('click', () => {
                updateCliente({
                    data: agendamento.data,
                    hora: agendamento.hora,
                    status: "Confirmado",
                    agendamento_id: agendamento.agendamento_id
                });
                alertMsg("Confirmar que o cliente compareceu ao agendamento.", 'success', 3000);
            });
            tdAcoes.appendChild(btnConfirm);

            // Reagendar
            const btnReagendar = document.createElement('button');
            btnReagendar.className = 'btn btn-reagendar';
            btnReagendar.textContent = 'Reagendar';
            btnReagendar.addEventListener('click', () => {
                const modal = document.getElementById("modal-reagendar");
                const novaData = document.getElementById("nova-data");
                const novaHora = document.getElementById("nova-hora");
                novaData.value = agendamento.data;
                novaHora.value = agendamento.hora;
                modal.style.display = "block";

                document.getElementById("btnFecharModal").onclick = () => {
                    modal.style.display = "none";
                };

                document.getElementById("btnSalvarReagendamento").onclick = () => {
                    const novaDataValor = novaData.value;
                    const novaHoraValor = novaHora.value;

                    if (novaDataValor && novaHoraValor) {
                        updateCliente({
                            data: novaDataValor,
                            hora: novaHoraValor,
                            status: "Pendente",
                            agendamento_id: agendamento.agendamento_id
                        });
                        alertMsg("Agendamento reagendado com sucesso.", 'success', 3000);
                        modal.style.display = "none";
                    } else {
                        alertMsg("Por favor, preencha todos os campos.", 'error', 3000);
                    }
                };
            });
            tdAcoes.appendChild(btnReagendar);

            // Cancelar
            const btnCancel = document.createElement('button');
            btnCancel.className = 'btn btn-cancel';
            btnCancel.textContent = 'Cancelar';
            btnCancel.addEventListener('click', () => {
                updateCliente({
                    data: agendamento.data,
                    hora: agendamento.hora,
                    status: "Cancelado",
                    agendamento_id: agendamento.agendamento_id
                });
                alertMsg("Cliente não compareceu ao agendamento.", 'warning', 3000);
            });
            tdAcoes.appendChild(btnCancel);
        } else {
            tdAcoes.textContent = '-';
        }

        tr2.appendChild(tdAcoes);
        tbody2.appendChild(tr2);
        table2.appendChild(tbody2);

        // Adiciona as duas tabelas dentro da div container
        agendamentoContainer.appendChild(table1);
        agendamentoContainer.appendChild(table2);

        // Adiciona o container principal ao container do formulário
        containerForm.appendChild(agendamentoContainer);
    });
}

// Chama a função para carregar os dados assim que a página for carregada
buscarAgendamentos();

document.addEventListener("DOMContentLoaded", function () {
    const historicoBtn = document.getElementById("li-historico");
    const divHistorico = document.querySelector(".div-historico");
    const closeBtnHistorico = document.querySelector(".btnCloseHist");

    // Mostrar a div quando clicar em "Agendar"
    historicoBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Impede o redirecionamento
        divHistorico.style.display = "flex"; cpfFilter.focus();
        // Verifica se a div está visível e muda o fundo do botão
        if (window.getComputedStyle(divHistorico).display === "flex") {
            estilizarLinkAtivo(historicoBtn);
        }
    });

    closeBtnHistorico.addEventListener("click", function () {
        divHistorico.style.display = "none";
        historicoBtn.style.background = "";
        historicoBtn.style.color = "";
    });
});

const filtrarHistorico = document.getElementById('filtrarHistorico');
const divHistorico = document.getElementById('div-table-historico');
let clienteId = document.getElementById('clienteID');

filtrarHistorico.addEventListener('click', async (e) => {
    e.preventDefault();

    try {
        // Busca os agendamentos na API
        const response = await fetch('http://localhost:3000/getAgenda', {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123'
            }
        });
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const agendamentos = await response.json();


        if (!clienteId) {
            console.error("O campo clienteID não foi encontrado ou está vazio.");
            return;
        }

        // Chama a função para renderizar os agendamentos filtrados
        renderizarHistoricoAgendamento(agendamentos, clienteId);
    } catch (error) {
        console.error('Erro ao buscar os agendamentos:', error);
    }
});

async function renderizarHistoricoAgendamento(agendamentosAPI, clienteId) {
    const agendamentos = await agendamentosAPI.filter(clienteFilter => clienteFilter.cliente_id === clienteId);
    const containerForm = document.getElementById('div-table-historico');
    console.log("Agendamentos filtrados:", agendamentos); // Verifique se os dados estão chegando corretamente~
    console.log("Agendamentos callback:", agendamentosAPI); // Verifique se os dados estão chegando corretamente~
    console.log("clienteID callback:", clienteId); // Verifique se os dados estão chegando corretamente~

    if (!containerForm) {
        console.error('Elemento de contêiner de formulário não encontrado!');
        return;
    }

    // Criação da tabela
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    tbody.id = 'agenda-list'; // A lista de agendamentos será inserida aqui

    // Cabeçalho da tabela
    thead.innerHTML = `
        <tr>
            <th>CPF</th>
            <th>Nome</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Motivo</th>
            <th>Status</th>
            <th>Ações</th>
        </tr>
    `;

    // Adicionando o cabeçalho e o corpo da tabela
    table.appendChild(thead);
    table.appendChild(tbody);

    // Inserir a tabela na div-container-form
    divHistorico.appendChild(table);

    // Limpa o conteúdo da tabela antes de adicionar novos dados
    tbody.innerHTML = '';

    if (agendamentos.length === 0) {
        const noDataMessage = document.createElement('tr');
        noDataMessage.innerHTML = '<td colspan="7">Nenhum agendamento encontrado.</td>';
        tbody.appendChild(noDataMessage);
        return;
    }

    // Ordena os agendamentos por data (mais próxima primeiro)
    agendamentos.sort((a, b) => {
        const dataA = new Date(a.data.split('/').reverse().join('-'));
        const dataB = new Date(b.data.split('/').reverse().join('-'));

        if (a.status === "Cancelado" && b.status !== "Cancelado") return 1;
        if (a.status !== "Cancelado" && b.status === "Cancelado") return -1;
        if (a.status === "Confirmado" && b.status !== "Confirmado") return 1;
        if (a.status !== "Confirmado" && b.status === "Confirmado") return -1;

        return dataA - dataB;
    });

    // Função para normalizar a data (removendo horário)
    function normalizarData(dataStr) {
        const [dia, mes, ano] = dataStr.split('/');
        const data = new Date(`${ano}-${mes}-${dia}`);
        data.setHours(0, 0, 0, 0);
        return data;
    }

    // Data de hoje sem horário
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Ajustando hoje +1 dia e -1 dia para comparação
    const hojeMais1 = new Date(hoje);
    hojeMais1.setDate(hoje.getDate() + 1);

    const hojeMenos1 = new Date(hoje);
    hojeMenos1.setDate(hoje.getDate());

    // Pegando a tabela
    const tabela = document.querySelector("#tabelaAgendamentos tbody");

    // Criando as linhas da tabela
    agendamentos.forEach(agendamento => {
        const tr = document.createElement('tr');

        const dataAgendamento = normalizarData(agendamento.data);

        // Comparação ajustada para evitar bugs de fuso horário
        if (agendamento.status === "Cancelado") {
            tr.style.backgroundColor = "rgba(255, 0, 0, 0.2)"; // Vermelho claro
        } else if (agendamento.status === "Confirmado") {
            tr.style.backgroundColor = "rgba(0, 128, 0, 0.2)"; // Verde claro
        } else if (agendamento.status === "Pendente") {
            if (dataAgendamento.getTime() === hoje.getTime()) {
                tr.style.backgroundColor = "rgba(255, 255, 0, 0.5)"; // Amarelo para hoje
            } else if (dataAgendamento.getTime() < hojeMenos1.getTime()) {
                tr.style.backgroundColor = "rgba(255, 0, 0, 0.5)"; // Vermelho para passado
            }

        }

        // Criando as células (td)
        const tdCpfCliente = document.createElement('td');
        tdCpfCliente.textContent = decode(agendamento.cpf);
        tr.appendChild(tdCpfCliente);

        const tdNomeCliente = document.createElement('td');
        tdNomeCliente.textContent = agendamento.nome;
        tr.appendChild(tdNomeCliente);

        const tdData = document.createElement('td');
        tdData.textContent = validarDataVenda(agendamento.data);
        tr.appendChild(tdData);

        const tdHora = document.createElement('td');
        tdHora.textContent = agendamento.hora;
        tr.appendChild(tdHora);

        const tdMotivo = document.createElement('td');
        tdMotivo.textContent = agendamento.motivo;
        tr.appendChild(tdMotivo);

        const tdStatus = document.createElement('td');
        tdStatus.textContent = agendamento.status;
        tr.appendChild(tdStatus);

        // Criando a célula para os botões
        const tdAcoes = document.createElement('td');

        // Se o status for "Pendente", adiciona botões de ação
        if (agendamento.status === "Pendente") {
            // Botão Confirmar
            const btnConfirm = document.createElement('button');
            btnConfirm.className = 'btn btn-confirm';
            btnConfirm.textContent = 'Confirmar';
            btnConfirm.addEventListener('click', () => {
                const agendamentoId = {
                    "data": agendamento.data,
                    "hora": agendamento.hora,
                    "status": "Confirmado",
                    "agendamento_id": agendamento.agendamento_id
                };
                updateCliente(agendamentoId);
                alertMsg("Confirmar que o cliente compareceu ao agendamento.", 'success', 3000);
            });
            tdAcoes.appendChild(btnConfirm);

            // Botão Reagendar
            const btnReagendar = document.createElement('button');
            btnReagendar.className = 'btn btn-reagendar';
            btnReagendar.textContent = 'Reagendar';
            btnReagendar.addEventListener('click', () => {
                // Exibe o modal de reagendamento com a data e hora atuais do agendamento
                const modal = document.getElementById("modal-reagendar");
                const novaData = document.getElementById("nova-data");
                const novaHora = document.getElementById("nova-hora");

                // Define a data e hora no modal
                novaData.value = agendamento.data;  // Assume que 'agendamento.data' está no formato 'YYYY-MM-DD'
                novaHora.value = agendamento.hora;  // Assume que 'agendamento.hora' está no formato 'HH:MM'

                // Abre o modal
                modal.style.display = "block";

                // Fechar o modal
                const btnFecharModal = document.getElementById("btnFecharModal");
                btnFecharModal.addEventListener('click', () => {
                    modal.style.display = "none";
                });

                // Salvar o reagendamento
                const btnSalvarReagendamento = document.getElementById("btnSalvarReagendamento");
                btnSalvarReagendamento.addEventListener('click', () => {
                    const novaDataValor = novaData.value;
                    const novaHoraValor = novaHora.value;

                    if (novaDataValor && novaHoraValor) {
                        const agendamentoId = {
                            "data": novaDataValor,
                            "hora": novaHoraValor,
                            "status": "Pendente",
                            "agendamento_id": agendamento.agendamento_id
                        };

                        updateCliente(agendamentoId);
                        alertMsg("Agendamento reagendado com sucesso.", 'success', 3000);

                        // Fecha o modal após salvar
                        modal.style.display = "none";
                    } else {
                        alertMsg("Por favor, preencha todos os campos.", 'error', 3000);
                    }
                });
            });
            tdAcoes.appendChild(btnReagendar);

            // Botão Cancelar
            const btnCancel = document.createElement('button');
            btnCancel.className = 'btn btn-cancel';
            btnCancel.textContent = 'Cancelar';
            btnCancel.addEventListener('click', () => {
                const agendamentoId = {
                    "data": agendamento.data,
                    "hora": agendamento.hora,
                    "status": "Cancelado",
                    "agendamento_id": agendamento.agendamento_id
                };
                updateCliente(agendamentoId);
                alertMsg("Cliente não compareceu ao agendamento.", 'warning', 3000);
            });
            tdAcoes.appendChild(btnCancel);
        }
        tr.appendChild(tdAcoes);
        tbody.appendChild(tr);
    });
}



document.addEventListener("DOMContentLoaded", function () {
    const agendarBtn = document.getElementById("li-cadastro-agenda");
    const divAgendar = document.querySelector(".div-agendar");
    const closeBtn = document.querySelector(".close-btn");

    // Mostrar a div quando clicar em "Agendar"
    agendarBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Impede o redirecionamento
        divAgendar.style.display = "flex";
        inputCPF.focus();
        // Verifica se a div está visível e muda o fundo do botão
        if (window.getComputedStyle(divAgendar).display === "flex") {
            estilizarLinkAtivo(agendarBtn)
        }
    });

    // Fechar a div ao clicar no "X"
    closeBtn.addEventListener("click", function () {
        divAgendar.style.display = "none";
        agendarBtn.style.background = ""; // Reseta o background ao fechar
        agendarBtn.style.color = "";
    });
});

btnCadastrar.addEventListener('click', async (e) => {
    e.preventDefault();
    const containerForm = document.getElementById('div-container-form');

    // Obtém a data e a hora atuais no fuso local
    const agora = new Date();
    const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()); // Mantém apenas ano, mês e dia

    const dataSelecionada = new Date(inputDate.value + "T00:00:00"); // Garante que não haja problema de fuso
    const horaSelecionada = inputHora.value;

    // Verifica se todos os campos foram preenchidos
    if (!clienteID.value || !inputDate.value || !inputHora.value || !inputMotivo.value) {
        alertMsg('Preencha todos os campos antes de cadastrar!', 'error', 4000);
        return;
    }

    // Verifica se a data selecionada já passou
    if (dataSelecionada < hoje) {
        alertMsg('Não é possível agendar para uma data que já passou!', 'error', 4000);
        return;
    }

    // Se a data for hoje, verifica se a hora já passou
    if (dataSelecionada.getTime() === hoje.getTime()) {
        const [hora, minutos] = horaSelecionada.split(':').map(Number);
        const horaAtual = agora.getHours();
        const minutosAtuais = agora.getMinutes();

        if (hora < horaAtual || (hora === horaAtual && minutos < minutosAtuais)) {
            alertMsg('O horário selecionado já passou!', 'error', 4000);
            return;
        }
    }

    const produtoData = {
        cliente_id: parseInt(clienteID.value), // Garante que seja um número
        data: inputDate.value,
        hora: inputHora.value,
        motivo: inputMotivo.value,
    };

    // Chama a função para cadastrar
    const response = await postNewAgendamento(produtoData);


    if (response) { // Se o cadastro foi bem-sucedido
        alertMsg('Novo agendamento cadastrado com sucesso!', 'success', 4000);
        containerForm.innerHTML = ''
        setTimeout(() => {
            inputCPF.value = '';
            clienteNome.value = '';
            clienteID.value = '';
            inputDate.value = '';
            inputHora.value = '';
            inputMotivo.value = '';
            buscarAgendamentos();
        }, 3000);
    }
});

const limparButton = document.getElementById('limparButton')
limparButton.addEventListener('click', () => {
    divHistorico.innerHTML = ''
    cpfFilter.value = '';
    clienteHistorico.value = '';
    setTimeout(() => {
        cpfFilter.focus();
    }, 500)
})










