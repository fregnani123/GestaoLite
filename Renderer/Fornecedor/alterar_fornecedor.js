// Declarando as variáveis para os campos do formulário
const telefone = document.getElementById('telefone');
const cnpj = document.getElementById('cnpjAlterar');
const ie = document.getElementById('ie');
const cep = document.getElementById('cep');
const email = document.getElementById('email');
const razaoSocial = document.getElementById('razaoSocial');
const nomeFantasia = document.getElementById('nomeFantasia');
const endereco = document.getElementById('endereco');
const bairro = document.getElementById('bairro');
const cidade = document.getElementById('cidade');
const uf = document.getElementById('uf');
const observacoes = document.getElementById('observacoes');
const linkID_8 = document.querySelector('.list-a8');
const btnAtualizar = document.getElementById('atualizar-fornecedor');

const pessoa = document.getElementById('tipoPessoa');
const contribuinte = document.getElementById('inscricaoEstadual');
const numero = document.getElementById('numero');
const ramos_de_atividade = document.getElementById('atividade');
const forma_de_Pgto = document.getElementById('formaPgto');
const condicoes_Pgto = document.getElementById('condicoesPgto');

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
    estilizarLinkAtivo(linkID_8)
})

document.addEventListener('DOMContentLoaded', () => {
    pessoa.focus();

    formatarTelefone(telefone);
    inputMaxCaracteres(telefone, 15);

    // Formatando o campo CNPJ
    formatarCNPJ(cnpj);
    inputMaxCaracteres(cnpj, 18);

    // Formatando o campo IE
    formatarIE(ie);
    inputMaxCaracteres(ie, 14);

    // Formatando o campo CEP
    formatarCEP(cep);
    inputMaxCaracteres(cep, 9);

    // Verificando o campo email
    verificarEmail(email);
    inputMaxCaracteres(email, 150);

    // Limitando o número de caracteres para outros campos
    inputMaxCaracteres(razaoSocial, 200);
    inputMaxCaracteres(nomeFantasia, 200);
    inputMaxCaracteres(endereco, 255);
    inputMaxCaracteres(bairro, 150);
    inputMaxCaracteres(cidade, 150);
    inputMaxCaracteres(uf, 2);
})

cnpj.addEventListener('input', () => {
    if (cnpj.value.length === 14 && pessoa.value === "fisica") {
        getFornecedores();
    }else if(cnpj.value.length === 18 && pessoa.value === "juridica"){
     getFornecedores();
    }
});

function normalizarTexto(texto) {
    if (typeof texto !== 'string') return '';
    return texto.trim().replace(/\s+/g, ' ');
}

function normalizarFornecedor(f) {
    return {
        ...f,
        cnpj: normalizarTexto(f.cnpj),
        razao_social: normalizarTexto(f.razao_social),
        nome_fantasia: normalizarTexto(f.nome_fantasia),
        inscricao_estadual: normalizarTexto(f.inscricao_estadual),
        telefone: normalizarTexto(f.telefone),
        cep: normalizarTexto(f.cep),
        email: normalizarTexto(f.email),
        endereco: normalizarTexto(f.endereco),
        bairro: normalizarTexto(f.bairro),
        cidade: normalizarTexto(f.cidade),
        uf: normalizarTexto(f.uf),
        numero: normalizarTexto(f.numero),
        pessoa: normalizarTexto(f.pessoa),
        contribuinte: normalizarTexto(f.contribuinte),
        forma_de_Pgto: normalizarTexto(f.forma_de_Pgto),
        ramos_de_atividade: normalizarTexto(f.ramos_de_atividade),
        condicoes_Pgto: normalizarTexto(f.condicoes_Pgto),
        observacoes: normalizarTexto(f.observacoes)
    };
}

