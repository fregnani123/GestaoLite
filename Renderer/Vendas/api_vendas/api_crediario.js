const cpfCliente = document.getElementById('Crediario-cliente');
const informacaoCred = document.querySelector('.msg-cpf');
const parcela = document.getElementById('Crediario-parcela');
const parcelaValor = document.getElementById('Crediario-valor');
const nomeClienteShow = document.getElementById('nomeCliente');
const inputTaxaJuros = document.getElementById('taxa-juros'); // Pegando a taxa de juros
const vencimentosCrediario = document.getElementById('vencimentos');
let jurosParcelaAcima = ''

async function getTaxas() {
    try {
        const response = await fetch('http://localhost:3000/getTaxas', {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        inputTaxaJuros.value = data[0].juros_crediario_venda;
        jurosParcelaAcima = Number(data[0].juros_parcela_acima);
        inputMaxParcelas.value = jurosParcelaAcima;
        spanMaxParcelas.innerText = inputMaxParcelas.value;

        console.log('Taxas Crediário: ', data)

    } catch (error) {
        console.error('Erro ao buscar Taxas Crediario:', error);
        return [];
    }
};

getTaxas()

async function findCliente(cpf, nomeElemento) {
    const findOneClient = `http://localhost:3000/getCliente/${cpf}`;

    try {
        const response = await fetch(findOneClient, {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json'
            }
        });

        // if (!response.ok) {
        //     informacaoCred.innerHTML = '<strong>Cliente não encontrado.<strong> Verifique se o cadastro foi realizado anteriormente.'
        //     // informacaoCred.style.backgroundColor = 'rgb(255, 6, 6)';
        //     // informacaoCred.style.color = 'white'

        //     setTimeout(() => {
        //         cpfCliente.value = ''; // Limpa o campo CPF
        //         informacaoCred.innerHTML = 'Informe o CPF do cliente já cadastrado no sistema.';
        //         // informacaoCred.style.backgroundColor = 'rgb(5, 90, 0)';
        //         // informacaoCred.style.color = 'white'
        //     }, 6000);

        //     return;
        // }

        const data = await response.json();
        console.log("Dados recebidos:", data); // Verifica a estrutura da resposta no console

        // Garante que data é um array e tem pelo menos um item antes de acessar [0]
        if (Array.isArray(data) && data.length > 0 && data[0].nome) {

            // Verifica se o CPF é "000.000.000-00" ou se o ID do cliente é 1
            if (data[0].cpf === "000.000.000-00" || data[0].cliente_id === 1) {
                alertMsg("Consumidor final não pode utilizar crédito.", "error", 3000);
                cpfCliente.value = ''
                return; // Sai da função sem atribuir valores
            }

            nomeElemento.value = data[0].nome;
            clienteId.value = data[0].cliente_id;

            creditoLimite.value = parseFloat(data[0].credito_limite).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });


            creditoUtilizado.value = parseFloat(data[0].credito_utilizado).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            parcela.focus();
            // informacaoCred.innerHTML = 'Informe o numero de Parcelas e precione Enter para finalizar a venda';
            // informacaoCred.style.backgroundColor = 'rgb(5, 90, 0)';
            // informacaoCred.style.color = 'white'
        } else {
            nomeElemento.value = "Cliente encontrado, mas sem nome disponível";
        }

    } catch (error) {
        console.log("Erro ao buscar cliente:", error);
        alertMsg("Erro ao buscar cliente. Tente novamente.", "error", 3000);
        cpfCliente.focus();
    }
}
formatarEVerificarCPF(cpfCliente);
inputMaxCaracteres(cpfCliente, 14);


cpfCliente.addEventListener('input', (e) => {
    const cpf = e.target.value.trim(); // Remove espaços em branco extras
    const cpfFormatado = formatarCPF(cpf)
    // informacaoCred.innerHTML = 'Buscando Cliente associado ao CPF'
    if (cpf.length === 14) {
        findCliente(cpfFormatado, nomeClienteShow);
    }
    if (cpf.length === '') {
        console.log('Informe o CPF do cliente já cadastrado no sistema.')
        // informacaoCred.innerHTML = 'Informe o CPF do cliente já cadastrado no sistema.';
    }
});

// Evento para limpar os inputs ao pressionar ESC
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        cpfCliente.value = "";
        creditoLimite.value = ""
        creditoUtilizado.value = ""
        nomeClienteShow.value = "";
        parcela.value = "";
        parcelaValor.value = "";
        informacaoCred.innerHTML = "Forma de pagamento.";
        informacaoCred.style.backgroundColor = "";
        informacaoCred.style.color = "";
        cpfCliente.focus();
    }
});

function parseCurrency(value) {
    return Number(value.replace(/[^0-9,.-]+/g, "").replace(",", ".")); // Ajustando para ponto no número
}

function parseCurrency(value) {
    if (!value) return 0;
    // Remove pontos e substitui a vírgula pelo ponto para converter corretamente
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
}

let totalComJuros; // Declara a variável globalmente
let totalLiquidoOriginal = parseCurrency(inputTotalLiquido.value); // Armazena o valor original antes da alteração

