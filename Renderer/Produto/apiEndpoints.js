// My Methods.
const apiEndpoints = {
    getGrupo: 'http://localhost:3000/grupos',
    getSubGrupo: 'http://localhost:3000/subGrupos',
    getFornecedor: 'http://localhost:3000/fornecedor',
    getTamanhoLetras: 'http://localhost:3000/tamanhoLetras',
    getTamanhoNumeros: 'http://localhost:3000/tamanhoNumeros',
    getunidadeDeMassa: 'http://localhost:3000/unidadeMassa',
    getMedidaVolume: 'http://localhost:3000/medidaVolume',
    getunidadeComprimento: 'http://localhost:3000/unidadeComprimento',
    getunidadeEstoque: 'http://localhost:3000/unidadeEstoque',
    getCorProduto: 'http://localhost:3000/corProduto',
    postNewProduto: 'http://localhost:3000/postNewProduto',
    postNewGrupoProduto: 'http://localhost:3000/newGrupo',
    postNewSubGrupoProduto: 'http://localhost:3000/newSubGrupo',
    postNewCorProduto: 'http://localhost:3000/postNewCor',
    getVendaPorNumeroPedido: 'http://localhost:3000/getVendaPorNumeroPedido'
};
const linkID_4 = document.querySelector('.list-a4')

function estilizarLinkAtivo(linkID) {
 linkID.style.background = '#157347'; // Cor de fundo atualizada para verde
  linkID.style.textShadow = 'none'; // Sem sombra de texto
  linkID.style.color = 'white'; // Cor do texto
  linkID.style.borderBottom = '2px solid black'; // Borda inferior
}
estilizarLinkAtivo(linkID_4);

