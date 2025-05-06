const apiLicenca = {
    postAtivacao: 'http://localhost:3000/insertAtivacao',
    getAtivacaoMysql: 'http://localhost:3000/getAtivacaoMysql',
    updateAtivacao: 'http://localhost:3000/UpdateAtivacao',
};

async function verificaDadosSerial(userID, serialKey) {
    const getLicencaEndpoint = `http://localhost:3000/getLicenca/${userID}/${serialKey}`;
    const postAtivacaoDbEndpoint = apiLicenca.postAtivacao;

    try {
        const response = await fetch(getLicencaEndpoint, {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar licença do MongoDB. Status: ${response.status}`);
        }

        const mongoData = await response.json();
        // console.log('Dados obtidos do MongoDB:', mongoData);

        const formatDate = (date) => {
            const d = new Date(date);
            return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
        };

        const ativacaoData = {
            userID: mongoData.userID,
            serialKey: mongoData.serialKey,
            startedDate: formatDate(mongoData.startedDate),
            expirationDate: formatDate(mongoData.expirationDate),
            ativado: mongoData.ativado ? 1 : 0, // Converter booleano para inteiro
        };

        // console.log('Dados formatados para a ativação:', ativacaoData);

        const postResponse = await fetch(postAtivacaoDbEndpoint, {
            method: 'POST',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ativacaoData),
        });

        if (!postResponse.ok) {
            throw new Error(`Erro ao inserir ativação no MySQL. Status: ${postResponse.status}`);
        }

        const mysqlData = await postResponse.json();
        // console.log('Ativação registrada no MySQL com sucesso:', mysqlData);
        location.reload();

    } catch (error) {
        console.error('Erro ao sincronizar licença:', error);
    }
}

let ativado = false;
let divAtivar = null;
document.addEventListener('DOMContentLoaded', function () {
    divAtivar = document.querySelector('.ativar-produto');
    if (divAtivar) {
        divAtivar.style.display = 'none';
    }
    focus();
    fetchAtivacaoMysql();
});

async function fetchAtivacaoMysql() {
    const apiUrl = apiLicenca.getAtivacaoMysql;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123', // Substitua pela sua chave real
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        ativado = data.length > 0 && data[0]?.ativado === 1;

        atualizarDisplay();
    } catch (error) {
        console.error('Erro ao buscar dados:', error);

        ativado = false;
        atualizarDisplay();
    }
}

const atualizarDisplay = () => {

    const imgUser = document.querySelector('.img-user');
    const imgCadeado = document.querySelector('.img-cadeado');

    if (divAtivar) {
        if (ativado) {
            divAtivar.style.display = 'none';
            imgUser.style.display = 'flex';
            imgCadeado.style.display = 'flex';
        } else {
            divAtivar.style.display = 'flex'; // Exibe se não ativado
          imgUser.style.display = 'none';
          imgCadeado.style.display = 'none';
        }
    } else {
        console.log('');
    }
};

async function verificaAtivacaoMysql() {
    const apiUrl = apiLicenca.getAtivacaoMysql;
    try {
        // Faz a requisição à API para obter os dados do MySQL
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123', // Substitua pela sua chave real
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();

        // console.log('Dados do MySQL:', data);

        if (data.length > 0) {
            const { userID, serialKey } = data[0]; // Extrai os campos necessários
            const ativado = data[0]?.ativado === 1;
            // Monta a URL para buscar os dados no MongoDB
            const getLicencaEndpoint = `http://localhost:3000/getLicenca/${encodeURIComponent(userID)}/${encodeURIComponent(serialKey)}`;

            // Faz a requisição ao MongoDB
            const licencaResponse = await fetch(getLicencaEndpoint, {
                method: 'GET',
                headers: {
                    'x-api-key': 'segredo123',
                    'Content-Type': 'application/json',
                }
            });
            const licencaData = await licencaResponse.json();

            // console.log('Dados do MongoDB:', licencaData);

            // Verifica se há mudanças entre os dados do MySQL e MongoDB
            const hasChanges =
                (data[0].ativado !== (licencaData.ativado ? 1 : 0)) ||
                new Date(data[0].expirationDate).toISOString().slice(0, 10) !== new Date(licencaData.expirationDate).toISOString().slice(0, 10) ||
                new Date(data[0].startedDate).toISOString().slice(0, 10) !== new Date(licencaData.startedDate).toISOString().slice(0, 10);

            console.log('Mudanças detectadas:', hasChanges);
            if (hasChanges) {
                console.log('Mudanças detectadas, atualizando no MySQL...');

                // Atualiza os dados no MySQL com PATCH
                const updateResponse = await fetch('http://localhost:3000/UpdateAtivacao', {
                    method: 'PATCH',
                    headers: {
                        'x-api-key': 'segredo123',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ativado: licencaData.ativado,
                        expirationDate: licencaData.expirationDate,
                        serialKey: licencaData.serialKey,
                        startedDate: licencaData.startedDate,
                        userID: licencaData.userID,
                        mongoID: licencaData._id, // Adiciona o ID do MongoDB para referência
                    }),
                });
                const updateResult = await updateResponse.json();
                // console.log('Resultado da atualização no MySQL:', updateResult);
                location.reload();
            } else {
                console.log('Nenhuma mudança detectada, nenhuma atualização necessária.');
            }
        } else {
            console.warn('Nenhum dado encontrado no MySQL.');
            ativado = false;
        }
    } catch (error) {
        console.error('Erro ao processar a ativação:', error);
        ativado = false;
    } finally {
        atualizarDisplay(); // Atualiza o estado da interface
    }
}

