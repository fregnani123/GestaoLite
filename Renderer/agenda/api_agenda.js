const inputCPF = document.getElementById('input-cpf');
const cpfFilter = document.getElementById('cpfFilter');
const clienteNome = document.getElementById('cliente-nome');
const clienteHistorico = document.getElementById('cliente-historico');
const clienteID = document.getElementById('cliente-id');
const inputDate = document.getElementById('input-data');
const inputHora = document.getElementById('input-hora');
const inputMotivo = document.getElementById('input-motivo');
const btnCadastrar = document.getElementById('btn-cadastrar');
const msgAgenda = document.querySelector('.msgAgenda');
const linkID_10 = document.querySelector('.list-a10');
const btnAgendamentos = document.getElementById('agendamentos');
const btnCadastroAgenda = document.getElementById('li-cadastro-agenda');
const btnliHistorico = document.getElementById('li-historico');
const divAgendar = document.querySelector(".div-agendar");
const divHistoricoAgendar = document.querySelector(".div-historico");
const closeBtn = document.querySelector(".close-btn");


inputMaxCaracteres(inputMotivo, 80);

const btnAtivo = document.getElementById('btn-ativo');

function estilizarLinkAtivo(linkID) {
    if (btnAtivo.id === 'btn-ativo') {
        linkID.style.background = '#3a5772';
        linkID.style.textShadow = 'none'; 
        linkID.style.color = 'white';  
        linkID.style.borderBottom = '2px solid #d7d7d7'; 
    }
}

document.addEventListener('DOMContentLoaded', () => {
      estilizarLinkAtivo(linkID_10
      )
})



function toggleVendasFiltradas(targetDiv, targetBtn, otherDiv, otherBtn) {
    if (!targetDiv || !targetBtn || !otherDiv || !otherBtn) return; // Previne erros caso elementos não existam

    // Obtém o estado atual da div
    const isHidden = window.getComputedStyle(targetDiv).display === 'none';

    // Fecha a outra div antes de abrir a atual
    if (window.getComputedStyle(otherDiv).display !== 'none') {
        otherDiv.style.display = 'none';
        otherBtn.removeAttribute('style');
    }

    // Exibe a div selecionada se estiver oculta
    if (isHidden) {
        targetDiv.style.display = 'flex';
        targetBtn.style.background = 'var(--hover-color)';
        targetBtn.style.color = 'black';
        targetBtn.style.textShadow = 'none';
        targetBtn.style.borderBottom = '2px solid black';
    } else {
        targetDiv.style.display = 'none';
        targetBtn.removeAttribute('style');
    }
}

btnCadastroAgenda.addEventListener('click', () => {
    toggleVendasFiltradas(divAgendar, btnCadastroAgenda, divHistoricoAgendar, btnliHistorico);
});

btnliHistorico.addEventListener('click', () => {
    toggleVendasFiltradas(divHistoricoAgendar, btnliHistorico, divAgendar, btnCadastroAgenda);
});


// Função para atualizar estilos do botão btnCobrar
function atualizarEstiloBotaoCobrar() {
    const isFiltradasVisible = getComputedStyle(divHistoricoAgendar).display !== 'none';
    const isVencidosVisible = getComputedStyle(divAgendar).display !== 'none';

    if (isFiltradasVisible || isVencidosVisible) {
        btnAgendamentos.style.background = '';
        btnAgendamentos.style.color = '';
        btnAgendamentos.style.textShadow = '';
        btnAgendamentos.style.borderBottom = '';
        btnAgendamentos.style.cursor = 'pointer';
    } else {
        btnAgendamentos.style.background = 'var(--hover-color)';
        btnAgendamentos.style.color = 'black';
        btnAgendamentos.style.textShadow = 'none';
        btnAgendamentos.style.borderBottom = '2px solid black';
        btnAgendamentos.style.cursor = 'pointer';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('#ul-Menu a');

    links.forEach(link => {
        // Verifique se a URL do link é igual à URL da página atual
        if (window.location.pathname === link.getAttribute('href')) {
            link.classList.add('active'); // Adiciona a classe "active" ao link correspondente
        }
    });
});

formatarEVerificarCPF(inputCPF);
inputMaxCaracteres(inputCPF, 14)
formatarEVerificarCPF(cpfFilter);
inputMaxCaracteres(cpfFilter, 14)
async function buscarAgendamentos() {
    const urlAgendamentos = 'http://localhost:3000/getAgenda';

    try {
        const response = await fetch(urlAgendamentos, {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const agendamentos = await response.json();
        msgAgenda.innerHTML = ''
        renderizarAgendamentos(agendamentos); 

    } catch (error) {
        console.error('Erro ao buscar os agendamentos:', error);
    }
};
async function findCliente(cpf) {
    if (!cpf.trim()) return; // Evita buscar se o CPF estiver vazio

    const findOneClient = `http://localhost:3000/getCliente/${cpf}`;

    try {
        const response = await fetch(findOneClient, {
            method: 'GET',
            headers: { 
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            if (response.status === 404) {
                alertMsg("Cliente não encontrado.", 'info', 3000);
                clienteNome.value = ""; // Limpa o campo caso não encontre
                return null;
            }
            console.error(`Erro na requisição: ${response.status}`);
            return null;
        }

        const data = await response.json();
        console.log("Dados recebidos:", data); // Log para depuração
    
        if (Array.isArray(data) && data.length > 0) {
            // Se for um array e tiver elementos, pega o primeiro
            clienteNome.value = data[0].nome;
            clienteID.value = data[0].cliente_id;
            clienteHistorico.value = data[0].nome;
            clienteId = data[0].cliente_id;
             
        } else if (data && data.nome) {
            // Se for um objeto direto
            clienteNome.value = data.nome;
        } else {
            console.warn("Nenhum dado válido retornado.");
            clienteNome.value = ""; // Limpa o campo caso não haja retorno válido
        }

    } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        clienteNome.value = ""; // Limpa o campo caso ocorra um erro
    }
}

async function postNewAgendamento(produtoData) {
    const apiEndpoint = `http://localhost:3000/postNewAgendamento`;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produtoData),
        });

        let responseData;
        try {
            responseData = await response.json();
        } catch {
            responseData = null;
        }

        if (!response.ok) {
            console.error('Erro ao cadastrar novo agendamento:', responseData || 'Erro desconhecido');
            return false; // Retorna false em caso de erro
        }

        console.log('Produto e imagem adicionados com sucesso:', responseData);
        return true; // Retorna true se o cadastro for bem-sucedido

    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        return false; // Retorna false em caso de erro
    }
}


async function updateCliente(agendamentoId) {
    const updateCliente = 'http://localhost:3000/UpdateAgendamento'
    try {
        const patchResponse = await fetch(updateCliente, {
            method: 'PATCH',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(agendamentoId), // Apenas serialize aqui
        });

        if (!patchResponse.ok) {
            alertMsg('Erro ao confirmar agendamento', 'info', 3000);
        } else {
           console.log("Status atualizado com sucesso!");
            setTimeout(() => {
                location.reload();
            }, 3000);

        }
    } catch (error) {
        console.log('Erro durante a atualização do agendamento', error);
    }
};