function getGrupo(renderer) {
    const getGrupo = apiEndpoints.getGrupo;

    fetch(getGrupo, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',

        }
    })
        .then(response => response.json())
        .then(data => {
            // Ordenar os dados em ordem alfabética com base no nome do grupo
            data.sort((a, b) => a.nome_grupo.localeCompare(b.nome_grupo));

            // Adicionar as opções ao select
            data.forEach(grupo => {
                const option = document.createElement('option');
                option.innerHTML = grupo.nome_grupo;
                option.value = grupo.grupo_id;
                renderer.appendChild(option);
            });
            // console.log(data);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
} 
function getSubGrupo(renderer) {
    const getSubGrupo = apiEndpoints.getSubGrupo;

    fetch(getSubGrupo, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',

        }
    })
        .then(response => response.json())
        .then(data => {
            // Ordenar os subgrupos em ordem alfabética com base no nome do subgrupo
            data.sort((a, b) => a.nome_sub_grupo.localeCompare(b.nome_sub_grupo));

            // Adicionar as opções ao select
            data.forEach(subGrupo => {
                const option = document.createElement('option');
                option.innerHTML = subGrupo.nome_sub_grupo;
                option.value = subGrupo.sub_grupo_id;
                renderer.appendChild(option);
            });
            // console.log(data);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}

function getunidadeEstoque(renderer) {
    const getEstoque = apiEndpoints.getunidadeEstoque;

    fetch(getEstoque, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',

        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach((unidadeEstoque) => {
                const option = document.createElement('option');
                option.innerHTML = unidadeEstoque.estoque_nome;
                option.value = unidadeEstoque.unidade_estoque_id;
                renderer.appendChild(option);
            });
            // console.log(data);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
};


function getFornecedor(renderer, cnpjFilter) {
    const getFornecedor = apiEndpoints.getFornecedor;

    fetch(getFornecedor, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',

        }
    })
        .then(response => response.json())
        .then(data => {
            // Limpa as opções anteriores do select
            renderer.innerHTML = '';

            // Filtra os fornecedores pelo CNPJ digitado
            const fornecedorEncontrado = data.find(fornecedor => fornecedor.cnpj === cnpjFilter.value);

            if (fornecedorEncontrado) {
                const option = document.createElement('option');
                option.value = fornecedorEncontrado.fornecedor_id;
                option.textContent = fornecedorEncontrado.nome_fantasia;
                option.selected = true; // Define a opção como selecionada automaticamente
                renderer.appendChild(option);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}


function getTamanhoLetras(renderer) {
    const getTamanho = apiEndpoints.getTamanhoLetras;

    fetch(getTamanho, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',

        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach((tamanho) => {
                const option = document.createElement('option');
                option.innerHTML = tamanho.tamanho;
                option.value = tamanho.tamanho_id;
                renderer.appendChild(option);
            });
            // console.log(data);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}

function getunidadeDeMassa(renderer) {
    const getunidadeDeMassa = apiEndpoints.getunidadeDeMassa;

    fetch(getunidadeDeMassa, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',

        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach((unMassa) => {
                const option = document.createElement('option');
                option.innerHTML = unMassa.unidade_nome;
                option.value = unMassa.unidade_massa_id;
                renderer.appendChild(option);
            });
            // console.log(data);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}


function getTamanhoNumeros(renderer) {
    const getTamanho = apiEndpoints.getTamanhoNumeros;

    fetch(getTamanho, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',

        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach((tamanho) => {
                const option = document.createElement('option');
                option.innerHTML = tamanho.tamanho;
                option.value = tamanho.tamanho_id;
                renderer.appendChild(option);
            });
            // console.log(data);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
};

function getunidadeComprimento(renderer) {
    const getComprimento = apiEndpoints.getunidadeComprimento;

    fetch(getComprimento, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',

        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach((comprimento) => {
                const option = document.createElement('option');
                option.innerHTML = comprimento.unidade_nome;
                option.value = comprimento.unidade_comprimento_id;
                renderer.appendChild(option);
            });
            // console.log(data);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
};

function getunidadeEstoque(renderer) {
    const getEstoque = apiEndpoints.getunidadeEstoque;

    fetch(getEstoque, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',

        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach((unidadeEstoque) => {
                const option = document.createElement('option');
                option.innerHTML = unidadeEstoque.estoque_nome;
                option.value = unidadeEstoque.unidade_estoque_id;
                renderer.appendChild(option);
            });
            // console.log(data);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
};

function getMedidaVolume(renderer) {
    const getVolume = apiEndpoints.getMedidaVolume;

    fetch(getVolume, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',

        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach((medida) => {
                const option = document.createElement('option');
                option.innerHTML = medida.medida_nome;
                option.value = medida.medida_volume_id;
                renderer.appendChild(option);
            });
            // console.log(data);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
};

function getCorProduto(renderer) {
    const getCorProduto = apiEndpoints.getCorProduto;

    fetch(getCorProduto, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',

        }
    })
        .then(response => response.json())
        .then(data => {
            // Ordenar os dados em ordem alfabética com base no nome da cor
            data.sort((a, b) => a.nome_cor_produto.localeCompare(b.nome_cor_produto));

            // Adicionar as opções ao select
            data.forEach(cor => {
                const option = document.createElement('option');
                option.innerHTML = cor.nome_cor_produto;
                option.value = cor.cor_produto_id;
                renderer.appendChild(option);
            });
            // console.log(data);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}

// Função para envio do produto e imagem
async function postNewProdutoWithImage(produtoData, selectedFile) {
    const apiEndpoint = apiEndpoints.postNewProduto;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('produtoData', JSON.stringify(produtoData)); // Dados do produto como string JSON

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'x-api-key': 'segredo123',
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Produto e imagem adicionados com sucesso:', data);

        // Exibe a mensagem de sucesso
        alertMsg('Produto adicionados com sucesso!', 'success' );

        limparCampos();

    } catch (error) {

        console.error('Erro ao adicionar produto:', error);
        alertMsg(`${error}`, 'error');

        // Retorna imediatamente para evitar limpar os campos e exibir a imagem de sucesso
        return;
    }
};

