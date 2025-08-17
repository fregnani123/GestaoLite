// mensagem-informativa.js

function criarMensagemInformativa() {
    const wrapper = document.querySelector('.mensagem-informativa-wrapper');
    if (!wrapper) return; // Evita erro se não existir

    const p = document.createElement('p');
    p.classList.add('formulario-mensages-informativas-p');

    p.innerHTML = `
        ⚠️ Esta tela é destinada ao
        <strong>controle de saída de estoque</strong> e
        <strong>registro de pedidos</strong>, organizados por
        período e forma de pagamento.
        A emissão gerada é apenas um
        <strong>cupom sem validade fiscal</strong>, utilizado
        <strong>exclusivamente para fins de controle interno</strong>.
        O objetivo é permitir a geração de
        <strong>relatórios</strong> personalizados sobre o destino
        dos produtos no estoque.
        Este sistema <strong>não realiza gestão fiscal ou
        burocrática do usuário.</strong>
    `;

    wrapper.appendChild(p);
}

// Executa assim que o script for carregado
criarMensagemInformativa();


 // Seleciona o container pelo ID
const containerAviso = document.getElementById('aviso-pedidos');
// informções parcelamento
function criarAvisoParcelado() {
    if (!containerAviso) return; // Evita erro se não existir
    // Define o conteúdo do aviso
    containerAviso.innerHTML = `
        ⚠️ Para pedidos <strong>parcelados</strong>, o cliente
        <strong>já deve estar previamente cadastrado no sistema</strong>.
        Verifique com <strong>atenção</strong> os dados antes de finalizar.
        O <strong>crédito</strong> também deve estar
        <strong>suficiente</strong> e <strong>liberado</strong> no cadastro do cliente
        ou <strong>ajustado</strong> na opção <strong>Alterar Cliente</strong>.<br>
        * As <strong>taxas de juros</strong> aplicadas nas parcelas são, por padrão,
        <strong>zero</strong>. Cabe ao <strong>administrador do sistema</strong>
        definir, configurar ou aplicar alterações conforme necessário, na seção
        <strong>Configurações &gt; Configurar Multas e Juros</strong>.
    `;
}

// Chama a função para renderizar o aviso
criarAvisoParcelado();
