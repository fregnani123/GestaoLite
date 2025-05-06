const btnEnviarMsg = document.getElementById("btnEnviarMsg");
const userID = document.getElementById('userID'); // campo hidden
const inputChat = document.getElementById('inputChat'); // campo de mensagem
const btnSuporte = document.querySelector('.menu-item-13');
const btnfecharSuporte = document.querySelector('.btn-fechar-chat');
const divSuporte = document.querySelector('.chat-suporte');
const chatMessagesDiv = document.querySelector('.chat-messages');


async function verificaUserID() {
    const apiUrl = 'http://localhost:3000/getAtivacaoMysql';
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        userID.value = data[0].userID

        // console.log('Dados do MySQL:', data);

        if (data.length > 0) {
            const { userID, serialKey } = data[0];
            // Você pode fazer algo com userID e serialKey aqui
            console.log('Usuário:', userID, 'Serial:', serialKey);
        } else {
            console.log('Nenhum dado encontrado.');
        }
    } catch (error) {
        console.error('Erro ao verificar ativação do MySQL:', error);
    }
}
verificaUserID()

// Abrir chat
btnSuporte.addEventListener('click', (e) => {
    e.preventDefault();

    if (divSuporte.style.display === 'none' || divSuporte.style.display === '') {
        divSuporte.style.display = 'flex';
    }

    inputChat.focus();

    setTimeout(() => {
        mensagensData(userID.value);
    }, 100);
});

// Enviar mensagem
btnEnviarMsg.addEventListener('click', async (e) => {
    e.preventDefault();

    const remetente = userID.value.trim();
    const mensagem = inputChat.value.trim();

    if (!remetente || !mensagem) return;

    const msgEnviar = { remetente, mensagem };

    await enviarMsSuporte(msgEnviar);

    inputChat.value = '';

    setTimeout(() => {
        mensagensData(userID.value);
    }, 200);
});

inputChat.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();

        const remetente = userID.value.trim();
        const mensagem = inputChat.value.trim();

        if (!remetente || !mensagem) return;

        const msgEnviar = { remetente, mensagem };

        await enviarMsSuporte(msgEnviar);

        inputChat.value = '';

        setTimeout(() => {
            mensagensData(userID.value);
        }, 200);
    }
});


// Fechar chat
btnfecharSuporte.addEventListener('click', (e) => {
    e.preventDefault();
    divSuporte.style.display = 'none';
});

// Função para enviar mensagem
async function enviarMsSuporte(mensagem) {
    const urlEnviarMsg = 'http://localhost:3000/postmensagem';

    try {
        const response = await fetch(urlEnviarMsg, {
            method: 'POST',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mensagem)
        });

        if (!response.ok) {
            throw new Error(`Erro ao enviar mensagem: ${response.status}`);
        }
    } catch (error) {
        console.error('Erro ao enviar mensagem para o suporte:', error);
    }
}

// Buscar e exibir mensagens
async function mensagensData(remetente) {
    chatMessagesDiv.classList.add('oculto'); // Isso adiciona a opacidade 0 durante a atualização

    const urlMsgUsuario = `http://localhost:3000/getLicenca/${remetente}`;
    const urlMsgSuporte = `http://localhost:3000/getSuporte/${remetente}`;

    try {
        const [resUsuario, resSuporte] = await Promise.all([
            fetch(urlMsgUsuario, {
                method: 'GET',
                headers: {
                    'x-api-key': 'segredo123',
                    'Content-Type': 'application/json'
                }
            }),
            fetch(urlMsgSuporte, {
                method: 'GET',
                headers: {
                    'x-api-key': 'segredo123',
                    'Content-Type': 'application/json'
                }
            })
        ]);

        const mensagensUsuario = resUsuario.ok ? await resUsuario.json() : [];
        const mensagensSuporte = resSuporte.ok ? await resSuporte.json() : [];

        console.log(mensagensSuporte);

        // Junta todas as mensagens (cliente e suporte) e ordena pela data de envio
        const todasMensagens = [...mensagensUsuario, ...mensagensSuporte].sort((a, b) => {
            return new Date(a.data_envio) - new Date(b.data_envio);
        });

        chatMessagesDiv.innerHTML = '';  // Limpa as mensagens atuais

        // Verifica se a última mensagem do suporte tem { finalizado: true }
        const ultimaMsgSuporte = mensagensSuporte[mensagensSuporte.length - 1];
        const chatFoiFinalizado = ultimaMsgSuporte?.finalizado === true;

        // Verifica se o cliente enviou mensagem após o final do suporte
        const clienteEnviouDepoisFinalizado = mensagensUsuario.some((msg) => new Date(msg.data_envio) > new Date(ultimaMsgSuporte?.data_envio));

        // Passa as flags para a função de exibição
        exibirMensagens(todasMensagens, chatFoiFinalizado && clienteEnviouDepoisFinalizado);

        chatMessagesDiv.classList.remove('oculto');  // Remover a opacidade para exibir as mensagens

        // Manter o scroll no final após a atualização, sem resetar
        chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;

    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
    }
}

