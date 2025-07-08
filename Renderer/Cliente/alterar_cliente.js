// Seus elementos de input
const cpfInput = document.getElementById('cpf');
const nomeInput = document.getElementById('nome');
const dataNascimentoInput = document.getElementById('dataNascimento');
const telefoneInput = document.getElementById('telefone');
const emailInput = document.getElementById('email');
const cepInput = document.getElementById('cep');
const logradouroInput = document.getElementById('logradouro');
const numeroInput = document.getElementById('numero');
const bairroInput = document.getElementById('bairro');
const observacoesTextarea = document.getElementById('observacoes');
const creditoLiberado = document.getElementById('alterarCredito');
const setEstado = document.getElementById('uf');
const inputCidade = document.getElementById('cidade');
const btnAtualizar = document.getElementById('btn-atualizar');
const btnBuscar = document.getElementById('btn-buscar');
const limparButtonFilter = document.getElementById('limparButton');
const creditoUtilizado = document.getElementById('creditoUtilizado');
const linkID_7 = document.querySelector('.list-a7');
const ocupacao = document.getElementById('ocupacao');

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
      estilizarLinkAtivo(linkID_7)
})
  

document.addEventListener('DOMContentLoaded', () => {
    cpfInput.focus();
    formatarEVerificarCPF(cpf);
    // Aplicando as formatações e verificações
    formatarTelefone(telefone);
    inputMaxCaracteres(telefone, 15);

    verificarEmail(email);
    inputMaxCaracteres(email, 150);

    formatarCEP(cep);
    inputMaxCaracteres(cep, 9);

    formatarEVerificarCPF(cpf);
    inputMaxCaracteres(cpf, 14);

    // Limitando o número de caracteres para outros campos
    inputMaxCaracteres(nome, 200);
    inputMaxCaracteres(logradouro, 250);
    inputMaxCaracteres(bairro, 150);
    inputMaxCaracteres(cidade, 150);
    inputMaxCaracteres(uf, 2);
    preencherSelect(ocupacao);
});


creditoLiberado.addEventListener('input', () => {
    let valor = creditoLiberado.value.replace(/\D/g, ""); // Remove tudo que não for número
    let numero = Number(valor) / 100; // Converte para decimal

    creditoLiberado.value = numero.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
});

async function findCliente(cpf) {
    const findOneClient = `http://localhost:3000/getCliente/${cpf}`;

    try {
        const response = await fetch(findOneClient, {
            method: 'GET',
            headers: { 
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            console.log('Cliente não encontrado');
            return;
        }

        const data = await response.json();
        console.log("Dados recebidos:", data);

        const cliente = data[0];

        clienteAlterar = cliente.cliente_id;

        // Preenche os campos de entrada com os dados do cliente
        nomeInput.value = cliente.nome;
        dataNascimentoInput.value = cliente.data_nascimento;
        telefoneInput.value = cliente.telefone;
        emailInput.value = cliente.email;
        cepInput.value = cliente.cep;
        logradouroInput.value = cliente.logradouro;
        numeroInput.value = cliente.numero || '';
        bairroInput.value = cliente.bairro;

        creditoLiberado.value = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(cliente.credito_limite || 0).replace("R$", "").trim();
        
        creditoUtilizado.value = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(cliente.credito_utilizado || 0).replace("R$", "").trim();
        
        observacoesTextarea.value = cliente.observacoes || '';

        const select = document.getElementById("ocupacao");

        for (let option of select.options) {
            if (option.value === cliente.ocupacao) {
                option.selected = true;
                break; // Sai do loop assim que encontrar a opção correspondente
            }
        }
        
        // Define o valor do estado
        setEstado.value = cliente.estado || 'Selecione';

        // Dispara o evento change para carregar as cidades
        const eventoChange = new Event('change');
        setEstado.dispatchEvent(eventoChange); // Dispara o evento change

        for (let option of inputCidade.options) {
            if (option.text === cliente.cidade) {
                option.selected = true;
                break;  // Sai do loop assim que encontrar a cidade
            }
        }

    } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        alertMsg("Erro ao buscar cliente. Tente novamente.", "error", 3000);
        cpfInput.focus();
    }
}

function limparInputs() {
    nomeInput.value = '';
    dataNascimentoInput.value = '';
    telefoneInput.value = '';
    emailInput.value = '';
    cepInput.value = '';
    logradouroInput.value = '';
    numeroInput.value = '';
    bairroInput.value = '';
    creditoLiberado.value = '0,00';
    ocupacao.value = 'Selecione';
    observacoesTextarea.value = '';
    setEstado.value = 'Selecione';
    inputCidade.value = 'Selecione';
}

function limparInputsAoAtulizar() {
    cpfInput.value = ''
    nomeInput.value = '';
    dataNascimentoInput.value = '';
    telefoneInput.value = '';
    emailInput.value = '';
    cepInput.value = '';
    logradouroInput.value = '';
    numeroInput.value = '';
    bairroInput.value = '';
    creditoLiberado.value = '0,00';
    ocupacao.value = 'Selecione';
    observacoesTextarea.value = '';
    setEstado.value = 'Selecione';
    inputCidade.value = 'Selecione';
}


// Garantir que o CPF seja formatado e validado
formatarEVerificarCPF(cpfInput);
inputMaxCaracteres(cpfInput, 14);

cpfInput.addEventListener('input', (e) => {
    if (cpfInput.value.length < 14) {
        limparInputs()
    }
    const cpf = e.target.value.trim();
    const cpfFormatado = formatarCPF(cpf);

    if (cpf.length === 14) {
        findCliente(cpfFormatado);
    } else if (cpf.length === 0) {
        console.log('Informe o CPF do cliente já cadastrado no sistema.');
    }
});

async function updateCliente(clienteId) {
    const updateCliente = 'http://localhost:3000/updateCliente'
    try {
        const patchResponse = await fetch(updateCliente, {
            method: 'PATCH',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clienteId), // Apenas serialize aqui
        });

        if (!patchResponse.ok) {
            alertMsg('Erro ao atualizar cliente', 'info', 3000);
        } else {
            alertMsg('Cliente atualizado com sucesso', 'success', 3000);
            setTimeout(() => {
               limparInputsAoAtulizar()
            }, 2000);

        }
    } catch (error) {
        console.log('Erro durante a atualização do cliente:', error);
    }
};



function formatarNumero(valor) {
    // Remove todas as vírgulas (milhares) e troca a vírgula decimal por ponto
    let valorFormatado = valor.replace(/\./g, '');  // Remove os pontos de milhares
    valorFormatado = valorFormatado.replace(',', '.');  // Substitui a vírgula por ponto
    return parseFloat(valorFormatado);  // Converte para float
}

async function atualizarCliente() {
    const clienteId = {
        telefone: telefoneInput.value,
        email: emailInput.value,
        cep: cepInput.value,
        logradouro: logradouroInput.value,
        numero: numeroInput.value,
        bairro: bairroInput.value,
        estado: setEstado.value,
        cidade: inputCidade.value,
        credito_limite: formatarNumero(creditoLiberado.value),
        credito_utilizado: formatarNumero(creditoUtilizado.value),
        ocupacao: ocupacao.value,
        cliente_id: clienteAlterar
    };

    updateCliente(clienteId);
}

btnAtualizar.addEventListener('click', () => {
    exibirOverlayEAposDelay(atualizarCliente, 1000); // agora vai funcionar
});


limparButtonFilter.addEventListener('click',()=>{
    location.reload();
});
