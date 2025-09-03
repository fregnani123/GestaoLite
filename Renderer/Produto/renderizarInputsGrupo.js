function criarEstruturaFormulario(container, tipo, placeholder, onSubmit, onExit) {
    container.innerHTML = '';

    const divContainer = document.createElement('div');
    divContainer.id = 'divContainer'
    const table = document.createElement('table');
    table.className = `div-${tipo}`;
    table.id = 'table-grupos';

 // Botão de sair
const exitButton = document.createElement('p');
exitButton.id = 'btn-exit-grupo';
exitButton.className = 'btn-exit-grupo';
exitButton.innerHTML = '&times;'; // agora vira "×"


    const trExit = document.createElement('tr');
    const tdExit = document.createElement('td');
    tdExit.colSpan = 2;
    tdExit.appendChild(exitButton);
    trExit.appendChild(tdExit);
    table.appendChild(trExit);

    // Título
    const labelText = document.createElement('label');
    labelText.textContent = `Cadastrar nova ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;

    const trLabel = document.createElement('tr');
    const tdLabel = document.createElement('td');
    tdLabel.colSpan = 2;
    tdLabel.appendChild(labelText);
    trLabel.appendChild(tdLabel);
    table.appendChild(trLabel);

    table.querySelectorAll('td, th').forEach(el => {
        el.style.border = 'none';
    });


    // Campo de input
    const input = document.createElement('input');
    input.className = `new${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
    input.id = 'grupos-inputs';
    input.type = 'text';
    input.placeholder = placeholder;

    const trInput = document.createElement('tr');
    const tdInput = document.createElement('td');
    tdInput.colSpan = 2;
    tdInput.appendChild(input);
    trInput.appendChild(tdInput);
    table.appendChild(trInput);

    // Botão de cadastrar
    const cadButton = document.createElement('button');
    cadButton.id = `btn-cad-${tipo}`;
    cadButton.className = `btn-cad`;
    cadButton.textContent = 'Cadastrar';

    const trButton = document.createElement('tr');
    const tdButton = document.createElement('td');
    tdButton.colSpan = 2;
    tdButton.appendChild(cadButton);
    trButton.appendChild(tdButton);
    table.appendChild(trButton);

    divContainer.appendChild(table);
    container.appendChild(divContainer);

    // Focar no input automaticamente
    input.focus();

    // Eventos
    cadButton.addEventListener('click', onSubmit);
    exitButton.addEventListener('click', onExit);

    return input;
}


// Eventos para exibir o formulário de cadastro de grupo, subgrupo e fornecedor
async function postNewGrupoProduto(newGrupoData) {
    const postNewGrupoProdutoData = apiEndpoints.postNewGrupoProduto;
    fetch(postNewGrupoProdutoData, {
        method: 'POST',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGrupoData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();

        })
        .then(data => {
            console.log('Grupo adicionado com sucesso:', data);
            // // Chama a função para carregar novamente os grupos a partir da API
            getGrupo(selectGrupo);
        })
        .catch(error => {
            console.error('Error adding Grupo:', error);
        });

}

async function postNewSubGrupoProduto(newSubGrupoData) {
    const postNewSubGrupoProdutoData = apiEndpoints.postNewSubGrupoProduto;
    fetch(postNewSubGrupoProdutoData, {
        method: 'POST',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubGrupoData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Sub-Grupo added successfully:', data);
            // Atualiza os subgrupos a partir da API
            getSubGrupo(selectSubGrupo);
        })
        .catch(error => {
            console.error('Error adding Sub-Grupo:', error);
        });
};

async function postNewCorProduto(newCorData) {
    const postNewCorProdutoData = apiEndpoints.postNewCorProduto;
    fetch(postNewCorProdutoData, {
        method: 'POST',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCorData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Cor added successfully:', data);
            // Atualiza os subgrupos a partir da API
            getCorProduto(selectCorProduto);
        })
        .catch(error => {
            console.error('Error adding Cor:', error);
        });
};




function renderizarInputsGrupo() {
    const tipo = 'grupo';

    const inputNewGrupo = criarEstruturaFormulario(
        containerRegister,
        tipo,
        'Digite o novo grupo',
        (e) => {
            e.preventDefault();

            const newGrupo = {
                nome_grupo: inputNewGrupo.value.trim()
            };

            if (!inputNewGrupo.value.trim()) {
                alertMsg('O campo de grupo não pode estar vazio!', 'info', 4000);
                inputNewGrupo.focus();
                return;
            }

            postNewGrupoProduto(newGrupo);
            alertMsg(
                `Novo grupo adicionado com sucesso!`,
                "success",
                4000
            );
            inputNewGrupo.value = ''; // Limpa o campo após o envio
            // Limpa as opções atuais do select e redefine a primeira como "Selecione"
            selectGrupo.innerHTML = '<option value="">Selecione</option>';
        },
        (e) => {
            e.preventDefault();
            containerRegister.style.display = 'none';
        }
    );
}

function renderizarInputsSubGrupo() {
    const tipo = 'subGrupo';

    const inputNewSubGrupo = criarEstruturaFormulario(
        containerRegister,
        tipo,
        'Digite o novo subgrupo',
        (e) => {
            e.preventDefault();

            const newSubGrupo = {
                nome_sub_grupo: inputNewSubGrupo.value.trim()
            };

            if (!inputNewSubGrupo.value.trim()) {
                alertMsg('O campo de sub-grupo não pode estar vazio!', 'info', 4000);
                inputNewSubGrupo.focus();
                return;
            }
            postNewSubGrupoProduto(newSubGrupo);
            alertMsg(
                `Novo subgrupo adicionado com sucesso!`,
                "success",
                4000
            );
            inputNewSubGrupo.value = ''; // Limpa o campo após o envio
            // Limpa as opções atuais do select e redefine a primeira como "Selecione"
            selectSubGrupo.innerHTML = '<option value="">Selecione</option>';
        },
        (e) => {
            e.preventDefault();
            containerRegister.style.display = 'none';
        }
    );
}

function renderizarInputsColor() {
    const tipo = 'Cor';

    const inputNewCor = criarEstruturaFormulario(
        containerRegister,
        tipo,
        'Digite a nova cor',
        (e) => {
            e.preventDefault();

            const newCor = {
                nome_cor_produto: inputNewCor.value.trim()
            };

            if (!inputNewCor.value.trim()) {
                alertMsg('O campo nome da cor não pode estar vazio!', 'info', 4000);
                inputNewCor.focus();
                return;
            }
            postNewCorProduto(newCor);
            alertMsg(
                `Nova cor adicionada com sucesso!`,
                "success",
                4000
            );
            inputNewCor.value = ''; // Limpa o campo após o envio
            // Limpa as opções atuais do select e redefine a primeira como "Selecione"
            selectCorProduto.innerHTML = '<option value="">Selecione</option>';
        },
        (e) => {
            e.preventDefault();
            containerRegister.style.display = 'none';
        }
    );
}





function renderizarMarca() {
    const tipo = 'Marca';

    // inputNewMarca é retornado pela função que criou o input DINAMICAMENTE
    const inputNewMarca = criarEstruturaFormulario(
        containerRegister,
        tipo,
        'Digite a nova marca',
        async (e) => {
            e.preventDefault();

            // Aqui você usa o input que acabou de ser criado
            const valor = inputNewMarca.value.trim();

            if (!valor) {
                alertMsg('O campo nome da marca não pode estar vazio!', 'info', 4000);
                inputNewMarca.focus();
                return;
            }

            const marcaData = { nome_marca: valor };

            try {
                console.log('Enviando marca:', marcaData); // VERIFICAÇÃO
                await postMarca(marcaData);
                alertMsg(`Nova marca adicionada com sucesso!`, "success", 4000);

                inputNewMarca.value = '';
                selectMarcaProduto.innerHTML = '<option value="">Selecione</option>';
            } catch (err) {
                alertMsg(`Erro ao adicionar marca: ${err.message}`, 'error', 4000);
            }
        },
        (e) => {
            e.preventDefault();
            containerRegister.style.display = 'none';
        }
    );
}

async function postMarca(marca) {
    const postNewMarcaProdutoData = apiEndpoints.postNewMarca;

    try {
        const response = await fetch(postNewMarcaProdutoData, {
            method: 'POST',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(marca),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Marca adicionada com sucesso:', data);
        getMarca(selectMarca);
        return data;

    } catch (error) {
        console.error('Erro ao adicionar marca:', error);
        throw error;
    }
}
