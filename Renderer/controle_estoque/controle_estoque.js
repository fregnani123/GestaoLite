// Elementos do DOM
const situacaoSelect = document.getElementById('situacao');
const movimentoSelect = document.getElementById('movimento');
const dateEstoque = document.getElementById('dateEstoque');
const alterarPreco = document.getElementById('alterarPreco');
const inputPrecoCompra = document.getElementById('inputPrecoCompra');
const inputMarkupEstoque = document.getElementById('MarkupEstoque');
const inputprecoVenda = document.getElementById('precoVendaEstoque');
const inputCodigoEanBuscar = document.getElementById('CodigoEanBuscar');
const inputprodutoEncontrado = document.getElementById('produtoEncontrado');
const inputqtdeMovimentacao = document.getElementById('qtdeMovimentacao');
const inputinputqtChaveCompra = document.getElementById('inputqtChaveCompra');
const inputqtvenda_id = document.getElementById('venda_id');
const estoqueAtual = document.getElementById('estoqueAtual');
const btnEstoque = document.getElementById('btn-estoque');
const limparButtonEstoque = document.querySelector('#limparButton');
const linkID_4 = document.querySelector('.list-a4');
const btnAtivo = document.getElementById('btn-ativo');

formatarCodigoEANProdutos(inputCodigoEanBuscar)
alterarPreco.disabled = true;

const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

// Variáveis globais
let produtoID, preco_compra_anterior, preco_venda_anterior;
let codigoEanGlobal, qtdEstoqueGlobal, qtdeVendidaGlobal;
let vendaID = null; // Declara antes de usar

// Estilização do link ativo
document.addEventListener('DOMContentLoaded', () => {
    estilizarLinkAtivo(linkID_4);
    inputCodigoEanBuscar?.focus();
    dateEstoque.value = new Date().toISOString().split('T')[0];
});

function estilizarLinkAtivo(linkID) {
    if (btnAtivo.id === 'btn-ativo') {
        linkID.style.background = '#3a5772';
        linkID.style.textShadow = 'none';
        linkID.style.color = 'white';
        linkID.style.borderBottom = '2px solid #d7d7d7';
    }
}

let abortController = null;

async function getProdutoEstoque(codigoDeBarras) {
    try {
        // Cancela requisição anterior, se houver
        if (abortController) {
            abortController.abort();
        }

        abortController = new AbortController();

        const response = await fetch(`http://localhost:3000/produto/${codigoDeBarras}`, {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json'
            },
            signal: abortController.signal
        });

        if (!response.ok) {
            alertMsg('Produto não encontrado.', 'orange', 6000);
            return;
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0 && data[0].nome_produto) {
            const produto = data[0];
            console.log(data);

            produtoID = produto.produto_id;
            preco_compra_anterior = produto.preco_compra;
            preco_venda_anterior = produto.preco_venda;

            inputprodutoEncontrado.value = produto.nome_produto;
            let texto = produto.nome_produto;

            if (produto.nome_cor_produto?.trim()) texto += ` ${produto.nome_cor_produto}`;
            if (produto.tamanho_letras?.trim()) texto += ` ${produto.tamanho_letras}`;
            if (produto.tamanho_numero?.trim()) texto += ` tam.${produto.tamanho_numero}`;
            if (produto.medida_volume?.trim()) texto += ` ${produto.medida_volume_qtd}${produto.medida_volume}`;
            if (produto.unidade_massa?.trim()) texto += ` ${produto.unidade_massa_qtd}${produto.unidade_massa}`;
            if (produto.unidade_comprimento?.trim()) texto += ` ${produto.unidade_comprimento_qtd}${produto.unidade_comprimento}`;
            inputprodutoEncontrado.value = texto;
              
            // Solicitar o caminho APPDATA
             const appDataPath = await ipcRenderer.invoke('get-app-data-path');
             const imgDir = path.join(appDataPath, 'electronmysql', 'img', 'produtos');
         
             // Definir o caminho da imagem (se não houver, vai ser uma string vazia)
             const imagePath = produto.caminho_img_produto || '';
         
             const imgPath = imagePath ? path.join(imgDir, imagePath) : null;
             const imgProduto = document.querySelector('.img-produto');
         

                    // Verificar se o caminho da imagem existe e definir a imagem correta
                    if (imgPath && fs.existsSync(imgPath)) {
                        imgProduto.src = imgPath;  // Caminho da imagem fornecido
                    } else {
                        relativePath.src = '../style/img/alterar-interno.png';  // Imagem padrão caso não haja imagem
                    }

            inputPrecoCompra.value = produto.preco_compra.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            inputprecoVenda.value = produto.preco_venda.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            estoqueAtual.value = produto.quantidade_estoque;


            codigoEanGlobal = produto.codigo_ean;
            qtdEstoqueGlobal = produto.quantidade_estoque;
            qtdeVendidaGlobal = produto.quantidade_vendido;
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Requisição cancelada.');
        } else {
            console.log('Erro ao buscar o produto.', error);
        }
    }
};