// Função para exibir mensagens no chat sem piscar
function exibirMensagens(mensagens, exibirMensagemAposFinalizado = false) {
    chatMessagesDiv.innerHTML = ''; // Limpa tudo

    mensagens.forEach((mensagemObj) => {
        const mensagemDiv = document.createElement('div');
        const ehSuporte = mensagemObj.remetente.toLowerCase() === 'suporte';

        mensagemDiv.classList.add(ehSuporte ? 'mensagem-suporte' : 'mensagem-usuario');

        if (ehSuporte) {
            const remetente = document.createElement('div');
            remetente.classList.add('remetente');
            remetente.textContent = mensagemObj.remetente;
            mensagemDiv.appendChild(remetente);
        }

        const texto = document.createElement('div');
        texto.classList.add('texto-mensagem');
        texto.textContent = mensagemObj.mensagem;

        const data = document.createElement('div');
        data.classList.add('data-msg');
        data.textContent = new Date(mensagemObj.data_envio).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        });

        mensagemDiv.appendChild(texto);
        mensagemDiv.appendChild(data);
        chatMessagesDiv.appendChild(mensagemDiv);
    });

    if (mensagens.length === 0) {
        const msgFinal = document.createElement('div');
        msgFinal.classList.add('mensagem-suporte', 'mensagem-inicial', 'mensagem-automatica');
    
        const remetente = document.createElement('div');
        remetente.classList.add('remetente');
        remetente.textContent = 'Mensagem automática';
        msgFinal.appendChild(remetente);
    
        const texto = document.createElement('div');
        texto.classList.add('texto-mensagem');
        texto.textContent = 'Olá, precisando de suporte?';
        msgFinal.appendChild(texto);
    
        const data = document.createElement('div');
        data.classList.add('data-msg');
        data.textContent = new Date().toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
    
        msgFinal.appendChild(data);
        chatMessagesDiv.appendChild(msgFinal);
    }
    
    const existeMensagemDoSuporte = mensagens.some(msg => msg.remetente.toLowerCase() === 'suporte');

    if (!existeMensagemDoSuporte && mensagens.length > 0) {
        const msgFinal = document.createElement('div');
        msgFinal.classList.add('mensagem-suporte', 'mensagem-inicial', 'mensagem-automatica');
    
        const remetente = document.createElement('div');
        remetente.classList.add('remetente');
        remetente.textContent = 'Mensagem automática';
        msgFinal.appendChild(remetente);
    
        const texto = document.createElement('div');
        texto.classList.add('texto-mensagem');
        texto.textContent = 'Aguarde o retorno do suporte...';
        msgFinal.appendChild(texto);
    
        const data = document.createElement('div');
        data.classList.add('data-msg');
        data.textContent = new Date().toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
    
        msgFinal.appendChild(data);
        chatMessagesDiv.appendChild(msgFinal);
    }
    

    const mensagensOrdenadas = mensagens.slice().sort((a, b) => new Date(a.data_envio) - new Date(b.data_envio));
    const ultimaMensagem = mensagensOrdenadas[mensagensOrdenadas.length - 1];
    
    if (ultimaMensagem && ultimaMensagem.finalizado === true) {
        console.log('Mensagem está finalizada, exibindo aviso...');
    
        const msgFinal = document.createElement('div');
        msgFinal.classList.add('mensagem-suporte', 'mensagem-inicial');
        msgFinal.style.backgroundColor = '#dfffe0'; // verde claro
    
        const remetente = document.createElement('div');
        remetente.classList.add('remetente');
        remetente.textContent = 'Mensagem automática';
        msgFinal.appendChild(remetente);
    
        const texto = document.createElement('div');
        texto.classList.add('texto-mensagem');
        texto.textContent = 'Olá, precisando de suporte?';
        msgFinal.appendChild(texto);
    
        const data = document.createElement('div');
        data.classList.add('data-msg');
        data.textContent = new Date().toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
    
        msgFinal.appendChild(data);
        chatMessagesDiv.appendChild(msgFinal);
    } else {
        console.log('Última mensagem não está finalizada ou não existe');
    }
    
        
    // 👇 Mensagem "Aguarde o retorno do suporte..." se o cliente enviar uma mensagem após a finalização
    if (exibirMensagemAposFinalizado) {
        const msgFinal = document.createElement('div');
        msgFinal.classList.add('mensagem-suporte', 'mensagem-inicial');

        const remetente = document.createElement('div');
        remetente.classList.add('remetente');
        remetente.textContent = 'Suporte';
        msgFinal.appendChild(remetente);

        const texto = document.createElement('div');
        texto.classList.add('texto-mensagem');
        texto.textContent = 'Aguarde o retorno do suporte...'; // Troca a mensagem aqui
        msgFinal.appendChild(texto);

        const data = document.createElement('div');
        data.classList.add('data-msg');
        data.textContent = new Date().toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        });

        msgFinal.appendChild(data);
        chatMessagesDiv.appendChild(msgFinal);
    }
}

// Carregar mensagens ao iniciar
mensagensData(userID.value);

// Atualização automática para quando suporte envia nova mensagem
setInterval(() => {
    mensagensData(userID.value);
}, 5000);  // Atualiza as mensagens a cada 5 segundos