parcela.addEventListener('input', (e) => {
    const numeroParcelas = Number(e.target.value.trim());
    const totalLiquido = parseCurrency(inputTotalLiquido.value);
    let taxaJuros = parseFloat(inputTaxaJuros.value.replace(",", ".")) || 0.000001; // Garante que seja um número válido

    if (numeroParcelas > jurosParcelaAcima) {
        taxaJuros = parseFloat(inputTaxaJuros.value.replace(",", ".")) / 100;
    } else {
        taxaJuros = 0; // Sem juros se for menor ou igual à quantidade configurada
    }

    if (!isNaN(numeroParcelas) && numeroParcelas > 0 && !isNaN(totalLiquido) && !isNaN(taxaJuros)) {
        // Salva o valor antes de calcular os juros
        totalLiquidoOriginal = totalLiquido;

        // Aplica a fórmula correta para o cálculo de juros compostos
        if (taxaJuros > 0) {
            const fatorJuros = Math.pow(1 + taxaJuros, numeroParcelas);
            parcelaValor.value = ((totalLiquido * (fatorJuros * taxaJuros)) / (fatorJuros - 1)).toFixed(2);
        } else {
            parcelaValor.value = (totalLiquido / numeroParcelas).toFixed(2); // Caso não tenha juros
        }

        totalComJuros = parseFloat(parcelaValor.value) * numeroParcelas;
        Crediario.value = converteMoeda(totalComJuros);
    } else {
        parcelaValor.value = "";
        totalComJuros = null;
        Crediario.value = "";
    }
});

async function validarCrediarioLoja(dataCrediario) {

    try {
        const response = await fetch(`http://localhost:3000/postNewCrediario`, {
            method: 'POST',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataCrediario), // Apenas serialize aqui
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error); // Lança a mensagem detalhada do backend
        }

    } catch (error) {
        console.log("Erro ao buscar cliente. Tente novamente.", "error", error);
        cpfCliente.focus();
    }
}

async function updateCrediario(dadosClienteId) {
    const updateCliente = 'http://localhost:3000/updateCredito';

    try {
        const patchResponse = await fetch(updateCliente, {
            method: 'PATCH',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosClienteId), // Usando o nome correto da variável
        });

        if (!patchResponse.ok) {
            alertMsg('Erro ao atualizar Crédito', 'info', 3000);
        }
        else {
            // alertMsg('Crédito atualizado com sucesso', 'success');
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
    } catch (error) {
        console.log('Erro durante a atualização do crédito:', error);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const inputBusca = document.getElementById("buscaCliente");

    if (!inputBusca) {
        console.error("Erro: Elemento 'buscaCliente' não encontrado no DOM.");
        return;
    }

    inputBusca.addEventListener("input", async function () {
        const nome = inputBusca.value;

        if (nome.length < 2) return;

        try {
            console.log("Buscando cliente:", nome);

            const response = await fetch(`http://localhost:3000/getClienteNome/${nome}`, {
                method: 'GET',
                headers: {
                    'x-api-key': 'segredo123',
                    'Content-Type': 'application/json',
                }
            });

            console.log("Resposta da API:", response.status);

            const data = await response.json();
            console.log("Dados recebidos:", data);

            const lista = document.getElementById("listaClientes");
            lista.innerHTML = "";

            if (data.message) {
                lista.innerHTML = `<li>${data.message}</li>`;
                return;
            }

            // Função para remover máscara do CPF
            function removerMascaraCPF(cpf) {
                return cpf.replace(/\D/g, '');
            }

            data.forEach(cliente => {
                const li = document.createElement('li');
                li.style.textAlign = 'right';
                li.style.padding = '4px 8px';
                li.style.background = '#f9f9f9';
                li.style.borderRadius = '4px';

                const cpfFormatado = decode(cliente.cpf);

                li.innerHTML = `
        <div style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
            <span>${cpfFormatado} - ${cliente.nome}</span>
            <button 
                style="margin-left: 8px; padding: 2px 6px; font-size: 12px;width:100px; background-color: #1f3b57; color: white; border: none; border-radius: 4px; cursor: pointer;" 
                data-cpf="${cpfFormatado}">
                Selecionar
            </button>
        </div>
    `;

                lista.appendChild(li);
            });

            // Evento nos botões de seleção
            lista.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', () => {
                    const cpfFormatado = btn.getAttribute('data-cpf'); // Obtém CPF com a máscara

                    const cpfCliente = document.getElementById("Crediario-cliente");
                    if (cpfCliente) {
                        cpfCliente.value = cpfFormatado; // Coloca o CPF com máscara diretamente no input
                        cpfCliente.dispatchEvent(new Event('input')); // Dispara evento para chamar findCliente()
                        cpfCliente.focus();
                    }

                    const divNomes = document.querySelector('.divNomes');
                    if (divNomes) divNomes.style.display = 'none';
                });
            });


        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    });
});


// Botão que abre/fecha a busca
const btnBuscarNome = document.getElementById('btnBuscarNome');
const divNomes = document.querySelector('.divNomes');
const inputBusca = document.getElementById("buscaCliente");

btnBuscarNome.addEventListener('click', (e) => {
    e.preventDefault();
    if (divNomes.style.display === 'none' || divNomes.style.display === '') {
        divNomes.style.display = 'flex';
        inputBusca.focus();
    } else {
        divNomes.style.display = 'none';
        cpfCliente.focus(); // Certifique-se que 'cpfCliente' existe
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const btnExitNome = document.getElementById('btn-exit-nome');
    const divNomes = document.querySelector('.divNomes');
    const inputBusca = document.getElementById('buscaCliente');
    const listaClientes = document.getElementById('listaClientes');

    btnExitNome.addEventListener('click', () => {
        // Oculta a div
        divNomes.style.display = 'none';

        // Limpa o campo de busca
        inputBusca.value = '';

        // Limpa a lista
        listaClientes.innerHTML = '';

        cpfCliente.focus();
    });
       
});