async function verificaValidadeDate() {
    const apiUrl = apiLicenca.getAtivacaoMysql;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            }
        }
        );
        const data = await response.json();
        // console.log(data);

        if (data.length > 0) {
            const { startedDate, expirationDate } = data[0];

            // Converte as datas para objetos Date
            const startDate = new Date(startedDate);
            const endDate = new Date(expirationDate);
            const today = new Date(); // Data atual

            console.log(`Início: ${startDate}, Fim: ${endDate}, Hoje: ${today}`);

            const timeDifference = endDate.getTime() - today.getTime();
            const daysToExpire = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Calcula os dias restantes

            // Exibe mensagens apropriadas dependendo da validade da licença
            if (today >= startDate && today <= endDate) {
                if (daysToExpire <= 3) {
                    exibirMensagemVencimentoProximo(endDate, daysToExpire);
                } else {
                    exibirMensagemLicencaValida(endDate);
                }
            } else {
                exibirMensagemLicencaExpirada(endDate);
                bloqueiaCampos();
            }
        } else {
            console.warn('Nenhum dado encontrado na API.');
            exibirMensagemSemDados();
            bloqueiaCampos();
        }
    } catch (error) {
        console.error(
            'Erro ao verificar a validade da licença. Entre em contato para renovar.',
            error
        );
        exibirMensagemErro();
        bloqueiaCampos();
    }
}

function exibirMensagemVencimentoProximo(endDate, daysToExpire) {
    const formattedDate = endDate.toLocaleDateString();
    exibirMensagem(
        `A licença está prestes a expirar! Faltam ${daysToExpire} dias para o vencimento (${formattedDate}).`,
        'orange'
    );
}

function exibirMensagemLicencaValida(endDate) {
    const mensagemLicenca = document.querySelector('#mensagem-licenca');

    if (!mensagemLicenca) {
        console.error('Elemento de mensagem não encontrado!');
        return;
    }

    const dataValidade = new Date(endDate); // Ajuste de fuso horário se necessário
    const formattedDate = dataValidade.toLocaleDateString(); // Formatação da data

    exibirMensagem(`Licença válida até ${formattedDate}.`, 'green');
}


function exibirMensagemLicencaExpirada(endDate) {
    const mensagemLicenca = document.querySelector('#mensagem-licenca');

    if (!mensagemLicenca) {
        console.error('Elemento de mensagem não encontrado!');
        return;
    }

    const dataAtual = new Date();
    const dataValidade = new Date(endDate);

    // Verifica se a data de validade existe
    if (dataValidade instanceof Date && !isNaN(dataValidade)) {
        const formattedDate = dataValidade.toLocaleDateString();

        // Exibe a mensagem dependendo se a licença está expirada ou não
        if (dataValidade < dataAtual) {
            exibirMensagem(`A licença venceu em ${formattedDate}. Entre em contato para renovação.`, 'red');
            bloqueiaCampos();
        } else {
            exibirMensagem(`Licença válida até ${formattedDate}.`, 'green');
        }
    } else {
        // Caso não haja dados válidos de licença
        exibirMensagemSemDados();
    }

}

function exibirMensagemLicencaExpirada(endDate) {
    const mensagemLicenca = document.querySelector('#mensagem-licenca');

    if (!mensagemLicenca) {
        console.error('Elemento de mensagem não encontrado!');
        return;
    }

    const dataAtual = new Date();
    const dataValidade = new Date(endDate); // Este é o problema: ajusta para o fuso horário local

    // Formatação manual para garantir que a data não seja alterada
    const [year, month, day] = endDate.split('-');
    const formattedDate = `${day}/${month}/${year}`; // Formata para o formato 'DD/MM/YYYY'

    // Exibe a mensagem dependendo se a licença está expirada ou não
    if (dataValidade < dataAtual) {
        exibirMensagem(`A licença venceu em ${formattedDate}. Entre em contato para renovação.`, 'red');
        bloqueiaCampos();
    } else {
        exibirMensagem(`Licença válida até ${formattedDate}.`, 'green');
    }
}

function exibirMensagemSemDados() {
    exibirMensagem('Nenhum dado de licença encontrado. Entre em contato para suporte.', 'red');
}

function exibirMensagemErro() {
    exibirMensagem('Erro ao verificar a validade da licença. Entre em contato para suporte.', 'red');
}

function exibirMensagem(texto, cor) {
    const messageContainer = document.getElementById('mensagem-licenca');
    if (!messageContainer) {
        console.error('Elemento para exibir mensagens não encontrado.');
        return;
    }

    messageContainer.textContent = texto;
    messageContainer.style.color = cor;
    messageContainer.style.marginTop = '10px';
}

function bloqueiaCampos() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (usernameInput) usernameInput.disabled = true;
    if (passwordInput) passwordInput.disabled = true;
}






