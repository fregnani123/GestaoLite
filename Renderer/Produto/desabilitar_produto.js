// Constantes de API
const apiEndpoints = {
    getAllProdutos: 'http://localhost:3000/produtos',
    updateDesativarProduto: 'http://localhost:3000/UpdateDesativar',
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

document.addEventListener('DOMContentLoaded', () => {
    codigoEAN.focus();
})

const btnDesabilitar = document.getElementById('filtrarProdutos');
const codigoEAN = document.getElementById('codigoEAN');
const codigoEANDB = document.getElementById('codigoEANDB');
const nomeProduto = document.getElementById('nomeProduto');
const grupo = document.getElementById('grupo');
const subGrupo = document.getElementById('sub-grupo');
const corProduto = document.getElementById('corProduto');

const precoCusto = document.getElementById('precoCusto');
const precoVenda = document.getElementById('precoVenda');
const showFornecedor = document.getElementById('showFornecedor');


const tamanhoLetras = document.getElementById('tamanhoLetras');
const tamanhoNumeros = document.getElementById('tamanhoNumeros');
const unidadeMassa = document.getElementById('unidadeDeMassa');
const medidaVolume = document.getElementById('medidaVolume');
const unidadeComprimento = document.getElementById('unidadeComprimento');
const unidadeEstoque = document.getElementById('unidadeEstoque');
const inputQtd = document.getElementById('estoqueQtd');

const inputMarca = document.getElementById('marca_nome');
const inputMim = document.getElementById('inputMim');
const inputMax = document.getElementById('inputMax');
const selectEscolheUm = document.getElementById("escolhaUM");



getGrupo(grupo);
getSubGrupo(subGrupo);
getTamanhoLetras(tamanhoLetras);
getTamanhoNumeros(tamanhoNumeros);
getunidadeComprimento(unidadeComprimento);
getunidadeEstoque(unidadeEstoque);
getMedidaVolume(medidaVolume);
getCorProduto(corProduto);
getunidadeDeMassa(unidadeMassa);

document.getElementById('grupo').disabled = true;
document.getElementById('sub-grupo').disabled = true;
document.getElementById('corProduto').disabled = true;


tamanhoLetras.disabled = true;
tamanhoNumeros.disabled = true;
unidadeMassa.disabled = true;
medidaVolume.disabled = true;
unidadeComprimento.disabled = true;
unidadeEstoque.disabled = true;
inputQtd.disabled = true;
selectEscolheUm.disabled = true;
inputMim.disabled = true;
inputMax.disabled = true;
showFornecedor.disabled = true;


const linkID_4 = document.querySelector('.list-a4');
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
    estilizarLinkAtivo(linkID_4)
})


let allProducts = [];
let produtoJaBuscado = false;

formatarCodigoEANProdutos(codigoEAN);

