const menuPainel1 = [
    // { id: '1', texto: 'Painel de controle', src: '../style/img/painel-de-controle (1).png', to: '' },
    { id: '11', texto: 'Configurações gerais', src: '../style/img/configuracoes.png', to: '../public/config.html' },
   { id: '9', texto: 'Agenda inteligente', src: '../style/img/agenda.png', to: '../public/agenda.html' },
    { id: '12', texto: 'Cópia de segurança', src: '../style/img/pendrive.png', to: '' },
    { id: '7', texto: 'Gerenciar cliente', src: '../style/img/cliente.png', to: '../public/registrar_cliente.html' },
];

const menuPainel2 = [
    // { id: '6', texto: '', src: '', to: '' },
    { id: '10', texto: 'Pagamento a Prazo', src: '../style/img/crediario.png', to: '../public/crediario.html' },
    { id: '3', texto: 'Relatórios de pedidos lançados', src: '../style/img/detalhes vendas.png', to: '../public/detalhe_vendas.html' },
    { id: '8', texto: 'Entrada/saída estoque', src: '../style/img/caixa-de-entrada.png', to: '../public/controle_estoque.html' },
    { id: '5', texto: 'Gerenciar fornecedor', src: '../style/img/fornecedor.png', to: '../public/fornecedor.html' },  
];

const menuPainel3 = [
    // { id: '6', texto: '', src: '', to: '' },
  { id: '4', texto: 'Gerenciar produto', src: '../style/img/codigo-de-barras.png', to: '../public/registrar_produto.html' },
    { id: '2', texto: 'Baixa no estoque por pedido', src: '../style/img/carrinho-de-compras-icon.png', to: '../public/tela_vendas.html' },
    { id: '13', texto: 'Informações estoque', src: '../style/img/caixa.png', to: '../public/informacoes_produtos.html' },
    { id: '14', texto: 'Sair', src: '../style/img/sair.png', to: '../public/index.html' },
];

function criaLi(texto, id, src, to) {
    const li = document.createElement('li');

    let a = null;

    if (id === '1') {
        const span = document.createElement('span');
        span.textContent = texto;
        li.appendChild(span);
    } else {
        a = document.createElement('a');
        a.classList.add('aImg');
        a.href = to;

        if (src && typeof src === 'string' && src.trim() !== '') {
            const img = document.createElement('img');
            img.src = src;
            img.classList.add('img-' + id);
            a.appendChild(img); // Adiciona a imagem DENTRO da tag <a>
        }

        const spanTexto = document.createElement('span');
        spanTexto.textContent = texto;
        a.appendChild(spanTexto); // Texto também dentro da tag <a>

        if (to.startsWith('http')) {
            a.target = '_blank';
        }

        li.appendChild(a);
    }

    li.classList.add('menu-item-' + id);
    return li;
}


const listPainel1 = document.querySelector('#menu-painel1');
const listPainel2 = document.querySelector('#menu-painel2');
const listPainel3 = document.querySelector('#menu-painel3');

menuPainel1.map(itemPainel => {
    const li = criaLi(itemPainel.texto, itemPainel.id, itemPainel.src, itemPainel.to);
    listPainel1.appendChild(li);
});

menuPainel2.map(itemPainel => {
    const li = criaLi(itemPainel.texto, itemPainel.id, itemPainel.src, itemPainel.to);
    listPainel2.appendChild(li);
});

menuPainel3.map(itemPainel => {
    const li = criaLi(itemPainel.texto, itemPainel.id, itemPainel.src, itemPainel.to);
    listPainel3.appendChild(li);
});

