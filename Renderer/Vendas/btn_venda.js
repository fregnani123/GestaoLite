// menu lateral tela de vendas

const menuPagamentos = [
    { id: 'pgto-dinheiro', texto: 'Pagamento dinheiro', tecla: 'F1' },
    { id: 'pgto-pix', texto: 'Pagamento PIX', tecla: 'F2' },
    { id: 'pgto-credito', texto: 'Pagamento cartão crédito', tecla: 'F3' },
    { id: 'pgto-debito', texto: 'Pagamento cartão débito', tecla: 'F4' },
    { id: 'cancelar-item', texto: 'Remover item do Pedido', tecla: 'F6' },
    { id: 'crediario-loja', texto: 'Pedido Parcelado (Crediário Loja)', tecla: 'F7' },
    { id: 'alterar-cliente', texto: 'Alterar cliente Pedido', tecla: 'F8' },
    { id: 'alterar-qtd', texto: 'Alterar quantidade', tecla: 'F9' },
    { id: 'desconto-venda', texto: 'Desconto no pedido', tecla: 'F10' },
    { id: 'orcamento', texto: 'Orçamento', tecla: 'F11' },
    { id: 'reiniciar-venda', texto: 'Reiniciar pedido', tecla: 'F12' },
    { id: 'esc', texto: 'Fechar sub-telas abertas', tecla: 'ESC' },
];

const ulMenuPagamentos = document.getElementById('ul-Menu-Pagamentos');

function criaLiPagamento(item) {
    const li = document.createElement('li');
    const a = document.createElement('a');

    a.id = 'btn-' + item.id; 
    a.href = '#'; // ou coloque uma URL se quiser

    const kbd = document.createElement('kbd');
    kbd.textContent = item.tecla;

    a.appendChild(kbd);
    a.appendChild(document.createTextNode(' ' + item.texto));

    li.appendChild(a);
    return li;
}

function criaMenuPagamentos(menuArray) {
    menuArray.forEach(item => {
        const li = criaLiPagamento(item);
        ulMenuPagamentos.appendChild(li);
    });
}

criaMenuPagamentos(menuPagamentos);


document.addEventListener('DOMContentLoaded', () => {
    const btnExit = document.getElementById('btn-exit-parcelado');
    const divCrediario = document.getElementById('parcelado');
    const divContainerVenda = document.getElementById('div-container-venda');
    const linkCrediario = document.getElementById('btn-crediario-loja');
    const linkID_2 = document.querySelector('.list-a2');

    function estilizarLink(link) {
        link.style.background = '#3a5772';
        link.style.textShadow = 'none';
        link.style.color = 'white';
        link.style.borderBottom = '2px solid #d7d7d7';
    }

    function removerEstilo(link) {
        link.style.background = '';
        link.style.textShadow = '';
        link.style.color = '';
        link.style.borderBottom = '';
    }

    // Estiliza link lateral "list-a2" logo no carregamento
    estilizarLink(linkID_2);

    // Ao clicar no link crediário
    linkCrediario.addEventListener('click', (e) => {
        e.preventDefault();
        divCrediario.style.display = 'block';
        divContainerVenda.style.display = 'none';
        estilizarLink(linkCrediario); // aplica estilo ao abrir
    });

    // Ao clicar no botão X para fechar
    btnExit.addEventListener('click', (e) => {
        e.preventDefault();
        divCrediario.style.display = 'none';
        divContainerVenda.style.display = 'block';
        removerEstilo(linkCrediario); // remove estilo ao fechar
    });
});
