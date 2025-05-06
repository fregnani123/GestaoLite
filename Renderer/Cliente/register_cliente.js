// Capturando os elementos do formulário
const nome = document.getElementById('nome');
const cpf = document.getElementById('cpf');
const dataNascimento = document.getElementById('dataNascimento');
const telefone = document.getElementById('telefone');
const email = document.getElementById('email');
const cep = document.getElementById('cep');
const logradouro = document.getElementById('logradouro');
const numero = document.getElementById('numero');
const bairro = document.getElementById('bairro');
const uf = document.getElementById('uf');
const cidade = document.getElementById('cidade');
const observacoes = document.getElementById('observacoes');
const ocupacao = document.getElementById('ocupacao');
const salvarCliente = document.getElementById('salvar-cliente');
const creditoLimite = document.getElementById('creditoLiberar');
const linkID_7 = document.querySelector('.list-a7');


function estilizarLinkAtivo(linkID) {
    linkID.style.background = '#ffcc00'; // Cor de fundo
    linkID.style.textShadow = 'none'; // Sem sombra de texto
    linkID.style.color = 'black'; // Cor do texto
    linkID.style.borderBottom = '2px solid black'; // Borda inferior
  }
  estilizarLinkAtivo(linkID_7)

document.addEventListener('DOMContentLoaded',()=>{
    cpf.focus();
})


creditoLimite.addEventListener('input', () => {
    let valor = creditoLimite.value.replace(/\D/g, ""); // Remove tudo que não for número
    let numero = Number(valor) / 100; // Converte para decimal

    creditoLimite.value = numero.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
});

document.addEventListener('DOMContentLoaded', () => {
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

}); 

function parseCurrency(value) {
    if (!value) return 0;
    
    // Remove caracteres não numéricos (exceto vírgula e ponto)
    value = value.replace(/[^\d,-]/g, '');

    // Substitui vírgula por ponto, para tratar como decimal
    value = value.replace(',', '.');

    // Converte para número
    return parseFloat(value) || 0;
}

async function sendNewCliente() {
    let camposFaltando = [];

    // Objeto com os valores do formulário
    const newCliente = {
        nome: nome.value.trim(),
        cpf: cpf.value.trim(),
        data_nascimento: dataNascimento.value,  // Passar a data formatada como string
        telefone: telefone.value.trim(),
        email: email.value.trim(),
        cep: cep.value.trim(),
        logradouro: logradouro.value.trim(),
        numero: numero.value.trim() || null,
        bairro: bairro.value.trim(),
        estado: uf.value.trim().toUpperCase() !== "SELECIONE" ? uf.value.toUpperCase() : null,
        cidade: cidade.value.trim(),
        observacoes: observacoes.value.trim() || null,
        credito_limite: parseCurrency(creditoLimite.value),
        ocupacao: ocupacao.value.trim()
    };

    // Validações dos campos obrigatórios
    if (!newCliente.nome) camposFaltando.push("Nome");
    if (!newCliente.cpf) camposFaltando.push("CPF");
    if (!newCliente.data_nascimento) camposFaltando.push("Data de Nascimento");
    if (!newCliente.telefone) camposFaltando.push("Telefone");
    if (!newCliente.cep) camposFaltando.push("CEP");
    if (!newCliente.logradouro) camposFaltando.push("Logradouro");
    if (!newCliente.bairro) camposFaltando.push("Bairro");
    if (!newCliente.estado) camposFaltando.push("UF");
    if (!newCliente.cidade || newCliente.cidade.toLowerCase() === "selecione") camposFaltando.push("Cidade");
    if (!newCliente.ocupacao) camposFaltando.push("Ocupação");;

    // Se algum campo obrigatório estiver faltando
    if (camposFaltando.length > 0) {
        alertMsg(
            `Todos os campos obrigatórios devem ser preenchidos. Faltando: ${camposFaltando.join(", ")}`,
            "info",
            5000
        );
        return;
    }

    // Chamada para inserir os dados no banco
   postNewCliente(newCliente);
}

// Função para limpar os campos do formulário
function limparFormulario() {
    nome.value = '';
    cpf.value = '';
    dataNascimento.value = '';
    telefone.value = '';
    email.value = '';
    cep.value = '';
    logradouro.value = '';
    numero.value = '';
    bairro.value = '';
    uf.value = '';
    cidade.value = '';
    observacoes.value = '';
    creditoLimite.value = '';
    ocupacao.value = '';
}

// Adicionando evento ao botão de salvar
salvarCliente.addEventListener('click', (event) => {
    event.preventDefault();
    sendNewCliente();
});
