

const id = document.getElementById('id');
const senha1 = document.getElementById('senha1');
const nomeFantasia = document.getElementById('nome_fantasia');
const razaoSocial = document.getElementById('razao_social');
const cep = document.getElementById('cep');
const endereco = document.getElementById('endereco');
const numero = document.getElementById('numero');
const bairro = document.getElementById('bairro');
const cidade = document.getElementById('cidade');
const estado = document.getElementById('uf');
const contato = document.getElementById('contato');
const cnpjCpf = document.getElementById('cnpjCpf');
const ie = document.getElementById('inscricao_estadual');
const email = document.getElementById('email');
const site = document.getElementById('site');
const usuarioInput = document.getElementById('usuario');
const senhaInput = document.getElementById('senha');
const tipoUsuario = document.getElementById('tipoPessoa');
const atividade = document.getElementById('atividade');
const slogan = document.getElementById('slogan');
const pathImg = document.getElementById('qr_code_img');
const ativo = document.getElementById('ativo');
const btnUser = document.getElementById('btn-user');
const btnAtualizarUser = document.getElementById('btn-atualizar-user');
const labelCnpjCPF = document.getElementById('label_cnpj_cpf');
const labelNomeFantasia = document.getElementById('labelNomeFantasia');
const labelRazao = document.getElementById('label_razao');
const contribuinte = document.getElementById('inscricaoEstadual');
const btnLimparInputs = document.getElementById('limparInputs');
const informativo = document.getElementById('info');
const btnAlterarSenha = document.getElementById('alterar-user-senha');
const divAlterarSenha = document.getElementById('div-acesso');
const divAlterVenda = document.getElementById('div-sair-vendas');
const btnExit = document.getElementById('btn-exit');
const btnExitVenda = document.getElementById('btn-exit-venda');
const novoUsuario = document.getElementById('novoUsuario');
const novaSenha = document.getElementById('nova-senha');
const repetirSenha = document.getElementById('repetir-senha');
const btnSenha = document.getElementById('btn-senha');
const btnAlterSenhaVenda = document.getElementById('altererar-senha-venda');
const btnAtulizarSenha = document.getElementById('btn-senha-venda');
const cadastroUsuario = document.getElementById('btn-flex');
const divJuros = document.getElementById('div-juros');
const btnAlterarJuros = document.getElementById('juros');
const btnExitJuros = document.getElementById('btn-exit-juros');
const numeroMaxParcela = document.getElementById('numero-max-parcela');
const taxaJuros = document.getElementById('taxa-juros');
const multaParcela = document.getElementById('multaParcela');
const taxaJurosAtraso = document.getElementById('taxaJurosAtraso');
const idTaxas = document.getElementById('idTaxas');
const btnAtualizarTaxas = document.getElementById('atualizar-juros');
const linkID_0 = document.querySelector('.list-a0');

function estilizarLinkAtivo_header(linkID) {
    linkID.style.background = '#3a5772';
    linkID.style.textShadow = 'none';
    linkID.style.color = 'white';
    linkID.style.borderBottom = '2px solid #d7d7d7';
}

document.addEventListener('DOMContentLoaded', () => {
    estilizarLinkAtivo_header(linkID_0)
})


function toggleSection(button, sectionToShow) {
    const sections = [divAlterarSenha, divAlterVenda, divJuros];

    // Verifica se alguma seção já está aberta
    const isAnyOpen = sections.some(section => section.style.display === 'flex');

    if (isAnyOpen && sectionToShow.style.display !== 'flex') {
        return; // Não abre outra seção se uma já estiver aberta
    }

    sections.forEach(section => {
        if (section !== sectionToShow) {
            section.style.display = 'none';
        }
    });

    estilizarLinkAtivo(button);
    sectionToShow.style.display = 'flex';
}

btnAlterarSenha.addEventListener('click', () => {
    if (id.value === '') {
        alertMsg("Não é possível modificar usuário e senha padrão sem antes cadastrar um usuário.", "info", 5000);
        return;
    };

    exibirOverlayEAposDelay(() => {
        toggleSection(btnAlterarSenha, divAlterarSenha);
        estilizarLinkInativo(cadastroUsuario);
    });


    novoUsuario.value = '';
    novaSenha.value = '';
    repetirSenha.value = '';
    novoUsuario.focus();
});

btnAlterSenhaVenda.addEventListener('click', () => {
    if (id.value === '') {
        alertMsg("Não é possível modificar a senha padrão sem antes cadastrar um usuário.", "info", 5000);
        return;
    };
    toggleSection(btnAlterSenhaVenda, divAlterVenda);
});

