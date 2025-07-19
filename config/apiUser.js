const apiEndpointUsers = {
    postApiUser: 'http://localhost:3000/postNewUsuario',
    getApiUser: 'http://localhost:3000/getUsuario',
    updateApiUser: 'http://localhost:3000/UpdateUsuario',
    updateTaxas: 'http://localhost:3000/updateTaxas',
};

// Função para adicionar o usuário
async function postConfigUser(usuario) {
    const postUser = apiEndpointUsers.postApiUser;

    try {
        const response = await fetch(postUser, {
            method: 'POST',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error);
        }

        const data = await response.json();
        console.log('Usuário adicionado com sucesso:', data);
        alertMsg('Usuário adicionado com sucesso', 'success', 4000);
        limparFormulario();
        return data;
    } catch (error) {
        console.error('Erro ao adicionar usuário:', error.message);
        alertMsg(error.message, 'error', 4000);
        throw error;
    }
}

let cnpjCpfUser = '';
let contatoUser = '';
let nomeFantasiaUser = '';
let ramoAtuacaoUser = '';
let enderecoUser = '';
let numeroUser = '';
let bairroUser = '';
let cidadeUser = '';
let ufUser = '';
let sloganUser = '';
let redeSocialUser = '';
let razaoSocialUser = '';
let cepUser = '';
let senhaVendaUser = '';


async function getUser() {
    const getUserApi = apiEndpointUsers.getApiUser;

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
            console.log('Nenhum usuário encontrado');
            return [];
        }

        // Verifique se 'data[0]' existe antes de tentar acessar suas propriedades
        cnpjCpfUser = data[0].cnpj_cpf;
        contatoUser = data[0].contato;
        nomeFantasiaUser = data[0].nome_fantasia;
        ramoAtuacaoUser = data[0].atividade;
        enderecoUser = data[0].endereco;
        numeroUser = data[0].numero;
        bairroUser = data[0].bairro;
        cidadeUser = data[0].cidade;
        ufUser = data[0].estado;
        sloganUser = data[0].slogan;
        redeSocialUser = data[0].path_img;
        razaoSocialUser = data[0].razao_social;
        cepUser = data[0].cep;
        senhaVendaUser = data[0].senha_venda;
        
        // console.log('Usuário obtido com sucesso:', data);

       
    } catch (error) {
        console.error('Erro ao obter usuário:', error.message);
        alertMsg(error.message, 'error', 4000);
        return [];  // Return an empty array in case of error
    }
}

async function getUserAtualizar() {
    const getUserApi = apiEndpointUsers.getApiUser;

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
            btnUser.style.display = 'flex'
            btnLimparInputs.style.display = 'flex';
            console.log('Nenhum usuário encontrado');
            return [];
        } else {
            btnAtualizarUser.style.display = 'flex';
            informativo.innerHTML = ` <img src="../style/img/atencao.png" alt="Atenção"
                            style="width: 1.3rem; margin-right: .5%;"><strong>Atenção:</strong> Para <strong>alterar os dados do usuário</strong>, basta preencher os campos desejados e clicar no botão <strong>“Atualizar”</strong>.
Antes de confirmar a alteração, <strong>verifique atentamente todas as informações</strong> inseridas. Os dados serão <strong>sobrescritos</strong> no sistema e <strong>impressos no cupom não fiscal e relatórios</strong>. `;
        }

        cnpjCpf.value = data[0].cnpj_cpf;
        nomeFantasia.value = data[0].nome_fantasia || '';
        razaoSocial.value = data[0].razao_social || '';
        cep.value = data[0].cep || "";
        endereco.value = data[0].endereco || "";
        numero.value = data[0].numero || "";
        bairro.value = data[0].bairro || "";
        estado.value = data[0].estado || "";
        contato.value = data[0].contato || "";
        ie.value = data[0].inscricao_estadual || "";
        email.value = data[0].email || "";
        site.value = data[0].site || "";
        novoUsuario.value = data[0].usuario || "";
        novaSenha.value = data[0].senha;
        tipoUsuario.value = data[0].tipo_usuario || "";
        atividade.value = data[0].atividade || "";
        slogan.value = data[0].slogan || "";
        pathImg.value = data[0].path_img || "";
        ativo.value = data[0].ativo || "";
        contribuinte.value = data[0].contribuinte || "";
        usuarioAtual.value = data[0].usuario || ""
        senhaAtual.value = data[0].senha || ""
        // Supondo que senhaVendaUser já tem um valor
        const senhaVendaUser = data[0].senha_venda;

        // Seleciona o input correspondente e marca como checked
        const radioSelecionado = document.querySelector(`input[name="senha"][value="${senhaVendaUser}"]`);
        if (radioSelecionado) {
            radioSelecionado.checked = true;
        }

        id.value = data[0].id || "";

        // Dispara o evento para carregar as cidades com base no estado
        estado.dispatchEvent(new Event('change'));
        tipoUsuario.dispatchEvent(new Event('change'));
        contribuinte.dispatchEvent(new Event('change'));
        // Aguarda um pequeno tempo para garantir que as cidades carregaram antes de selecionar a correta
        setTimeout(() => {
            let cidadeSelect = document.getElementById('cidade');
            for (let option of cidadeSelect.options) {
                if (option.text === data[0].cidade) {
                    option.selected = true;
                    break;  // Sai do loop assim que encontrar a cidade
                }
            }
            let contribuinteSelect = document.getElementById('inscricaoEstadual');
            for (let option of contribuinteSelect.options) {
                if (option.text === data[0].contribuinte) {
                    option.selected = true;
                    break;  // Sai do loop assim que encontrar a cidade
                }
            }

        }, 500); // Pequeno delay para garantir que as cidades já foram carregadas

        console.log('Usuário obtido com sucesso:', data);

        return data;
    } catch (error) {
        console.error('Erro ao obter usuário:', error.message);
        alertMsg(error.message, 'error', 4000);
        return [];
    }
}

