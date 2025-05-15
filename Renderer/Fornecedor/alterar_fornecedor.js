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

function estilizarLinkAtivo(linkID) {
 linkID.style.background = '#5f8ac1'; 
  linkID.style.textShadow = 'none'; // Sem sombra de texto
  linkID.style.color = 'white'; // Cor do texto
  linkID.style.borderBottom = '2px solid black'; // Borda inferior
}
estilizarLinkAtivo(linkID_8)

document.addEventListener('DOMContentLoaded', () => {
    cnpj.focus();
    
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
    if (cnpj.value.length === 18) {
        getFornecedores();
    } 
});

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
            const fornecedorEncontrado = data.find(fornecedor => fornecedor.cnpj === cnpj.value);
            console.log('Fornecedor: ', data);
            if (fornecedorEncontrado) {
                razaoSocial.value = fornecedorEncontrado.razao_social || '';
                nomeFantasia.value = fornecedorEncontrado.nome_fantasia || '';
                ie.value = fornecedorEncontrado.inscricao_estadual || '';
                telefone.value = fornecedorEncontrado.telefone || '';
                cep.value = fornecedorEncontrado.cep || '';
                email.value = fornecedorEncontrado.email || '';
                endereco.value = fornecedorEncontrado.endereco || '';
                bairro.value = fornecedorEncontrado.bairro || '';
                uf.value = fornecedorEncontrado.uf || '';
                observacoes.value = fornecedorEncontrado.observacoes || '';
                numero.value = fornecedorEncontrado.numero || '';

                // Define o valor do estado
                uf.value = fornecedorEncontrado.uf || 'Selecione';

                // Dispara o evento change para carregar as cidades
                const eventoChange = new Event('change');
                uf.dispatchEvent(eventoChange); // Dispara o evento change
               
                // Verifica todas as opções do select e marca a cidade correspondente
                for (let option of cidade.options) {
                    if (option.text === fornecedorEncontrado.cidade) {
                        option.selected = true;
                        break;  // Sai do loop assim que encontrar a cidade
                    }
                }

                for (let option of pessoa.options) {
                    // Remove os acentos e converte para minúsculas para a comparação
                    const optionTextNormalized = option.text.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    const fornecedorPessoaNormalized = fornecedorEncontrado.pessoa.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    
                    if (optionTextNormalized === fornecedorPessoaNormalized) {
                        option.selected = true;
                        break;
                    }
                }
                
                for (let option of contribuinte.options) {
                    const optionTextNormalized = option.text.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    const fornecedorContribuinteNormalized = fornecedorEncontrado.contribuinte.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    
                    if (optionTextNormalized === fornecedorContribuinteNormalized) {
                        option.selected = true;
                        break;  // Sai do loop assim que encontrar o valor
                    }
                }
                
                for (let option of forma_de_Pgto.options) {
                    const optionTextNormalized = option.text.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    const fornecedorRamosDeAtividadeNormalized = fornecedorEncontrado.forma_de_Pgto.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    
                    if (optionTextNormalized === fornecedorRamosDeAtividadeNormalized) {
                        option.selected = true;
                        break;  // Sai do loop assim que encontrar o valor
                    }
                }
                
                for (let option of ramos_de_atividade.options) {
                    const optionTextNormalized = option.text.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    const fornecedorRamosDeAtividadeNormalized = fornecedorEncontrado.ramos_de_atividade.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    
                    if (optionTextNormalized === fornecedorRamosDeAtividadeNormalized) {
                        option.selected = true;
                        break;  // Sai do loop assim que encontrar o valor
                    }
                }

                for (let option of condicoes_Pgto.options) {
                    const optionTextNormalized = option.text.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    const fornecedorRamosDeAtividadeNormalized = fornecedorEncontrado.condicoes_Pgto.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    
                    if (optionTextNormalized === fornecedorRamosDeAtividadeNormalized) {
                        option.selected = true;
                        break;  // Sai do loop assim que encontrar o valor
                    }
                }
              
                
          
            } else {
                limparCamposFornecedor();
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
};


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

pessoa.addEventListener('change', () => {
    const labelCnpjCPF = document.getElementById('filtrar');
    const label_razao = document.getElementById('label_razao');

    if (pessoa.value === "juridica") {
        cnpj.value = '';
        cnpj.removeAttribute('readonly'); 
        razaoSocial.removeAttribute('readonly'); 
        formatarCNPJ(cnpj);
        inputMaxCaracteres(cnpj, 18);
        labelCnpjCPF.innerHTML = '🔍 Filtrar CNPJ';
        label_razao.innerHTML = 'Razão Social';
        contribuinte.removeAttribute('disabled');
        nomeFantasia.removeAttribute('readonly');
        contribuinte.value = 'isento';
        cnpj.focus();
    } else if (pessoa.value === "fisica") {
        razaoSocial.addEventListener('input', () => {
            if (pessoa.value === "fisica") {
                nomeFantasia.value = razaoSocial.value;
            }
        });        
        cnpj.value = '';
        cnpj.removeAttribute('readonly'); // Remove o atributo readonly
        razaoSocial.removeAttribute('readonly'); 
        nomeFantasia.setAttribute('readonly',true);
        nomeFantasia.value = razaoSocial.value;
        contribuinte.value = 'isento';
        formatarEVerificarCPF(cnpj);
        inputMaxCaracteres(cnpj, 14);
        labelCnpjCPF.innerHTML = '🔍 Filtrar CPF';
        label_razao.innerHTML = 'Nome';
        cnpj.focus();
    } else {
        cnpj.value = '';
        labelCnpjCPF.innerHTML = 'CNPJ / CPF';
        label_razao.innerHTML = 'Razão Social / Nome';
        cnpj.setAttribute('readonly', 'true'); 
        contribuinte.setAttribute('disabled',true);
        razaoSocial.setAttribute('readonly',true);
        nomeFantasia.setAttribute('readonly',true);
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
    contribuinte.value  = '';
    numero.value  = '';
    ramos_de_atividade.value  = ''; 
    forma_de_Pgto.value  = '';
    condicoes_Pgto.value  = '';
    cnpj.value  = ''
}

const limparButtonFilter = document.getElementById('limparButton');

limparButtonFilter.addEventListener('click', () => {
    location.reload();
});