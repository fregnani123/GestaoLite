const cpfCliente = document.getElementById('Crediario-cliente');
const informacaoCred = document.querySelector('.msg-cpf');
const parcela = document.getElementById('Crediario-parcela');
const parcelaValor = document.getElementById('Crediario-valor');
const nomeClienteShow = document.getElementById('nomeCliente');
const inputTaxaJuros = document.getElementById('taxa-juros'); // Pegando a taxa de juros
const condicaoSelect = document.getElementById("condicao-vencimento");
const tipoPagamentoSelect = document.getElementById("tipo-pagamento");
const parcelaSelect = document.getElementById("Crediario-parcela");
const vencimentosCrediario = document.getElementById("vencimentos");
let jurosParcelaAcima = ''

document.addEventListener("DOMContentLoaded", function () {


    function formatDateToYMD(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

 function calcularDataVencimento() {
    const condicao = condicaoSelect.value;
    if (!condicao) return;

    const diasMap = {
        "30": 30,
        "15": 15,
        "7": 7,
        "entrada+30": 30,
        "entrada+15": 15,
        "entrada+7": 7,
    };

    const hoje = new Date();

    // Se for com entrada, a data deve ser HOJE
    if (condicao.startsWith("entrada+")) {
        vencimentosCrediario.value = formatDateToYMD(hoje);
        return;
    }

    // Se não tem entrada, soma os dias
    const dias = diasMap[condicao] || 30;
    hoje.setDate(hoje.getDate() + dias);

    vencimentosCrediario.value = formatDateToYMD(hoje);
}


    function atualizarCamposEntrada() {
        const condicao = condicaoSelect.value;
        const temEntrada = condicao.startsWith("entrada+");

        tipoPagamentoSelect.disabled = !temEntrada;

        if (temEntrada) {
            tipoPagamentoSelect.disabled = false;

            // Se a opção ainda for "Sem Entrada", forçar seleção para "Dinheiro"
            if (tipoPagamentoSelect.value === "Sem Entrada" || tipoPagamentoSelect.value === "") {
                tipoPagamentoSelect.value = "Dinheiro"; // ou qualquer padrão desejado
            }

            entradaCrediario.disabled = false;
            entradaCrediario.readOnly = false;

            if (!entradaCrediario.value || entradaCrediario.value === "0" || entradaCrediario.value === "0.00") {
                entradaCrediario.value = "0,00";
            }

        } else {
            tipoPagamentoSelect.value = "Sem Entrada"; // Zera o select se não tiver entrada
            tipoPagamentoSelect.entradaCrediario
            entradaCrediario.disabled = true;
            entradaCrediario.readOnly = true;
            entradaCrediario.value = "0,00";
        }

        if (!condicao) {
            parcelaSelect.disabled = true;
            parcelaSelect.innerHTML = "";
            const optionDefault = document.createElement("option");
            optionDefault.value = "";
            optionDefault.textContent = "Selecione a condição de pagamento";
            parcelaSelect.appendChild(optionDefault);
            return;
        }

        parcelaSelect.disabled = false;
        atualizarOpcoesParcelas(temEntrada);
        calcularDataVencimento();
    }

function atualizarOpcoesParcelas(temEntrada) {
  parcelaSelect.innerHTML = "";

  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Selecione";
  parcelaSelect.appendChild(optionDefault);

  const maxParcelas = 24;

  for (let i = 1; i <= maxParcelas; i++) {
    const option = document.createElement("option");
    const totalParcelas = temEntrada ? (i + 1) : i; // entrada conta como 1

    option.value = String(totalParcelas); // garante número ao dar parse depois
    option.textContent = temEntrada
      ? `${totalParcelas}x (Entrada + ${i} parcela${i > 1 ? 's' : ''})`
      : `${totalParcelas}x`;

    parcelaSelect.appendChild(option);
  }
}

    // Impede datas anteriores a hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    vencimentosCrediario.min = formatDateToYMD(hoje);

    vencimentosCrediario.addEventListener("change", () => {
        const dataSelecionada = new Date(vencimentosCrediario.value);
        dataSelecionada.setHours(0, 0, 0, 0);

        if (dataSelecionada < hoje) {
            alert("A data de vencimento não pode ser anterior à data atual.");
            vencimentosCrediario.value = formatDateToYMD(hoje);
        }
    });

    condicaoSelect.addEventListener("change", atualizarCamposEntrada);
    atualizarCamposEntrada(); // Executa ao iniciar
});

const taxaDeJurosElemento = document.querySelector('.taxa');
const taxaDeJurosParcela = document.querySelector('.taxa-parcela');
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
        taxaDeJurosElemento.innerText = `${data[0].juros_crediario_venda}%`;
        taxaDeJurosParcela.innerText = Number(data[0].juros_parcela_acima) < 10
            ? '0' + Number(data[0].juros_parcela_acima)
            : Number(data[0].juros_parcela_acima);

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

            // parcela.focus();

        } else {
            nomeElemento.value = "Não encontrado. Verifique se o cliente está previamente cadastrado.";

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


function parseCurrency(value) {
  if (value == null) return 0;
  // remove símbolos e milhares, troca vírgula por ponto
  const limpo = String(value).replace(/[^0-9,.-]/g, '').replace(/\./g, '').replace(',', '.');
  const n = parseFloat(limpo);
  return isNaN(n) ? 0 : n;
}


let totalComJuros; // Declara a variável globalmente
let totalLiquidoOriginal = parseCurrency(inputTotalLiquido.value); // Armazena o valor original antes da alteração

function atualizarParcelas() {
  const numeroParcelas = Number(parcela.value); // total incluindo a entrada quando houver
  if (!numeroParcelas || numeroParcelas < 1) {
    parcelaValor.value = "";
    Crediario.value = "";
    return;
  }

  const totalLiquido = parseCurrency(inputTotalLiquido.value); // total da venda
  if (!totalLiquido || isNaN(totalLiquido)) {
    console.warn("totalLiquido inválido:", inputTotalLiquido?.value);
    parcelaValor.value = "";
    Crediario.value = "";
    return;
  }

  const temEntrada = (condicaoSelect.value || "").startsWith("entrada+");

  // taxa de juros mensal
  let taxa = parseFloat(String(inputTaxaJuros.value).replace(",", "."));
  taxa = isNaN(taxa) ? 0 : taxa;

  // aplica juros só se exceder o limite configurado
  if (numeroParcelas > Number(jurosParcelaAcima || 0)) {
    taxa = taxa / 100; // vira fração
  } else {
    taxa = 0;
  }

  let valorParcela = 0;

  if (taxa > 0) {
    // PMT: parcelas fixas e iguais
    const fator = Math.pow(1 + taxa, numeroParcelas);
    valorParcela = (totalLiquido * (fator * taxa)) / (fator - 1);
  } else {
    valorParcela = totalLiquido / numeroParcelas;
  }

  // arredonda para 2 casas
  let parcelaFixada = Number(valorParcela.toFixed(2));

  // 🔹 ajuste para não perder 1 centavo
  let totalArredondado = parcelaFixada * numeroParcelas;
  let diferenca = Number((totalLiquido - totalArredondado).toFixed(2));

  // Se houver diferença (tipo 0.01 ou -0.01), ajusta na última parcela
  if (Math.abs(diferenca) >= 0.01) {
    parcelaFixada = ((totalLiquido - (parcelaFixada * (numeroParcelas - 1))) ).toFixed(2);
  }

  // exibe a parcela padrão (sem diferenciar entrada/última)
  parcelaValor.value = (totalLiquido / numeroParcelas).toFixed(2);

  // total com juros (se houver)
  const totalComJurosCalc = totalLiquido.toFixed(2);
  Crediario.value = converteMoeda(totalComJurosCalc);

  // entrada = mesma lógica
  if (temEntrada) {
    entradaCrediario.value = (totalLiquido / numeroParcelas).toFixed(2);
    entradaCrediario.readOnly = true;
  } else {
    entradaCrediario.value = "0,00";
    entradaCrediario.readOnly = true;
  }
}

parcela.addEventListener('change', atualizarParcelas);


async function validarCrediarioLoja(dataCrediario) {

    try {
        const response = await fetch(`http://localhost:3000/postNewCrediario`, {
            method: 'POST',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataCrediario),
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
    function configurarBuscaCliente(idInput, idLista, idInputCPF, classeDivNomes) {
        const input = document.getElementById(idInput);
        const lista = document.getElementById(idLista);
        const inputCPF = document.getElementById(idInputCPF);
        const divNomes = document.querySelector(classeDivNomes);

        if (!input || !lista) {
            console.error(`Erro: Elementos com id '${idInput}' ou '${idLista}' não encontrados.`);
            return;
        }

        input.addEventListener("input", async function () {
            const nome = input.value.trim();
            if (nome.length < 2) return;

            try {
                const response = await fetch(`http://localhost:3000/getClienteNome/${nome}`, {
                    method: 'GET',
                    headers: {
                        'x-api-key': 'segredo123',
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();
                lista.innerHTML = "";

                if (data.message) {
                    lista.innerHTML = `<li>${data.message}</li>`;
                    return;
                }

                data.forEach(cliente => {
                    const li = document.createElement('li');
                    li.style.textAlign = 'right';
                    li.style.padding = '4px 8px';
                    li.style.background = '#f9f9f9';
                    li.style.borderRadius = '4px';

                    const cpfFormatado = decode(cliente.cpf); // Se não tiver, substitua por função sua

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

                lista.querySelectorAll('button').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const cpfSelecionado = btn.getAttribute('data-cpf');
                        if (inputCPF) {
                            inputCPF.value = cpfSelecionado;
                            inputCPF.dispatchEvent(new Event('input'));
                            inputCPF.focus();
                        }
                        if (divNomes) divNomes.style.display = 'none';
                    });
                });

            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
            }
        });
    }

    // 🔁 Use quantas vezes quiser:
    configurarBuscaCliente("buscaCliente", "listaClientes", "Crediario-cliente", ".divNomes");
    configurarBuscaCliente("buscaCliente-2", "listaClientes-2", "alterClienteCPF", ".divNomes-2"); // se houver outra
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
// Botão que abre/fecha a busca
const btnBuscarNomeAlter = document.getElementById('btn-nome-alterar');
const divNomes2 = document.querySelector('.divNomes-2');
const inputBusca2 = document.getElementById("buscaCliente-2");

btnBuscarNomeAlter.addEventListener('click', (e) => {
    e.preventDefault();
    if (divNomes2.style.display === 'none' || divNomes.style.display === '') {
        divNomes2.style.display = 'flex';
        inputBusca2.focus();
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

document.addEventListener('DOMContentLoaded', () => {
    const btnExitNome = document.getElementById('btn-exit-nome-2');
    const divNomes = document.querySelector('.divNomes-2');
    const inputBusca = document.getElementById('buscaCliente-2');
    const listaClientes = document.getElementById('listaClientes-2');

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