async function updateUsuario(usuarioId) {
    const UpdateUser = apiEndpointUsers.updateApiUser;

    try {
        const patchResponse = await fetch(UpdateUser, {
            method: 'PATCH',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioId),
        });

        if (!patchResponse.ok) {
            alertMsg('Erro ao atualizar usuário', 'info', 3000);
        } else {
            alertMsg('Usuário atualizado com sucesso', 'success', 3000);
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
    } catch (error) {
        alertMsg('Erro durante a atualização do usuário:', 'error', 2000);
        consol.log('Erro durante a atualização do usuário:', error);
    }
};

async function updateUsuarioSenha(usuarioId) {
    const UpdateUser = apiEndpointUsers.updateApiUser;

    try {
        const patchResponse = await fetch(UpdateUser, {
            method: 'PATCH',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioId),
        });

        if (!patchResponse.ok) {
            alertMsg('Erro ao atualizar Usuário e Senha', 'info', 3000);
        } else {
            alertMsg('Usuário e Senha atualizado com sucesso!', 'success', 3000);
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
    } catch (error) {
        alertMsg('Erro durante a atualização do usuário:', 'error', 2000);
        consol.log('Erro durante a atualização do usuário:', error);
    }
};


async function getTaxasConfig() {
    try {
        const response = await fetch('http://localhost:3000/getTaxas', {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        let valorMoeda = data[0].valor_multa_atraso;

        numeroMaxParcela.value = Number(data[0].juros_parcela_acima);
        taxaJuros.value = data[0].juros_crediario_venda;
        multaParcela.value = converteMoeda(valorMoeda)
        taxaJurosAtraso.value = data[0].juros_crediario_atraso;
        idTaxas.value = data[0].taxa_id;


        console.log('Taxas Crediário: ', data)

    } catch (error) {
        console.error('Erro ao buscar Taxas Crediario:', error);
        return [];
    }
};


async function updateTaxas(taxas) {
    const UpdateTaxas = apiEndpointUsers.updateTaxas;

    try {
        const patchResponse = await fetch(UpdateTaxas, {
            method: 'PATCH',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taxas),
        });

        if (!patchResponse.ok) {
            alertMsg('Erro ao atualizar Usuário e Senha', 'info', 3000);
        } else {
            alertMsg('Usuário e Senha atualizado com sucesso', 'success', 3000);
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
    } catch (error) {
        alertMsg('Erro durante a atualização do usuário:', 'error', 2000);
        consol.log('Erro durante a atualização do usuário:', error);
    }
};

 
