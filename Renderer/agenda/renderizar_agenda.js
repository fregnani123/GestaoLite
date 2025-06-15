
function renderizarAgendamentos(agendamentos) {
    const containerForm = document.getElementById('div-container-form');

    console.log("Agendamentos recebidos:", agendamentos);
    if (!containerForm) {
        console.error('Elemento de contêiner de formulário não encontrado!');
        return;
    }

    containerForm.innerHTML = '';

    if (agendamentos.length === 0) {
        const noDataMessage = document.createElement('p');
        noDataMessage.textContent = 'Nenhum agendamento encontrado.';
        containerForm.appendChild(noDataMessage);
        return;
    }

    agendamentos.sort((a, b) => {
        const dataA = new Date(a.data.split('/').reverse().join('-'));
        const dataB = new Date(b.data.split('/').reverse().join('-'));

        if (a.status === "Cancelado" && b.status !== "Cancelado") return 1;
        if (a.status !== "Cancelado" && b.status === "Cancelado") return -1;
        if (a.status === "Confirmado" && b.status !== "Confirmado") return 1;
        if (a.status !== "Confirmado" && b.status === "Confirmado") return -1;

        return dataA - dataB;
    });

    function normalizarData(dataStr) {
        const [dia, mes, ano] = dataStr.split('/');
        const data = new Date(`${ano}-${mes}-${dia}`);
        data.setHours(0, 0, 0, 0);
        return data;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    agendamentos.forEach(agendamento => {
        const agendamentoContainer = document.createElement('div');
        agendamentoContainer.classList.add('agendamento');
        agendamentoContainer.style.marginBottom = '20px';

        // === TABELA 3 - CABEÇALHO ===
        const table3 = document.createElement('table');
        table3.classList.add('table3');
        table3.style.cssText = 'width: 100%; border-collapse: collapse; margin-top: 10px !important';

        const thead3 = document.createElement('thead');

        const dataAgendamento = normalizarData(agendamento.data);
        const dataFormatada = dataAgendamento.toLocaleDateString('pt-BR');

        thead3.innerHTML = `
    <tr>
        <th style="display: flex; align-items: center; padding: 8px !important;">
            <img src="../style/img/agenda-ico.png" alt="ícone agenda" style="height: 20px; margin-right: 8px !important;">
<span class="status-inspirado" style="margin-left: 0px;"></span>
        </th>
    </tr>
`;

        const thStyle = thead3.querySelector('th').style;
        const spanInspirado = thead3.querySelector('.status-inspirado');

        if (agendamento.status === "Cancelado") {
            thStyle.cssText += "background-color: rgba(255,0,0,0.2) !important;";
            spanInspirado.textContent = `Agendamento cancelado.`;
            spanInspirado.style.color = " rgb(0, 0, 0)";

        } else if (agendamento.status === "Confirmado") {
            thStyle.cssText += "background-color: rgba(0,128,0,0.2) !important;";
            spanInspirado.textContent = `Agendamento finalizado com sucesso.`;
            spanInspirado.style.color = " rgb(0, 0, 0)";

        } else if (agendamento.status === "Pendente") {
            if (dataAgendamento.getTime() === hoje.getTime()) {
                thStyle.cssText += "background-color:rgba(44, 77, 110, 0.35) !important;";
                spanInspirado.textContent = `Agendado para hoje às ${agendamento.hora}`;
                spanInspirado.style.color = " rgb(0, 0, 0)";

            } else if (dataAgendamento.getTime() < hoje.getTime()) {
                thStyle.cssText += "background-color: rgba(255, 0, 0, 0.32) !important; color: black !important;";
                spanInspirado.textContent = ` - Inspirado em ${dataFormatada} - Aguardando ação do usuário.`;
                spanInspirado.style.color = "black";
            }
        }

        table3.appendChild(thead3);

        // === TABELA 1 - INFORMAÇÕES PRINCIPAIS ===

        const table1 = document.createElement('table');
        table1.classList.add('table1');

        const thead1 = document.createElement('thead');
        thead1.innerHTML = `
    <tr>   
        <th>Criado em</th>
        <th>CPF / CNPJ</th>
        <th>Nome</th>
        <th>Agendado para data</th>
        <th>Hora</th>
    </tr>
`;
        table1.appendChild(thead1);

        const tbody1 = document.createElement('tbody');
        const tr1 = document.createElement('tr');
        tr1.innerHTML = `
    <td>${agendamento.criado || '10/06/2025'}</td>
    <td>${decode(agendamento.cpf)}</td>
    <td>${agendamento.nome}</td>
    <td>${validarDataVenda(agendamento.data)}</td>
    <td>${agendamento.hora}</td>
`;
        tbody1.appendChild(tr1);
        table1.appendChild(tbody1);



 // === TABELA 4 - Descrição detalhada do serviço a ser feito ===

        const table4 = document.createElement('table');
        table4.classList.add('table4');

        const thead4 = document.createElement('thead');
        thead4.innerHTML = `
    <tr>   
    <th>Tipo de Serviço</th>
    <th>Descrição</th></tr>
`;
        table4.appendChild(thead4);

        const tbody4 = document.createElement('tbody');
        const tr4 = document.createElement('tr');
        tr4.innerHTML = `
    <td>${'' || 'não cadastrado'}</td>
    <td>${'' || 'não cadastrado'}</td>
`;
        tbody4.appendChild(tr4);
        table4.appendChild(tbody4);

 // === TABELA 5 - Descrição detalhada do serviço a ser feito ===
   const table5 = document.createElement('table');
        table5.classList.add('table5');

        const thead5 = document.createElement('thead');
        thead5.innerHTML = `
    <tr>   
    <th>Materiais</th>
    <th>Tempo Estimado</th>

    </tr>
`;
        table5.appendChild(thead5);

        const tbody5 = document.createElement('tbody');
        const tr5= document.createElement('tr');
        tr5.innerHTML = `
    <td>${'' || 'não cadastrado'}</td>
    <td>${'' || 'não cadastrado'}</td>

`;
        tbody5.appendChild(tr5);
        table5.appendChild(tbody5);
    


        // === TABELA 6 ===
        const table6 = document.createElement('table');
        table6.classList.add('table6'); // mesma classe para manter o estilo

        const thead6 = document.createElement('thead');
        thead6.innerHTML = `
    <tr>
        <th>Contato do Cliente</th>
        <th>Responsavel / Profissional</th>
        <th>Agendado por</th>  
    </tr>
`;
        table6.appendChild(thead6);

        const tbody6 = document.createElement('tbody');
        const tr6 = document.createElement('tr');
        tr6.innerHTML = `
    <td>${agendamento.telefone || 'não cadastrado'}</td>
    <td>${agendamento.funcionario || 'não cadastrado'}</td>
    <td>${agendamento.agendado_por || 'não cadastrado'}</td>
`;
        tbody6.appendChild(tr6);
        table6.appendChild(tbody6);


        
        // === TABELA 7 ===
        const table7 = document.createElement('table');
        table7.classList.add('table7'); // mesma classe para manter o estilo

        const thead7 = document.createElement('thead');
        thead7.innerHTML = `
    <tr>
        <th>Observações</th>
    </tr>
`;
        table7.appendChild(thead7);

        const tbody7 = document.createElement('tbody');
        const tr7 = document.createElement('tr');
        tr7.innerHTML = `
    <td>${agendamento.telefone || 'não cadastrado'}</td>
`;
        tbody7.appendChild(tr7);
        table7.appendChild(tbody7);


        // === TABELA 2 - DETALHES + AÇÕES ===
        const table2 = document.createElement('table');
        table2.classList.add('table2');
        table2.style.cssText = 'width: 100%; border-collapse: collapse;';

        const thead2 = document.createElement('thead');
        thead2.innerHTML = `
            <tr>
                <th>Valor</th>
                <th>Pago?</th>
                <th>Status</th>
                <th>Ações</th>
            </tr>
        `;
        table2.appendChild(thead2);

        const tbody2 = document.createElement('tbody');
        const tr2 = document.createElement('tr');

        const tdValor = document.createElement('td');
        tdValor.textContent = 'não cadastrado';
        tr2.appendChild(tdValor);

        const tdPago = document.createElement('td');
        tdPago.textContent = 'não cadastrado';
        tr2.appendChild(tdPago);

        const tdStatus = document.createElement('td');
        tdStatus.textContent = agendamento.status;
        tr2.appendChild(tdStatus);

        const tdAcoes = document.createElement('td');
        const divBtn = document.createElement('div');
        divBtn.classList.add('acoes-container-agenda');

        if (agendamento.status === "Pendente") {
            const btnConfirm = document.createElement('button');
            btnConfirm.className = 'btn btn-confirm';
            btnConfirm.innerHTML = 'Confirmado';
            btnConfirm.onclick = () => {
                updateCliente({
                    data: agendamento.data,
                    hora: agendamento.hora,
                    status: "Confirmado",
                    agendamento_id: agendamento.agendamento_id
                });
                alertMsg("Confirmar que o cliente compareceu ao agendamento.", 'success', 3000);
            };
            divBtn.appendChild(btnConfirm);

            const btnReagendar = document.createElement('button');
            btnReagendar.className = 'btn btn-reagendar';
            btnReagendar.innerHTML = 'Reagendar';
            btnReagendar.onclick = () => {
                const modal = document.getElementById("modal-reagendar");
                const novaData = document.getElementById("nova-data");
                const novaHora = document.getElementById("nova-hora");
                novaData.value = agendamento.data;
                novaHora.value = agendamento.hora;
                modal.style.display = "block";

                document.getElementById("btnFecharModal").onclick = () => modal.style.display = "none";
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
            };
            divBtn.appendChild(btnReagendar);

            const btnCancel = document.createElement('button');
            btnCancel.className = 'btn btn-cancel';
            btnCancel.innerHTML = 'Cancelar';
            btnCancel.onclick = () => {
                updateCliente({
                    data: agendamento.data,
                    hora: agendamento.hora,
                    status: "Cancelado",
                    agendamento_id: agendamento.agendamento_id
                });
                alertMsg("Cliente não compareceu ao agendamento.", 'warning', 3000);
            };
            divBtn.appendChild(btnCancel);
        } else {
            divBtn.textContent = '-';
        }
        tdAcoes.appendChild(divBtn)
        tr2.appendChild(tdAcoes);
        tbody2.appendChild(tr2);
        table2.appendChild(tbody2);

        // Monta tudo no container principal
        agendamentoContainer.appendChild(table3);
        agendamentoContainer.appendChild(table1);
        agendamentoContainer.appendChild(table6);
        agendamentoContainer.appendChild(table4);
        agendamentoContainer.appendChild(table5);
         agendamentoContainer.appendChild(table7);
        agendamentoContainer.appendChild(table2);
        containerForm.appendChild(agendamentoContainer);
    });
}

// Chama a função para carregar os dados assim que a página for carregada
buscarAgendamentos();