function getFornecedores() {
    const getFornecedor = 'http://localhost:3000/fornecedor';

    fetch(getFornecedor, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            const fornecedoresNormalizados = data.map(normalizarFornecedor);
            const fornecedorEncontrado = fornecedoresNormalizados.find(
                f => f.cnpj === normalizarTexto(cnpj.value)
            );

            if (fornecedorEncontrado) {
            } else if (!fornecedorEncontrado && pessoa.value === 'fisica'){
                alertMsg('Fornecedor não encontrado para o CPF informado.','info', 4000);
                limparCamposFornecedor();
            }  else if (!fornecedorEncontrado && pessoa.value === 'juridica'){
                alertMsg('Fornecedor não encontrado para o CNPJ informado.','info', 4000);
                limparCamposFornecedor();
            } 


            console.log('Fornecedor:', fornecedorEncontrado);

            if (fornecedorEncontrado) {
                razaoSocial.value = fornecedorEncontrado.razao_social;
                nomeFantasia.value = fornecedorEncontrado.nome_fantasia;
                ie.value = fornecedorEncontrado.inscricao_estadual;
                telefone.value = fornecedorEncontrado.telefone;
                cep.value = fornecedorEncontrado.cep;
                email.value = fornecedorEncontrado.email;
                endereco.value = fornecedorEncontrado.endereco;
                bairro.value = fornecedorEncontrado.bairro;
                numero.value = fornecedorEncontrado.numero;
                uf.value = fornecedorEncontrado.uf || 'Selecione';

                // Dispara evento para carregar cidades
                const eventoChange = new Event('change');
                uf.dispatchEvent(eventoChange);

                // Seleciona cidade
                for (let option of cidade.options) {
                    if (normalizarTexto(option.text) === fornecedorEncontrado.cidade) {
                        option.selected = true;
                        break;
                    }
                }

                // Função auxiliar para selecionar a opção correta
                function selecionarOption(selectElement, valor) {
                    if (!selectElement || !valor) return;

                    const valorNormalizado = normalizarTexto(valor).toLowerCase();

                    for (let option of selectElement.options) {
                        const optionValor = normalizarTexto(option.value).toLowerCase();
                        if (optionValor === valorNormalizado) {
                            option.selected = true;
                            break;
                        }
                    }
                }

                selecionarOption(pessoa, fornecedorEncontrado.pessoa);
                selecionarOption(contribuinte, fornecedorEncontrado.contribuinte);
                selecionarOption(forma_de_Pgto, fornecedorEncontrado.forma_de_Pgto);
                selecionarOption(ramos_de_atividade, fornecedorEncontrado.ramos_de_atividade);
                selecionarOption(condicoes_Pgto, fornecedorEncontrado.condicoes_Pgto);
            } else {
                limparCamposFornecedor();
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}


async function UpdateFornecedor(fornecedorId) {
    const UpdateFornecedorUrl = 'http://localhost:3000/UpdateFornecedor';

    try {
        const patchResponse = await fetch(UpdateFornecedorUrl, {
            method: 'PATCH',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fornecedorId),
        });

        if (!patchResponse.ok) {
            alertMsg('Erro ao atualizar fornecedor', 'info', 3000);
        } else {
            alertMsg('Fornecedor atualizado com sucesso', 'success', 3000);
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
    } catch (error) {
        alertMsg('Erro durante a atualização do fornecedor:', 'error', 2000);
        consol.log('Erro durante a atualização do fornecedor:', error);
    }
};


const labelCnpjCPF = document.getElementById('label_cnpj_cpf');
const label_razao = document.getElementById('label_razao');

pessoa.addEventListener('change', () => {
    if (pessoa.value === "juridica") {
        labelCnpjCPF.innerHTML = 'CNPJ';
        label_razao.innerHTML = 'Razão Social';
        cnpj.style.display = '';
        razaoSocial.style.display = '';

        cnpj.value = '';
        cnpj.removeAttribute('readonly');
        razaoSocial.removeAttribute('readonly');
        formatarCNPJ(cnpj);
        inputMaxCaracteres(cnpj, 18);
        contribuinte.removeAttribute('disabled');
        nomeFantasia.removeAttribute('readonly');
        contribuinte.value = 'isento';
        cnpj.focus();

    } else if (pessoa.value === "fisica") {
        labelCnpjCPF.innerHTML = 'CPF';
        label_razao.innerHTML = 'Nome';
        cnpj.style.display = '';
        razaoSocial.style.display = '';

        razaoSocial.addEventListener('input', () => {
            if (pessoa.value === "fisica") {
                nomeFantasia.value = razaoSocial.value;
            }
        });
        cnpj.value = '';
        cnpj.removeAttribute('readonly');
        razaoSocial.removeAttribute('readonly');
        nomeFantasia.setAttribute('readonly', true);
        nomeFantasia.value = razaoSocial.value;
        contribuinte.value = 'isento';
        formatarEVerificarCPF(cnpj);
        inputMaxCaracteres(cnpj, 14);
        cnpj.focus();

    } else {
        labelCnpjCPF.innerHTML = 'CNPJ / CPF';
        label_razao.innerHTML = 'Razão Social / Nome';

        cnpj.value = '';
        cnpj.setAttribute('readonly', 'true');
        razaoSocial.setAttribute('readonly', 'true');

        // Oculta os inputs quando estiver vazio
        cnpj.style.display = 'none';
        razaoSocial.style.display = 'none';
    }
});

contribuinte.addEventListener('change', () => {
    if (contribuinte.value === 'contribuinte') {
        ie.removeAttribute('readonly');
    } else {
        ie.value = '';
        ie.setAttribute('readonly', true);
    }
});


btnAtualizar.addEventListener('click', (e) => {
    e.preventDefault();

    const fornecedorId = {
        inscricao_estadual: ie.value,
        razao_social: razaoSocial.value,
        nome_fantasia: nomeFantasia.value,
        cep: cep.value,
        cidade: cidade.value,
        bairro: bairro.value,
        uf: uf.value,
        endereco: endereco.value,
        telefone: telefone.value,
        email: email.value,
        observacoes: '',  // Aqui está vazio, está correto?
        pessoa: pessoa.value,
        contribuinte: contribuinte.value,
        numero: numero.value,
        ramos_de_atividade: ramos_de_atividade.value,
        forma_de_Pgto: forma_de_Pgto.value,
        condicoes_Pgto: condicoes_Pgto.value,
        cnpj: cnpj.value
    };

    UpdateFornecedor(fornecedorId);
});

function limparCamposFornecedor() {
    razaoSocial.value = '';
    nomeFantasia.value = '';
    ie.value = '';
    telefone.value = '';
    cep.value = '';
    email.value = '';
    endereco.value = '';
    bairro.value = '';
    cidade.value = '';
    uf.value = '';
    observacoes.value = '';
    pessoa.value = '';
    contribuinte.value = '';
    numero.value = '';
    ramos_de_atividade.value = '';
    forma_de_Pgto.value = '';
    condicoes_Pgto.value = '';
    cnpj.value = ''
}

const limparButtonFilter = document.getElementById('limparButton');

limparButtonFilter.addEventListener('click', () => {
    location.reload();
});