btnAlterarJuros.addEventListener('click', () => {
    if (id.value === '') {
        alertMsg("Não é possível modificar a senha padrão sem antes cadastrar um usuário.", "info", 5000);
        return;
    }

    exibirOverlayEAposDelay(() => {
        toggleSection(btnAlterarJuros, divJuros);
        estilizarLinkInativo(cadastroUsuario);
    });
});

[btnExit, btnExitVenda, btnExitJuros].forEach(btn => {
    btn.addEventListener('click', () => {
        exibirOverlayEAposDelay(() => {
            divAlterarSenha.style.display = 'none';
            divAlterVenda.style.display = 'none';
            divJuros.style.display = 'none';

            estilizarLinkInativo(btnAlterarSenha);
            estilizarLinkInativo(btnAlterSenhaVenda);
            estilizarLinkInativo(btnAlterarJuros);
            document.querySelectorAll('.btn').forEach(btn => estilizarLinkInativo(btn));
            estilizarLinkAtivo(cadastroUsuario);
        });
    });
});

tipoUsuario.addEventListener('change', () => {

    if (!cnpjCpf || !labelCnpjCPF || !labelRazao) return;


    if (tipoUsuario.value === "juridica") {
        cnpjCpf.value = '';
        cnpjCpf.removeAttribute('readonly');
        razaoSocial.removeAttribute('readonly');
        nomeFantasia.removeAttribute('readonly');

        if (contribuinte) {
            contribuinte.removeAttribute('disabled');
        }

        formatarCNPJ(cnpjCpf);
        inputMaxCaracteres(cnpjCpf, 18);
        labelCnpjCPF.innerHTML = '';
        labelCnpjCPF.append('CNPJ'); 
        labelRazao.innerHTML = 'Razão Social';
        labelNomeFantasia.innerHTML = '';
        labelNomeFantasia.append('Nome Fantasia');
        cnpjCpf.focus();
    }

    if (tipoUsuario.value === "fisica") {
        cnpjCpf.value = '';
        const valor = cnpjCpf.value.replace(/\D/g, ''); // Remove tudo que não for número

        if (tipoUsuario.value === "fisica" && valor.length !== 11) {
            cnpjCpf.value = ''; // Limpa apenas se estiver incorreto ao perder o foco
        }

        labelNomeFantasia.innerHTML = '';
        labelNomeFantasia.append('Título do Cupom Substitui o nome fantasia');
        cnpjCpf.removeAttribute('readonly');
        razaoSocial.removeAttribute('readonly');
        nomeFantasia.removeAttribute('readonly');
        if (contribuinte) {
            contribuinte.value = 'isento';
        }

        formatarEVerificarCPF(cnpjCpf);
        inputMaxCaracteres(cnpjCpf, 14);

        labelCnpjCPF.innerHTML = 'CPF';
        labelRazao.innerHTML = 'Nome';
        cnpjCpf.focus();

    } else if (tipoUsuario.value === "") {  // Se a pessoa apagar o valor do select
        cnpjCpf.setAttribute('readonly', 'true');
        razaoSocial.setAttribute('readonly', 'true');
        nomeFantasia.setAttribute('readonly', 'true');

        if (contribuinte) {
            contribuinte.setAttribute('disabled', 'true');
            contribuinte.value = ''; // Reseta para vazio
        }

        cnpjCpf.value = '';
        razaoSocial.value = '';
        nomeFantasia.value = '';

        labelCnpjCPF.innerHTML = 'CNPJ / CPF';
        labelRazao.innerHTML = 'Razão Social / Nome';
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


document.addEventListener('DOMContentLoaded', () => {

    if (divAlterarSenha.style.display !== 'flex' || divAlterVenda.style.display !== 'flex' || divJuros.style.display !== 'flex') {
        estilizarLinkAtivo(cadastroUsuario)
    }


    formatarTelefone(contato);
    inputMaxCaracteres(contato, 15);

    inputMaxCaracteres(cnpjCpf, 18);

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
    inputMaxCaracteres(estado, 2);
    inputMaxCaracteres(slogan, 48);
    inputMaxCaracteres(pathImg, 30);
    getUserAtualizar();
    getTaxasConfig();
})


function estilizarLinkAtivo(linkID) {
    linkID.style.background = '#3a5772';
    linkID.style.textShadow = 'none';
    linkID.style.color = 'white';
    linkID.style.borderBottom = '2px solid #d7d7d7';
}
function estilizarLinkInativo(linkID) {
    linkID.style.background = '';
    linkID.style.textShadow = 'none';
    linkID.style.color = 'white';
    linkID.style.borderBottom = '2px solid transparent';
}


btnUser.addEventListener('click', (e) => {
    e.preventDefault();

    let missingFields = [];

    if (!nomeFantasia.value) missingFields.push('Nome Fantasia');
    if (!razaoSocial.value) missingFields.push('Razão Social');
    if (!cep.value) missingFields.push('CEP');
    if (!endereco.value) missingFields.push('Endereço');
    if (!bairro.value) missingFields.push('Bairro');
    if (!cidade.value) missingFields.push('Cidade');
    if (!estado.value) missingFields.push('Estado');
    if (!contato.value) missingFields.push('Contato');
    if (!cnpjCpf.value) missingFields.push('CNPJ/CPF');
    if (!email.value) missingFields.push('E-mail');
    if (!tipoUsuario.value) missingFields.push('Tipo de Usuário');
    if (!slogan.value) missingFields.push('Slogan');

    // Verifica se existem campos obrigatórios faltando
    if (missingFields.length > 0) {
        alertMsg(`Os seguintes campos são obrigatórios: ${missingFields.join(', ')}`, 'info', 4000);
        return;
    }

    // Verificação de CPF (14 caracteres incluindo formatação) e CNPJ (18 caracteres incluindo formatação)
    if (tipoUsuario.value === "fisica" && cnpjCpf.value.length !== 14) {
        alertMsg('CPF inválido. O CPF deve ter 14 caracteres.', 'error', 4000);
        return;
    }

    if (tipoUsuario.value === "juridica" && cnpjCpf.value.length !== 18) {
        alertMsg('CNPJ inválido. O CNPJ deve ter 18 caracteres.', 'error', 4000);
        return;
    }

    const usuario = {
        nome_fantasia: nomeFantasia.value.toUpperCase(),
        razao_social: razaoSocial.value,
        cep: cep.value,
        endereco: endereco.value,
        numero: numero.value || null,
        bairro: bairro.value,
        cidade: cidade.value,
        estado: estado.value,
        contato: contato.value,
        cnpj_cpf: cnpjCpf.value,
        inscricao_estadual: ie.value,
        email: email.value,
        site: site.value || null,
        usuario: usuarioInput.value,
        senha: senhaInput.value,
        tipo_usuario: tipoUsuario.value,
        slogan: slogan.value,
        path_img: pathImg.value,
        ativo: ativo.value,
        contribuinte: contribuinte.value,
        atividade: atividade.value,
        senha_venda: senha1.value,
    };

    postConfigUser(usuario);
    setTimeout(() => {
        location.reload();
    }, 2000);
});

btnSenha.addEventListener('click', (e) => {
    e.preventDefault();

    if (!novaSenha.value || !repetirSenha.value) {
        alertMsg("Os campos de senha não podem estar vazios", "info", 4000);
        return;
    }

    if (repetirSenha.value !== novaSenha.value) {
        alertMsg("As senhas são diferentes", "info", 4000);
        return;
    }

    const usuarioAtualizar = {
        nome_fantasia: nomeFantasia.value,
        razao_social: razaoSocial.value,
        cep: cep.value,
        endereco: endereco.value,
        numero: numero.value || null,
        bairro: bairro.value,
        cidade: cidade.value,
        estado: estado.value,
        contato: contato.value,
        cnpj_cpf: cnpjCpf.value,
        inscricao_estadual: ie.value || null,
        email: email.value,
        site: site.value || null,
        usuario: novoUsuario.value,
        senha: novaSenha.value,
        tipo_usuario: tipoUsuario.value,
        slogan: slogan.value || null,
        path_img: pathImg.value || null,
        ativo: ativo.value ?? 1,
        contribuinte: contribuinte.value,
        atividade: atividade.value,
        senha_venda: document.querySelector('input[name="senha"]:checked')?.value || null, // Obtém o valor do rádio 
        id: id.value
    };
    updateUsuarioSenha(usuarioAtualizar);
});

btnAtulizarSenha.addEventListener('click', (e) => {
    e.preventDefault();
    const usuarioAtualizar = {
        nome_fantasia: nomeFantasia.value,
        razao_social: razaoSocial.value,
        cep: cep.value,
        endereco: endereco.value,
        numero: numero.value || null,
        bairro: bairro.value,
        cidade: cidade.value,
        estado: estado.value,
        contato: contato.value,
        cnpj_cpf: cnpjCpf.value,
        inscricao_estadual: ie.value || null,
        email: email.value,
        site: site.value || null,
        usuario: novoUsuario.value,
        senha: novaSenha.value,
        tipo_usuario: tipoUsuario.value,
        slogan: slogan.value || null,
        path_img: pathImg.value || null,
        ativo: ativo.value ?? 1,
        contribuinte: contribuinte.value,
        atividade: atividade.value,
        senha_venda: document.querySelector('input[name="senha"]:checked')?.value || null, // Obtém o valor do rádio 
        id: id.value // Certifique-se de ter um input escondido ou variável contendo o ID
    };

    updateUsuario(usuarioAtualizar);
});

btnAtualizarUser.addEventListener('click', (e) => {
    e.preventDefault();
    // Seleciona o input radio que está marcado


    const usuarioAtualizar = {
        nome_fantasia: nomeFantasia.value,
        razao_social: razaoSocial.value,
        cep: cep.value,
        endereco: endereco.value,
        numero: numero.value || null,
        bairro: bairro.value,
        cidade: cidade.value,
        estado: estado.value,
        contato: contato.value,
        cnpj_cpf: cnpjCpf.value,
        inscricao_estadual: ie.value || null,
        email: email.value,
        site: site.value || null,
        usuario: novoUsuario.value,
        senha: novaSenha.value,
        tipo_usuario: tipoUsuario.value,
        slogan: slogan.value || null,
        path_img: pathImg.value || null,
        ativo: ativo.value ?? 1,
        contribuinte: contribuinte.value,
        atividade: atividade.value,
        senha_venda: document.querySelector('input[name="senha"]:checked')?.value || null, // Obtém o valor do rádio selecionado
        id: id.value // Certifique-se de ter um input escondido ou variável contendo o ID
    };

    updateUsuario(usuarioAtualizar);
});

btnSenha.addEventListener('click', (e) => {
    e.preventDefault();

    if (!novaSenha.value || !repetirSenha.value) {
        alertMsg("Os campos de senha não podem estar vazios", "info", 4000);
        return;
    }

    if (repetirSenha.value !== novaSenha.value) {
        alertMsg("As senhas são diferentes", "info", 4000);
        return;
    }

    const usuarioAtualizar = {
        nome_fantasia: nomeFantasia.value,
        razao_social: razaoSocial.value,
        cep: cep.value,
        endereco: endereco.value,
        numero: numero.value || null,
        bairro: bairro.value,
        cidade: cidade.value,
        estado: estado.value,
        contato: contato.value,
        cnpj_cpf: cnpjCpf.value,
        inscricao_estadual: ie.value || null,
        email: email.value,
        site: site.value || null,
        usuario: novoUsuario.value,
        senha: novaSenha.value,
        tipo_usuario: tipoUsuario.value,
        slogan: slogan.value || null,
        path_img: pathImg.value || null,
        ativo: ativo.value ?? 1,
        contribuinte: contribuinte.value,
        atividade: atividade.value,
        senha_venda: document.querySelector('input[name="senha"]:checked')?.value || null, // Obtém o valor do rádio 
        id: id.value
    };
    updateUsuarioSenha(usuarioAtualizar);
});

formatarMoedaBRL(multaParcela);

btnAtualizarTaxas.addEventListener('click', (e) => {
    e.preventDefault();

    // Função para converter o formato brasileiro para número
    function converterParaNumero(valor) {
        return parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
    }

    const atualizarTaxas = {
        juros_parcela_acima: numeroMaxParcela.value,
        juros_crediario_venda: taxaJuros.value,
        valor_multa_atraso: converterParaNumero(multaParcela.value), // Converte antes de enviar
        juros_crediario_atraso: taxaJurosAtraso.value,
        taxa_id: idTaxas.value
    };

    updateTaxas(atualizarTaxas);
});


function limparFormulario() {
    nomeFantasia.value = '';
    razaoSocial.value = '';
    cep.value = '';
    endereco.value = '';
    numero.value = '';
    bairro.value = '';
    cidade.value = '';
    estado.value = '';
    contato.value = '';
    cnpjCpf.value = '';
    ie.value = '';
    email.value = '';
    site.value = '';
    usuarioInput.value = '';
    senhaInput.value = '';
    tipoUsuario.value = '';
    slogan.value = '';
    pathImg.value = '';
    ativo.value = '';
    contribuinte.value = '';
    atividade.value = '';
};

