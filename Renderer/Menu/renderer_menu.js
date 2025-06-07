const menuPainel1 = [
    { id: '1', texto: 'Painel de controle', to: '../public/menu.html' },
    { id: '2', texto: 'Baixa no Estoque por Pedido', to: '../public/tela_vendas.html' },
    { id: '3', texto: 'Relatórios de Pedidos', to: '../public/grafico_pedido.html' },
    { id: '4', texto: 'Gerenciar produto', to: '../public/registrar_produto.html' },
    { id: '7', texto: 'Gerenciar Cliente', to: '../public/registrar_cliente.html' },
    { id: '8', texto: 'Gerenciar Fornecedor', to: '../public/fornecedor.html' },
    { id: '10', texto: 'Agenda inteligente', to: '../public/agenda.html' },
];

const ulMenu = document.getElementById('ul-Menu');

function criaLi(texto, id, to) {
    const a = document.createElement('a');
    const li = document.createElement('li');
    a.href = to;

    if (to.startsWith('http')) {
        a.target = '_blank';
    }

    a.id = 'link-' + id;
    li.id = 'item-' + id;

    // Se for o primeiro item, adiciona imagem e classe personalizada
    if (id === '1') {
        a.classList.add('botao-painel');

        const img = document.createElement('img');
        img.src = '../style/img/menu.png';
        img.alt = '';
        img.classList.add('icone-menu');

        a.appendChild(img);
        a.appendChild(document.createTextNode(' ' + texto));
    } else {
        a.textContent = texto;
        a.classList.add('list-a' + id);
        li.classList.add('menu-item-' + id);
    }

    li.appendChild(a);
    return li;
}

function criaMenu(menuArray) {
    menuArray.forEach(item => {
        const li = criaLi(item.texto, item.id, item.to);
        ulMenu.appendChild(li);
    });
}

criaMenu(menuPainel1);
