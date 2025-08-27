// Constantes de API
const apiEndpoints = {
    getGrupo: 'http://localhost:3000/grupos',
    getSubGrupo: 'http://localhost:3000/subGrupos',
    getAllProdutos: 'http://localhost:3000/produtos',
    getMarca: 'http://localhost:3000/getMarca',
};

// Seletores do DOM
const selectGrupo = document.getElementById('grupo');
const selectSubGrupo = document.getElementById('subgrupo');
const ulFiltros = document.getElementById('ul-filtros'); // Lista para renderizar os produtos
const codigoEAN = document.getElementById('codigoEAN');
const produtoNome = document.getElementById('produtoNome');
const filtrarProdutosButton = document.getElementById('filtrarProdutos');
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
    estilizarLinkAtivo(linkID_4);
    codigoEAN.focus();
})


let allProducts = []; // Variável para armazenar todos os produtos
formatarCodigoEANProdutos(codigoEAN)

// Função para formatar valores como moeda brasileira
function formatarMoedaBR(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

// Função para buscar e renderizar os grupos
function getGrupo(renderer) {
    fetch(apiEndpoints.getGrupo, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => a.nome_grupo.localeCompare(b.nome_grupo));
            data.forEach(grupo => {
                const option = document.createElement('option');
                option.textContent = grupo.nome_grupo;
                option.value = grupo.grupo_id;
                renderer.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao buscar grupos:', error));
}

// Função para buscar e renderizar as marcas
function getMarca(renderer) {
    fetch(apiEndpoints.getMarca, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => a.marca_nome.localeCompare(b.marca_nome));
            data.forEach(marca => {
                const option = document.createElement('option');
                option.textContent = marca.marca_nome;
                option.value = marca.marca_nome;
                renderer.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao buscar marcas:', error));
}

// Função para buscar e renderizar os subgrupos
function getSubGrupo(renderer) {
    fetch(apiEndpoints.getSubGrupo, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => a.nome_sub_grupo.localeCompare(b.nome_sub_grupo));
            data.forEach(subGrupo => {
                const option = document.createElement('option');
                option.textContent = subGrupo.nome_sub_grupo;
                option.value = subGrupo.sub_grupo_id;
                renderer.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao buscar subgrupos:', error));
}

// Função para buscar todos os produtos
function fetchAllProdutos(renderer) {
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
            renderProdutos(renderer, allProducts);
            console.log(data)
        })
        .catch(error => console.error('Erro ao buscar produtos:', error));
}

const divInfo = document.querySelector('div-info-row')

function renderProdutos(renderer, produtos) {
    renderer.innerHTML = '';

    const totalItens = produtos.length;
    const valorEstoque = produtos.reduce((acc, produto) => {
        return acc + (parseFloat(produto.preco_compra || 0) * parseInt(produto.quantidade_estoque || 0));
    }, 0);

    // Preenche os <td> com os valores
    document.getElementById('td-total-itens').textContent = totalItens;
    document.getElementById('td-valor-estoque').textContent = formatarMoedaBR(valorEstoque).replace('R$', '').trim();

    let unidades = ['un', 'cx', 'Rolo', 'pc'];

    produtos.forEach((produto, index) => { // <-- ADICIONADO index aqui
        const tr = document.createElement('tr');
        tr.classList.add('table-row');

        // ✅ Alterna entre branco e azul
        tr.classList.add(index % 2 === 0 ? 'linha-branca' : 'linha-azul');

        const tdCodigo = document.createElement('td');
        tdCodigo.textContent = produto.codigo_ean || 'Sem código';

        const tdNome = document.createElement('td');
        let texto = produto.nome_produto;

        if (produto.nome_cor_produto?.trim()) texto += ` ${produto.nome_cor_produto}`;
        if (produto.tamanho_letras?.trim()) texto += ` ${produto.tamanho_letras}`;
        if (produto.tamanho_numero?.trim()) texto += ` tam.${produto.tamanho_numero}`;
        if (produto.medida_volume?.trim()) texto += ` ${produto.medida_volume_qtd}${produto.medida_volume}`;
        if (produto.unidade_massa?.trim()) texto += ` ${produto.unidade_massa_qtd}${produto.unidade_massa}`;
        if (produto.unidade_comprimento?.trim()) texto += ` ${produto.unidade_comprimento_qtd}${produto.unidade_comprimento}`;
        tdNome.textContent = texto;

        const tdEstoque = document.createElement('td');
        tdEstoque.textContent = `${produto.quantidade_estoque} ${unidades[produto.unidade_estoque_id - 1]}` || '0';

        const tdCompra = document.createElement('td');
        tdCompra.textContent = formatarMoedaBR(parseFloat(produto.preco_compra || 0)).replace('R$', '').trim();

        const tdVenda = document.createElement('td');
        tdVenda.textContent = formatarMoedaBR(parseFloat(produto.preco_venda || 0)).replace('R$', '').trim();;

        const tdVendida = document.createElement('td');
        tdVendida.textContent = `${produto.quantidade_vendido} ${unidades[produto.unidade_estoque_id - 1]}` || '0';

        const tdQtdMim = document.createElement('td');
        tdQtdMim.textContent = `${produto.estoque_minimo} ${unidades[produto.unidade_estoque_id - 1]}` || '0';

        // const tdQtdMax = document.createElement('td');
        // tdQtdMax.textContent = `${produto.estoque_maximo} ${unidades[produto.unidade_estoque_id - 1]}` || '0';

        const tdMarca = document.createElement('td');
        tdMarca.textContent = `${produto.marca_nome}`;

        tr.appendChild(tdCodigo);
        tr.appendChild(tdNome);
        tr.appendChild(tdEstoque);
        tr.appendChild(tdQtdMim);
        tr.appendChild(tdCompra);
        tr.appendChild(tdVenda);
        tr.appendChild(tdVendida);
        tr.appendChild(tdMarca);


        if (Number(produto.quantidade_estoque) < Number(produto.estoque_minimo)) {
            tdEstoque.style.background = '#d1ecf1';  // azul clarinho
            tdQtdMim.style.background = '#d1ecf1';

            alertMsg('Há produtos com quantidade inferior ao estoque mínimo permitido.', 'info', 4000)
        }


        renderer.appendChild(tr);
    });

}


// Função para aplicar os filtros
function applyFilters() {
    const codigoEANValue = codigoEAN.value.trim();
    const produtoNomeValue = produtoNome.value.trim();
    const grupoValue = selectGrupo.value;
    const subgrupoValue = selectSubGrupo.value;

    const filteredProducts = allProducts.filter(produto => {
        return (
            produto.produto_ativado === 1 &&  // Exclui os produtos desativados
            (!codigoEANValue || produto.codigo_ean.includes(codigoEANValue)) &&
            (!produtoNomeValue || produto.nome_produto.toLowerCase().includes(produtoNomeValue.toLowerCase())) &&
            (!grupoValue || produto.grupo_id == grupoValue) &&
            (!subgrupoValue || produto.sub_grupo_id == subgrupoValue)
        );
    });

    renderProdutos(ulFiltros, filteredProducts);
    // clearInputs();
}

// Quando digitar no campo código EAN, aplica os filtros automaticamente
codigoEAN.addEventListener("input", () => {
    applyFilters();
});

// Quando digitar no campo nome, aplica os filtros automaticamente
produtoNome.addEventListener("input", () => {
    applyFilters();
});


// Função para limpar os inputs
function clearInputs() {
    codigoEAN.value = '';
    produtoNome.value = '';
    selectGrupo.value = '';
    selectSubGrupo.value = '';
}

// Eventos iniciais
filtrarProdutosButton.addEventListener('click', applyFilters);
getGrupo(selectGrupo);
getSubGrupo(selectSubGrupo);
fetchAllProdutos(ulFiltros);

const filterButtonInfor = document.getElementById('limparButton');
if (filterButtonInfor) {
    filterButtonInfor.addEventListener('click', () => {
        location.reload();
    });
}


const botaoImprimir = document.querySelector('.botao-imprimir');

botaoImprimir.addEventListener('click', () => {
    const select = document.getElementById('tipo-relatorio');
    const tipo = select.value;

    if (tipo === 'estoque') {
        imprimirTabela();
    } else if (tipo === 'preco') {
        imprimirTabelaPreco();
    } else {
        alertMsg('Selecione um tipo de relatório antes de imprimir.', 'info', 4000);
    }
});



function imprimirTabela() {
    const tabela = document.getElementById('tabela-produtos');

    if (!tabela) {
        alertMsg('Tabela não encontrada para impressão.','info',4000);
        return;
    }

    // Clonar a tabela original
    const tabelaClone = tabela.cloneNode(true);

    // Remover as colunas indesejadas (5, 6 e 8)
    const indicesParaRemover = [7, 5, 4]; // Começa do fim para não bagunçar os índices

    // Remove do <thead>
    const theadRow = tabelaClone.querySelector('thead tr');
    indicesParaRemover.forEach(i => {
        if (theadRow.children[i]) theadRow.removeChild(theadRow.children[i]);
    });

    // Remove do <tbody>
    const tbodyRows = tabelaClone.querySelectorAll('tbody tr');
    tbodyRows.forEach(tr => {
        indicesParaRemover.forEach(i => {
            if (tr.children[i]) tr.removeChild(tr.children[i]);
        });
    });

    const janelaImpressao = window.open('', '_blank');
    janelaImpressao.document.write(`
        <html>
            <head>
                <title>Estoque Atual – Relatório Impresso</title>
                <style>
                    @page {
                        size: A4 portrait;
                        margin: 20mm 15mm;
                    }

                    body {
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        margin: 0;
                        padding: 10mm;
                        box-sizing: border-box;
                        color: #000;
                    }

                    h2 {
                        text-align: left;
                        margin-bottom: 20px;
                    }

                    table {
                        border-collapse: collapse;
                        width: 100%;
                        table-layout: fixed;
                        word-wrap: break-word;
                    }

                    th, td {
                        border: 1px solid #aaa;
                        padding: 6px 8px;
                        text-align: left;
                        vertical-align: middle;
                    }

                    th {
                        background-color: #f0f0f0;
                    }

                    .linha-branca {
                        background-color: #fff;
                    }

                    .linha-azul {
                        background-color: #f4f9ff;
                    }

                    /* Ajuste específico para colunas */
                    th:nth-child(2), td:nth-child(2) {
                        width: 35%;
                    }

                    th:nth-child(5), td:nth-child(5) {
                        text-align: center;
                        width: 10%;
                    }

                    tr {
                        page-break-inside: avoid;
                    }
                </style>
            </head>
            <body>
                <h2>Estoque Atual – Relatório Impresso</h2>
                ${tabelaClone.outerHTML}
            </body>
        </html>
    `);

    janelaImpressao.document.close();
    janelaImpressao.focus();
    janelaImpressao.print();
}
function imprimirTabelaPreco() {
    const tabela = document.getElementById('tabela-produtos');

    if (!tabela) {
        alertMsg('Tabela não encontrada para impressão.', 'info', 4000);
        return;
    }

    const tabelaClone = tabela.cloneNode(true);

    // Índices das colunas que devem permanecer
    const colunasMantidas = [0, 1,2, 5, 6];

    // Remove colunas indesejadas do <thead>
    const theadRow = tabelaClone.querySelector('thead tr');
    if (theadRow) {
        for (let i = theadRow.children.length - 1; i >= 0; i--) {
            if (!colunasMantidas.includes(i)) {
                theadRow.removeChild(theadRow.children[i]);
            }
        }
    }

    // Remove colunas indesejadas do <tbody>
    const tbodyRows = tabelaClone.querySelectorAll('tbody tr');
    tbodyRows.forEach(tr => {
        for (let i = tr.children.length - 1; i >= 0; i--) {
            if (!colunasMantidas.includes(i)) {
                tr.removeChild(tr.children[i]);
            }
        }
    });

    // Abre nova janela com a tabela formatada para impressão
    const janelaImpressao = window.open('', '_blank');
    janelaImpressao.document.write(`
        <html>
            <head>
                <title>Relatório de Preço – Impressão</title>
                <style>
                    @page {
                        size: A4 portrait;
                        margin: 20mm 15mm;
                    }

                    body {
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        margin: 0;
                        padding: 10mm;
                        box-sizing: border-box;
                        color: #000;
                    }

                    h2 {
                        text-align: left;
                        margin-bottom: 20px;
                    }

                    table {
                        border-collapse: collapse;
                        width: 100%;
                        table-layout: fixed;
                        word-wrap: break-word;
                    }

                    th, td {
                        border: 1px solid #aaa;
                        padding: 6px 8px;
                        text-align: left;
                        vertical-align: middle;
                    }

                    th {
                        background-color: #f0f0f0;
                    }

                    .linha-branca {
                        background-color: #fff;
                    }

                    .linha-azul {
                        background-color: #f4f9ff;
                    }

                    /* Largura personalizada */
                    th:nth-child(1), td:nth-child(1) {
                        width: auto;
                    }

                    th:nth-child(2), td:nth-child(2) {
                        width: 450px;
                        text-align: center;
                    }

                    th:nth-child(3), td:nth-child(3),
                    th:nth-child(4), td:nth-child(4),
                    th:nth-child(5), td:nth-child(5) {
                        width: auto;
                        text-align: center;
                    }

                    tr {
                        page-break-inside: avoid;
                    }
                </style>
            </head>
            <body>
                <h2>Relatório de Preço – Impressão</h2>
                ${tabelaClone.outerHTML}
            </body>
        </html>
    `);

    janelaImpressao.document.close();
    janelaImpressao.focus();
    janelaImpressao.print();
}
