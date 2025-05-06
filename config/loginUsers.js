const usernameCod = document.getElementById('username');
const passwordCod = document.getElementById('password');

// Função para inverter a string
function reverseString(str) {
    return str.split('').reverse().join('');
}
// Função para remover o número aleatório inserido no CNPJ/CPF
function removeRandomNumber(cnpjCpf) {
    // Encontra a posição do primeiro ponto e remove o número aleatório entre o ponto
    const parts = cnpjCpf.split('.');
    if (parts.length > 2) {
        parts.splice(1, 1); // Remove o número aleatório (posição 1)
    }
    return parts.join('.');
}

function decodeCnpjCpf(encodedCnpjCpf) {
    const decodedValue = atob(encodedCnpjCpf);
    const cleanedValue = decodedValue.slice(3, decodedValue.length - 4);
    const reversedValue = reverseString(cleanedValue);

    return removeRandomNumber(reversedValue);
}

let senhaCodificada = '';
let usuaroiCod  = '';

async function getUser() {
    
    const getUserApi = 'http://localhost:3000/getUsuario';

    try {
        const response = await fetch(getUserApi, {
            method: 'GET',
            headers: {
                'x-api-key':  'segredo123',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            console.log('Nenhum usuário encontrado. Definindo login padrão (adm, adm)');
            senhaCodificada = 'ZmdsbWRhMTk2OQ==';
            usuaroiCod = 'adm';
        } else {
            senhaCodificada = data[0].senha || "";
            usuaroiCod = data[0].usuario || "";
            console.log('Usuário obtido com sucesso:', data);
        }

    } catch (error) {
        console.error('Erro ao obter usuário:', error.message);
        alertMsg(error.message, 'error', 4000);
    }
}

function focus() {
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.focus();
    }
}

document.getElementById('username').addEventListener('keydown', (e) => {
    
    if (e.key === 'Enter') {
        e.preventDefault(); // Evita o envio do formulário
        document.getElementById('password').focus(); // Move o foco para o próximo input
    }
});

document.getElementById('password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Evita o envio do formulário
        document.getElementById('formLogin').focus(); // Move o foco para o botão de login
    }
});

document.getElementById('formLogin').addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const senhaDecodificada = decodeCnpjCpf(senhaCodificada);


    if (username === usuaroiCod && password === senhaDecodificada) {
        window.location.href = '../public/menu.html';
        console.log('Login bem-sucedido');
    } else {
        alertMsg('Usuário ou senha inválidos', 'error', 3000);
        usernameCod.value = '';
        passwordCod.value = '';
        usernameCod.focus();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('termos');
    const botaoAtivar = document.getElementById('ativar-btn');
    
    checkbox.addEventListener('change', () => {
        botaoAtivar.disabled = !checkbox.checked;
    });
});

const abrirTermos = document.getElementById('abrir-termos');
const termosBox = document.getElementById('termos-box');
const fecharTermos = document.getElementById('btn-exit');

abrirTermos.addEventListener('click', (e) => {
  e.preventDefault();
  termosBox.style.display = 'flex';
});

fecharTermos.addEventListener('click', () => {
  termosBox.style.display = 'none';
});


const botaoAtivar = document.getElementById('ativar-btn');

botaoAtivar.addEventListener('click', (e) => {
    e.preventDefault();

    const inputClient = document.getElementById('cliente').value
    const inputSerial = document.getElementById('serial-key').value

    if (!inputClient || !inputSerial) {
        alert('inputs vazios');
        return;
    }
    verificaDadosSerial(inputClient, inputSerial);
});


verificaValidadeDate();
verificaAtivacaoMysql();
getUser();


