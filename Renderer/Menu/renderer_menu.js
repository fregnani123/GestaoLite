const menuPainel1 = [
    { id: '1', texto: 'Painel de controle', to: '../public/menu.html' },
    { id: '2', texto: 'Baixa no Estoque por Pedido', to: '../public/tela_vendas.html' },
    // { id: '2', texto: 'Realizar venda', to: '../public/padrao.html' },
    // { id: '3', texto: 'Relatórios de pedidos lançados', to: '../public/detalhe_vendas.html'},
    { id: '4', texto: 'Gerenciar produto', to: '../public/registrar_produto.html' },
    // { id: '5', texto: 'Sistema de Crediário Próprio', to: '../public/crediario.html' },
    { id: '7', texto: 'Gerenciar Cliente', to: '../public/registrar_cliente.html' },
    { id: '8', texto: 'Gerenciar Fornecedor', to: '../public/fornecedor.html' },
    // { id: '9', texto: 'Controle de Estoque ', to: '../public/controle_estoque.html' },
    // { id: '10', texto: 'Agenda ', to: '../public/agenda.html' },
    // { id: '11', texto: 'Configurações ', to: '../public/config.html'},
]

const ulMenu = document.getElementById('ul-Menu');
// console.log(ulMenu);

function criaLi(texto, id, to) {
    const a = document.createElement('a');
    const li = document.createElement('li');
    a.textContent = texto;
    a.href = to;

    if (to.startsWith('http')) {
        a.target = '_blank';
    }

    a.classList.add('list-a' + id);
    a.id = 'link-' + id;  // Adiciona o id ao <a>

    li.classList.add('menu-item-' + id);
    li.id = 'item-' + id;  // Adiciona o id ao <li>
    
    li.appendChild(a);

    return li;
}

// Cria a lista de itens de menu a partir dos arrays
function criaMenu(menuArray) {
    menuArray.forEach(item => {
        const li = criaLi(item.texto, item.id, item.to);
        ulMenu.appendChild(li);
    });
}


criaMenu(menuPainel1);

