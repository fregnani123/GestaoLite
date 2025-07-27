const usernameCod = document.getElementById('username');
const passwordCod = document.getElementById('password');

usernameCod.focus()

let senhaCodificada = '';
let usuaroiCod = '';

async function getUser() {

  const getUserApi = 'http://localhost:3000/getUsuario';

  try {
    const response = await fetch(getUserApi, {
      method: 'GET',
      headers: {
        'x-api-key': 'segredo123',
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
      senhaCodificada = 'adm';
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

  const senhaDecodificada = senhaCodificada;


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
getUser();

function getSerial(displayNone) {

  const getSerial = 'http://localhost:3000/getSerial';

  fetch(getSerial, {
    method: 'GET',
    headers: {
      'x-api-key': 'segredo123',
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data => {
      if (!data || (Array.isArray(data) && data.length === 0)) {
        serialCodificado = ''
        console.log('Produto sem serial inserido');
        return;
      }
      const cod='ZmdsNjAwMjIwMDIxOTkxNzQ5MTE5Njk='
      if (data[0].serialKey === cod) {
        console.log('Dados serial  getSerial:', data);
        displayNone.style.display = 'none';

      } else {
        console.log('Dados recebidos não conferem.');
      }

    })
    .catch(error => {
      console.error('Erro ao buscar dados serial:', error);
    });
}

function getTermos(termosBox) {

  const getSerial = 'http://localhost:3000/getSerial';

  fetch(getSerial, {
    method: 'GET',
    headers: {
      'x-api-key': 'segredo123',
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data => {
      if (!data || (Array.isArray(data) && data.length === 0)) {
        serialCodificado = ''
        console.log('Produto sem serial inserido');
        return;
      }

      if (Number(data[0].ativado) === Number(1)) {
        console.log('Elemento termosBox:', termosBox);

        termosBox.style.display = 'none';
        usernameCod.readOnly = false;
        passwordCod.readOnly = false;
        usernameCod.focus();
        console.log('Dados serial  getSerial termos:', data);

      } else {
        console.log('Dados recebidos não conferem.');
      }

    })
    .catch(error => {
      console.error('Erro ao buscar dados serial:', error);
    });
}


async function updateTermos(ativarTermos) {
  const updateTermos = 'http://localhost:3000/updateTermo';

  try {
    const response = await fetch(updateTermos, {
      method: 'PATCH',
      headers: {
        'x-api-key': 'segredo123',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ativarTermos),
    });

    if (!response.ok) {
      alertMsg('Erro ao atualizar termos de uso', 'error', 3000);
    } else {
      console.log('termos de uso atualizado com sucesso!', 'success', 3000);
    }
  } catch (error) {
    console.error('Erro durante a atualizaçãotermos de uso:', error);
    alertMsg('Erro inesperado ao atualizar termos de uso.', 'error', 3000);
  }
}

async function postNewSerial(newSerial) {
  const postNewSerialUrl = 'http://localhost:3000/postNewSerial';

  try {
    const response = await fetch(postNewSerialUrl, {
      method: 'POST',
      headers: {
        'x-api-key': 'segredo123',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSerial),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao validar o serial.');
    }

    const data = await response.json();
    console.log('Serial adicionado com sucesso:', data);

    // Mostra sucesso
    alertMsg('Chave serial válida! Obrigado por adquirir a licença do Gerenciador de Estoque FGL.', 'success', 6000);

    // Oculta o container, se existir
    if (termosContainer) termosContainer.style.display = 'none';

    return true;

  } catch (error) {
    console.error('Erro ao adicionar o serial:', error);
    alertMsg('Chave serial inválida ou já utilizada.', 'info', 4000);
    return false;
  }
}