inputCodigoEanBuscar.addEventListener('input', () => {
    const codigo = inputCodigoEanBuscar.value.trim();

    if (/^\d{13}$/.test(codigo)) {
        getProdutoEstoque(codigo);
    }
});



// Função para formatar os campos como moeda
function formatarMoeda(elemento) {
    try {
        // Define o limite máximo (exemplo: R$ 1.000.000,00)
        const limiteMaximo = 1000000.00;

        // Remove todos os caracteres que não sejam dígitos
        let value = elemento.value.replace(/\D/g, '');

        // Converte o valor para o formato de moeda brasileira
        if (value) {
            value = parseInt(value, 10) / 100; // Divide por 100 para obter o valor decimal

            // Verifica se o valor excede o limite máximo
            if (value > limiteMaximo) {
                value = limiteMaximo; // Ajusta para o valor máximo permitido
            }

            // Formata para moeda brasileira
            value = value.toFixed(2)
                .replace('.', ',') // Troca o ponto decimal por vírgula
                .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos como separador de milhar
        } else {
            value = "0,00"; // Valor padrão se o campo estiver vazio
        }

        // Atualiza o valor do campo formatado
        elemento.value = value;

        // Move o cursor para o final
        elemento.setSelectionRange(value.length, value.length);
    } catch (error) {
        console.error(error.message);
    }
}

formatarMoeda(inputPrecoCompra);
formatarMoeda(inputprecoVenda);

// POST movimentação de estoque
async function postMovimentarEstoque(movimentacaoEstoque) {
    try {
        const response = await fetch('http://localhost:3000/postControleEstoque', {
            method: 'POST',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movimentacaoEstoque),
        });

        if (!response.ok) throw new Error(`Erro: ${response.status}`);

        const data = await response.json();
        console.log('Movimentação registrada:', data);
    } catch (error) {
        console.error('Erro ao registrar movimentação:', error);
    }
}

// PATCH estoque
async function updateEstoque(produto) {
    try {
        const response = await fetch('http://localhost:3000/UpdateEstoque', {
            method: 'PATCH',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produto),
        });

        if (!response.ok) throw new Error();
        console.log('Estoque atualizado com sucesso');
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
    }
}

// PATCH valores de compra e venda
async function UpdateValores(produto) {
    try {
        const response = await fetch('http://localhost:3000/UpdateValores', {
            method: 'PATCH',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produto),
        });

        if (!response.ok) throw new Error();
        console.log('Valores atualizados com sucesso');
    } catch (error) {
        console.error('Erro ao atualizar valores:', error);
    }
}

