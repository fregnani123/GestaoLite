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