function formatarMoedaBR(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}
document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("escolhaUM");

    const sections = {
        "Tamanho - P/GG": "divTamanho",
        "Tamanho - Numeração": "divTamanhoNUm",
        "Medida de Volume": "volumeDiv",
        "Unidade Comprimento": "comprimentoDiv",
        "Unidade de Massa": "massaDiv"
    };

    function ocultarTodosOsCamposMedida() {
        Object.values(sections).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });
    }

    select.addEventListener("change", function () {
        ocultarTodosOsCamposMedida();
        const selectedValue = select.value;
        if (sections[selectedValue]) {
            document.getElementById(sections[selectedValue]).style.display = "flex";
        }
    });


    // Função para buscar todos os produtos
    function fetchAllFornecedores() {
        fetch(apiEndpoints.getFornecedor, {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                const fornecedores = data;

                const select = document.getElementById('showFornecedor'); // <- define aqui

                fornecedores.forEach(fornecedor => {
                    const option = document.createElement('option');
                    option.value = fornecedor.fornecedor_id;
                    option.textContent = fornecedor.razao_social;
                    select.appendChild(option);
                });

                console.log(fornecedores);
            })
            .catch(error => console.error('Erro ao buscar produtos:', error));
    }

    fetchAllFornecedores();


    // --- EAN listener ---
    const codigoEAN = document.getElementById("codigoEAN");
    let produtoJaBuscado = false;

    codigoEAN.addEventListener('input', () => {
        const ean = codigoEAN.value.trim();

        if (ean.length !== 13) {
            nomeProduto.value = '';
            produtoJaBuscado = false;
            return;
        }

        if (!produtoJaBuscado) {
            fetchAllProdutos(() => {
                const produtoEncontrado = allProducts.find(prod => String(prod.codigo_ean) === ean);
                console.log(produtoEncontrado);

                if (produtoEncontrado) {
                    codigoEANDB.value = produtoEncontrado.codigo_ean;
                    nomeProduto.value = produtoEncontrado.nome_produto || '';
                    grupo.value = produtoEncontrado.grupo_id;
                    subGrupo.value = produtoEncontrado.sub_grupo_id;
                    corProduto.value = produtoEncontrado.cor_produto_id;
                    unidadeEstoque.value = produtoEncontrado.unidade_estoque_id;
                    inputQtd.value = produtoEncontrado.quantidade_estoque;
                    inputMarca.value = produtoEncontrado.marca_nome;
                    inputMim.value = produtoEncontrado.estoque_maximo;
                    inputMax.value = produtoEncontrado.estoque_minimo
                    showFornecedor.value = produtoEncontrado.fornecedor_id


                        ;
                    precoCusto.value = Number(produtoEncontrado.preco_compra || 0).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });

                    precoVenda.value = Number(produtoEncontrado.preco_venda || 0).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });



                    tamanhoLetras.value = produtoEncontrado.tamanho_letras_id;
                    tamanhoNumeros.value = produtoEncontrado.tamanho_num_id;
                    unidadeComprimento.value = produtoEncontrado.unidade_comprimento_id;
                    medidaVolume.value = produtoEncontrado.medida_volume_id;
                    unidadeMassa.value = produtoEncontrado.unidade_massa_id;

                    // 🔥 Determina qual tipo de unidade ativar com base no que veio preenchido
                    ocultarTodosOsCamposMedida(); // Oculta tudo primeiro

                    if (produtoEncontrado.tamanho_letras_id) {
                        select.value = "Tamanho - P/GG";
                        document.getElementById(sections["Tamanho - P/GG"]).style.display = "flex";
                    } else if (produtoEncontrado.tamanho_num_id) {
                        select.value = "Tamanho - Numeração";
                        document.getElementById(sections["Tamanho - Numeração"]).style.display = "flex";
                    } else if (produtoEncontrado.medida_volume_id) {
                        select.value = "Medida de Volume";
                        document.getElementById(sections["Medida de Volume"]).style.display = "flex";
                    } else if (produtoEncontrado.unidade_comprimento_id) {
                        select.value = "Unidade Comprimento";
                        document.getElementById(sections["Unidade Comprimento"]).style.display = "flex";
                    } else if (produtoEncontrado.unidade_massa_id) {
                        select.value = "Unidade de Massa";
                        document.getElementById(sections["Unidade de Massa"]).style.display = "flex";
                    }

                    produtoJaBuscado = true;
                } else {
                    alertMsg('Produto não encontrado. Verifique se está cadastrado.', 'info', 4000);
                    produtoJaBuscado = true;
                }
            });
        }
    });
});




function fetchAllProdutos(callback) {
    fetch(apiEndpoints.getAllProdutos, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            if (callback) callback();
        })
        .catch(() => {
            alertMsg('Erro ao buscar produtos. Tente novamente.','info',4000);
            produtoJaBuscado = true; // Bloqueia novas buscas mesmo com erro
        });
}




// Variável global para armazenar o produto único selecionado
let produtoSelecionado = null;

function applyFilters() {
    const codigoEANValue = codigoEAN.value.trim();

    // Filtra os produtos com base no código EAN
    const filteredProducts = allProducts.filter(produto => {
        const produtoEAN = produto.codigo_ean ? String(produto.codigo_ean) : '';
        return Number(produto.produto_ativado) === 1 && codigoEANValue && produtoEAN.includes(codigoEANValue);
    });
    // Number(produto.produto_ativado) === 1 && 
    if (filteredProducts.length === 1) {
        // Salva o único produto encontrado
        produtoSelecionado = filteredProducts[0];
        console.log('Produto único encontrado:', produtoSelecionado);

        // Renderiza apenas o produto único
        renderProdutos(ulFiltros, [produtoSelecionado]);
    } else {
        // Reseta o produto selecionado se nenhum ou vários forem encontrados
        produtoSelecionado = null;

        if (filteredProducts.length === 0) {
            alertMsg('Nenhum produto encontrado,verifique o código digitado.', 'info');
            codigoEAN.value = ''
            codigoEAN.focus();
            return;
        } else {
            ulFiltros.innerHTML = '<li class="info-row">Mais de um produto encontrado. Refine a busca.</li>';
        }
    }
}

// Função para limpar os inputs
function clearInputs() {

}

const filterButtonLimpar = document.getElementById('filterButtonLimpar');

filterButtonLimpar.addEventListener('click', () => {
    location.reload();
})



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


const btnDesativar = document.getElementById('btn-desativar');

btnDesativar.addEventListener('click', async () => {
    const produto = {
        codigo_ean_original: codigoEANDB.value,
        quantidade_estoque: 0,
        produto_ativado: 0
    };

    try {
        const patchResponse = await fetch(apiEndpoints.updateDesativarProduto, {
            method: 'PATCH',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produto)
        });

        if (!patchResponse.ok) {
            console.error('Erro ao desativar estoque do produto');
            alertMsg('Erro ao desativar produto.', 'error', 3000);
            return;
        }

        console.log('Produto desativado com sucesso');
        alertMsg('Produto desativado com sucesso!', 'success', 3000);

        setTimeout(() => {
            location.reload();
        },3000)

    } catch (error) {
        console.error('Erro durante a desativação do produto:', error);
        alertMsg('Erro inesperado.', 'error', 3000);
    }
});

