function alertMsg(msg, type = 'info',time) {
    // Define as cores ou estilos baseados no tipo da mensagem
    const colors = {
        info: 'rgb(0, 38, 87)',
        success: 'green',
        warning: '#B8860B',
        error: 'red'
    };

  // Cria um container de alerta
const bloqueiaTela = document.createElement('div');
const alertDiv = document.createElement('div');

bloqueiaTela.style.position = 'absolute';
bloqueiaTela.style.zIndex = '99999';
bloqueiaTela.style.width = '100%';
bloqueiaTela.style.height = '100vh';
bloqueiaTela.style.background = 'transparent';
bloqueiaTela.style.top = '0';
bloqueiaTela.style.left = '0';
bloqueiaTela.style.display = 'flex';
bloqueiaTela.style.alignItems = 'center';  // Alinhamento correto (center)
bloqueiaTela.style.justifyContent = 'center';  // Justificação correta (center)

alertDiv.style.fontSize = '1.4rem';
alertDiv.style.width = 'auto';
alertDiv.style.padding = '50px 70px';
alertDiv.style.borderRadius = '10px';
alertDiv.style.backgroundColor = colors[type] || colors.info;
alertDiv.style.color = 'white';
alertDiv.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
alertDiv.style.fontSize = '18px';
alertDiv.style.textAlign = 'center';
alertDiv.classList.add('alertDiv');
alertDiv.style.display = 'block'; // Torna o alerta visível


    // Define o texto da mensagem
    alertDiv.textContent = msg;
    
    bloqueiaTela.appendChild(alertDiv)
    // Adiciona o alerta ao corpo do documento
    document.body.appendChild(bloqueiaTela);
    
    setTimeout(() => {
        document.body.removeChild(bloqueiaTela);
    }, time);
}
