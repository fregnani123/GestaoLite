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