// Formatar moeda
inputPrecoCompra.addEventListener('input', () => {
    try {
        let value = inputPrecoCompra.value.replace(/\D/g, '');
        if (value) {
            value = (parseInt(value, 10) / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        inputPrecoCompra.value = value;
    } catch (error) {
        console.error(error.message);
    }
});

// Motivos da movimentação
const motivos = {
    "1": [ // Entradas
        { motivo: "Compra de estoque" },
        { motivo: "Devolução de cliente" },
        { motivo: "Ajuste de inventário" },
        { motivo: "Transferência recebida" },
        { motivo: "Doação recebida" },
        { motivo: "Entrada por bonificação" },
        { motivo: "Retorno de conserto" },
        { motivo: "Correção de estoque" }
    ],
    "2":
        [
            { motivo: "Troca de produto" },
            { motivo: "Transferência" },
            { motivo: "Perda de estoque" },
            { motivo: "Devolução ao fornecedor" },
            { motivo: "Amostra grátis" },
            { motivo: "Consumo interno" },
            { motivo: "Roubo/Furto" },
            { motivo: "Avaria" },
            { motivo: "Vencimento de validade" },
            { motivo: "Doação" },
            { motivo: "Ajuste de inventário" },
            { motivo: "Remessa para conserto" }
        ]

};


// Funções de evento
situacaoSelect.addEventListener('change', SituaçaoMovimento);
situacaoSelect.addEventListener('change', liberarInputsPreco);
alterarPreco.addEventListener('change', liberarInputs);
movimentoSelect.addEventListener('change', liberarInputsNV);
movimentoSelect.addEventListener('change', liberarInputsCV);
btnEstoque.addEventListener('click', alterarEstoque);


limparButtonEstoque.addEventListener('click', (e) => {
    e.preventDefault();
    location.reload();
});

function alteraEstoque(produto, operacao) {
    const qtd = parseFloat(produto.qtd);
    const novaQtde = operacao === 'adicionar'
        ? parseFloat(produto.quantidade_estoque) + qtd
        : parseFloat(produto.quantidade_estoque) - qtd;

    updateEstoque({
        quantidade_estoque: novaQtde,
        quantidade_vendido: parseFloat(produto.quantidade_vendido),
        codigo_ean: produto.codigo_ean
    });
}

const horaAtual = (() => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
})();

const dataMovimentacao = dateEstoque.value + ' ' + horaAtual;


async function alterarEstoque(e) {
    e.preventDefault();

    if (!inputCodigoEanBuscar.value) return alertMsg('Produto não adicionado.', 'warning', 5000);
    if (!inputqtdeMovimentacao.value) return alertMsg('Qtde movimentada obrigatória.', 'warning', 5000);
    if (!movimentoSelect.value) return alertMsg('Movimento obrigatório.', 'warning', 5000);

    const movimentacaoEstoque = {
        produto_id: produtoID,
        qtde_movimentada: inputqtdeMovimentacao.value,
        preco_compra_anterior,
        preco_compra_atual: inputPrecoCompra.value.replace(',', '.'),
        preco_markup_anterior: '',
        preco_markup_atual: '',
        preco_venda_anterior,
        preco_venda_atual: inputprecoVenda.value.replace(',', '.'),
        situacao_movimento: situacaoSelect.value,
        motivo_movimentacao: movimentoSelect.value,
        numero_compra_fornecedor: inputinputqtChaveCompra.value,
        venda_id: vendaID || null, // AQUI O PONTO IMPORTANTE
        data_movimentacao: `${dateEstoque.value} ${dataMovimentacao}`
    };

    const alterarEstoquePayload = {
        quantidade_estoque: qtdEstoqueGlobal,
        quantidade_vendido: qtdeVendidaGlobal,
        codigo_ean: codigoEanGlobal,
        qtd: inputqtdeMovimentacao.value
    };

    const alterarValores = {
        preco_compra: inputPrecoCompra.value.replace(',', '.'),
        markup: '',
        preco_venda: inputprecoVenda.value.replace(',', '.'),
        codigo_ean: codigoEanGlobal
    };

    try {
        await postMovimentarEstoque(movimentacaoEstoque);
        const tipo = situacaoSelect.value;
        tipo === '1'
            ? (alteraEstoque(alterarEstoquePayload, 'adicionar'), alertMsg('Produto adicionado ao estoque!', 'success', 5000))
            : (alteraEstoque(alterarEstoquePayload, 'retirar'), alertMsg('Produto retirado do estoque!', 'success', 5000));

        UpdateValores(alterarValores);
        setTimeout(() => location.reload(), 3000);

    } catch (error) {
        alertMsg('Erro ao alterar o estoque.', 'warning', 6000);
    }
}







function renderControleEstoque(renderer, produtos) {
    renderer.innerHTML = '';

    function formatarDataBR(dataISO) {
        if (!dataISO) return '';

        // Substitui T por espaço e remove espaços extras no meio
        dataISO = dataISO.replace('T', ' ').trim();

        // Divide por um ou mais espaços
        const partes = dataISO.split(/\s+/);
        const data = partes[0];
        const hora = partes[1] || '';

        const [ano, mes, dia] = data.split('-');
        if (!ano || !mes || !dia) return dataISO;

        return hora ? `${dia}/${mes}/${ano} ${hora}` : `${dia}/${mes}/${ano}`;
    }


    const motivoSE = ['Entrada', 'Saída'];

    const motivos = {
        "1": [ // Entradas
            { motivo: "Compra de estoque" },
            { motivo: "Devolução de cliente" },
            { motivo: "Ajuste de inventário" },
            { motivo: "Transferência recebida" },
            { motivo: "Doação recebida" },
            { motivo: "Entrada por bonificação" },
            { motivo: "Retorno de conserto" },
            { motivo: "Correção de estoque" }
        ],
        "2":
            [
                { motivo: "Troca de produto" },
                { motivo: "Transferência" },
                { motivo: "Perda de estoque" },
                { motivo: "Devolução ao fornecedor" },
                { motivo: "Amostra grátis" },
                { motivo: "Consumo interno" },
                { motivo: "Roubo/Furto" },
                { motivo: "Avaria" },
                { motivo: "Vencimento de validade" },
                { motivo: "Doação" },
                { motivo: "Ajuste de inventário" },
                { motivo: "Remessa para conserto" }
            ]

    };


    produtos.forEach((produto, index) => {
        const tr = document.createElement('tr');
        tr.classList.add('table-row');
        tr.classList.add(index % 2 === 0 ? 'linha-branca' : 'linha-azul');

        const tdData = document.createElement('td');
        tdData.textContent = formatarDataBR(produto.data_movimentacao);

        const tdQtdMovi = document.createElement('td');
        tdQtdMovi.textContent = produto.qtde_movimentada;

        const tdSituacao = document.createElement('td');
        tdSituacao.textContent = motivoSE[produto.situacao_movimento - 1];

        // Pega o array correto (1 ou 2) baseado na situação
        const arrayMotivos = motivos[produto.situacao_movimento];

        // Se array existe e o índice é válido, pega o motivo. Senão, valor padrão.
        const motivoTexto = (arrayMotivos && arrayMotivos[produto.motivo_movimentacao - 1])
            ? arrayMotivos[produto.motivo_movimentacao - 1].motivo
            : 'Motivo desconhecido';

        const tdMotivo = document.createElement('td');
        tdMotivo.textContent = motivoTexto;

        const tdEan = document.createElement('td');
        tdEan.textContent = produto.codigo_ean;

        const tdNome = document.createElement('td');
        let texto = produto.nome_produto?.trim() || '';
        if (produto.nome_cor_produto?.trim()) texto += ` ${produto.nome_cor_produto}`;
        if (produto.tamanho_letras?.trim()) texto += ` ${produto.tamanho_letras}`;
        if (produto.tamanho_numero?.trim()) texto += ` tam.${produto.tamanho_numero}`;
        if (produto.medida_volume?.trim()) texto += ` ${produto.medida_volume_qtd || ''}${produto.medida_volume}`;
        if (produto.unidade_massa?.trim()) texto += ` ${produto.unidade_massa_qtd || ''}${produto.unidade_massa}`;
        if (produto.unidade_comprimento?.trim()) texto += ` ${produto.unidade_comprimento_qtd || ''}${produto.unidade_comprimento}`;

        tdNome.textContent = texto.trim();
        tdNome.style.textAlign = 'left'

        tr.appendChild(tdData);
        tr.appendChild(tdEan);
        tr.appendChild(tdNome);
        tr.appendChild(tdSituacao);
        tr.appendChild(tdMotivo);
        tr.appendChild(tdQtdMovi);
        renderer.appendChild(tr);
    });
}




// Função para buscar e renderizar controle_estoque
function getControleEstoque() {
    const apiControleEstoque = 'http://localhost:3000/getControleEstoque';
    const filtroControle = document.getElementById('fitrados');

    fetch(apiControleEstoque, {
        method: 'GET',
        headers: {
            'x-api-key': 'segredo123',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            renderControleEstoque(filtroControle, data)
            console.log(data)
        })
        .catch(error => console.error('Erro ao buscar controle_estoque:', error));
}

getControleEstoque();



