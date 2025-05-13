let alertVisible = false;  // Variável para verificar se já existe um alerta visível
const ALERT_DEFAULT_TIME = 5000; // Tempo padrão de exibição do alerta

function alertMsg(msg, type = 'info', time = ALERT_DEFAULT_TIME) {
    if (alertVisible) return;

    alertVisible = true;

    const borderColors = {
        info: '#7D7D7D',
        success: '#107C10',
        warning: '#FFD700',
        error: '#D13438'
    };

    const icons = {
        info: '⚠️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
    };

    const bloqueiaTela = document.createElement('div');
    const alertDiv = document.createElement('div');
    const titleSpan = document.createElement('span');
    const textSpan = document.createElement('span');
    const okButton = document.createElement('button');

    bloqueiaTela.style.position = 'fixed';
    bloqueiaTela.style.zIndex = '99999';
    bloqueiaTela.style.width = '100%';
    bloqueiaTela.style.height = '100vh';
    bloqueiaTela.style.top = '0';
    bloqueiaTela.style.left = '0';
    bloqueiaTela.style.display = 'flex';
    bloqueiaTela.style.alignItems = 'center';
    bloqueiaTela.style.justifyContent = 'center';
    bloqueiaTela.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';

    alertDiv.style.display = 'flex';
    alertDiv.style.flexDirection = 'column';
    alertDiv.style.alignItems = 'center';
    alertDiv.style.justifyContent = 'center';
    alertDiv.style.gap = '16px';
    alertDiv.style.fontSize = '18px';
    alertDiv.style.width = '350px';
    alertDiv.style.height = '300px';
    alertDiv.style.padding = '16px';
    alertDiv.style.borderRadius = '20px';
    alertDiv.style.backgroundColor = '#f5f5f5';
    alertDiv.style.border = `2px solid ${borderColors[type] || borderColors.info}`;
    alertDiv.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    alertDiv.style.fontFamily = 'Arial, sans-serif';

    titleSpan.textContent = `${icons[type]} Mensagem de Alerta.`;
    titleSpan.style.fontSize = '20px';
    titleSpan.style.fontWeight = 'bold';
    titleSpan.style.color = '#333';
    titleSpan.style.display = 'flex';
    titleSpan.style.alignItems = 'center';
    titleSpan.style.gap = '8px';
    titleSpan.style.marginTop = '10px';

    textSpan.textContent = msg;
    textSpan.style.color = '#333';
    textSpan.style.textAlign = 'center';

    okButton.textContent = 'OK';
    okButton.style.padding = '8px 16px';
    okButton.style.fontSize = '16px';
    okButton.style.border = 'none';
    okButton.style.borderRadius = '8px';
    okButton.style.cursor = 'pointer';
    okButton.style.backgroundColor = '#198754';
    okButton.style.color = '#fff';

    // Função de fechar alerta
    function fecharAlerta() {
        if (document.body.contains(bloqueiaTela)) {
            document.body.removeChild(bloqueiaTela);
            alertVisible = false;
        }
    }

    okButton.addEventListener('click', fecharAlerta);

    alertDiv.appendChild(titleSpan);
    alertDiv.appendChild(textSpan);
    alertDiv.appendChild(okButton);
    bloqueiaTela.appendChild(alertDiv);
    document.body.appendChild(bloqueiaTela);

    // Fechar automaticamente após o tempo
    setTimeout(() => {
        fecharAlerta();
    }, time);
}
