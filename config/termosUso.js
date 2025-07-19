
function criarSerialBox() {
  // Verifica se o elemento já existe para evitar duplicações
  if (document.getElementById('serial-box')) return;

  const serialContainer = document.createElement('div');
  serialContainer.className = 'termos-uso'; // reutiliza o mesmo estilo do termos-box
  serialContainer.id = 'serial-box';
  const imgFundoSerial = document.createElement('img');
  imgFundoSerial.classList = 'imgFundoSerial';
  imgFundoSerial.src = "../style/img/ChatGPT.png"
  serialContainer.innerHTML = `
 
        <div class="termo-conteudo-serial">
               <span id="btn-exit-serial">X</span>
                <div>
                  <img class="img-logo-serial" src="../style/img/logoFGL.png" alt="GestãoLite">
            <h3>Digite o Serial do Produto</h3>
            <div class='div-input-serial'>
                <input type="text" maxlength="4" class="serial-input" id='serial-input-1' placeholder="XXXX"> - 
                <input type="text" maxlength="4" class="serial-input" id='serial-input-2' placeholder="XXXX"> -
                <input type="text" maxlength="4" class="serial-input" id='serial-input-3' placeholder="XXXX"> -
                <input type="text" maxlength="4" class="serial-input" id='serial-input-4' placeholder="XXXX">
            </div>
        </div>
         </div>
         
    <footer class='footer-serial'>
        &copy;<span id="current-year"></span> FGL Software Solutions – Todos os direitos reservados
        Versão 2.1.0
    </footer>
    `;

  // Estilo opcional (caso o estilo global não aplique aos novos inputs)
  const style = document.createElement('style');
  style.textContent = `
        .serial-input {
            width: 60px;
            padding: 8px;
            font-size: 16px;
            text-align: center;
        }
    `;
  document.head.appendChild(style);

  document.body.appendChild(serialContainer);
  serialContainer.appendChild(imgFundoSerial);

  // Botão de fechar
  const btnExit = document.getElementById('btn-exit-serial');
  btnExit.addEventListener('click', () => {
        window.close();
  
  });

 
}

criarSerialBox()

function criarTermosUso() {
  // Verifica se o elemento já existe para evitar duplicações
  if (document.getElementById('termos-box')) return;

  const termosContainer = document.createElement('div');
  termosContainer.className = 'termos-uso';
  termosContainer.id = 'termos-box';
  termosContainer.innerHTML = `
     <button id="btn-exit">X</button>
<div class="termo-conteudo">
  <h2><strong>Termos de Uso - Gerenciando Estoque FGL</strong></h2>

  <p>Ao instalar, acessar ou utilizar o sistema <strong>Gerenciando Estoque FGL</strong>, o usuário declara ter lido, compreendido e concordado integralmente com os termos e condições estabelecidos abaixo.</p>

  <ol>
    <li>
      <h3>1. Sobre o Software</h3>
      <p>
        O <strong>Gerenciando Estoque FGL</strong> é uma aplicação de uso local, voltada para o controle de <strong>estoque, saída de produtos por pedidos e agendamentos</strong>, desenvolvida com <strong>Electron JS</strong> e banco de dados <strong>SQLite</strong>.
      </p>
      <p>
        O sistema <strong>não possui integração fiscal</strong> e <strong>não emite documentos fiscais eletrônicos</strong>. Qualquer cupom gerado tem finalidade exclusivamente interna e de controle do próprio usuário.
      </p>
      <p>
        O <strong>Gerenciando Estoque FGL</strong> funciona totalmente de forma <strong>offline</strong>, sem necessidade de acesso à internet.
      </p>
      <p>
        O sistema <strong>não realiza conexões com servidores externos</strong>, <strong>não se comunica com APIs públicas ou privadas</strong> e <strong>não transmite, sincroniza ou compartilha informações</strong> com qualquer ambiente externo.
      </p>
      <p>
        A <strong>FGL Software Solutions</strong>, desenvolvedora do sistema, <strong>não coleta, armazena, acessa nem possui qualquer controle</strong> sobre os dados inseridos ou gerados pelo usuário. Todo o conteúdo permanece exclusivamente armazenado no computador local do usuário.
      </p>
    </li>

    <li>
      <h3>2. Aceitação e Responsabilidade do Usuário</h3>
      <p>
        Ao utilizar o <strong>Gerenciando Estoque FGL</strong>, o usuário assume total responsabilidade pelo uso do sistema, comprometendo-se a operá-lo de forma ética, legal e diligente.
      </p>
      <p>
        O software é fornecido “<strong>no estado em que se encontra</strong>”, sem qualquer garantia expressa ou implícita quanto ao seu desempenho, disponibilidade contínua, compatibilidade com sistemas operacionais específicos ou adequação a qualquer finalidade específica.
      </p>
    </li>

    <li>
      <h3>3. Backup e Segurança das Informações</h3>
      <p>
        Todas as informações inseridas, armazenadas ou geradas no sistema são de responsabilidade exclusiva do usuário.
      </p>
      <p>
        O <strong>Gerenciando Estoque FGL não realiza backups automáticos</strong> nem oferece serviços de armazenamento em nuvem. A segurança e integridade dos dados dependem unicamente da ação do usuário.
      </p>
      <p>
        A <strong>FGL Software Solutions</strong> <strong>não se responsabiliza</strong> por perdas de dados causadas por falhas de hardware, desligamentos abruptos, exclusões acidentais, formatação de sistema, ataques de malware, corrupção de arquivos ou qualquer outro evento local.
      </p>
      <p style="color: darkred;">
        A ausência de backups regulares por parte do usuário <strong>isenta o desenvolvedor de qualquer responsabilidade por perdas irreversíveis</strong> e invalida solicitações de suporte técnico relacionadas à recuperação de dados.
      </p>
    </li>

    <li>
      <h3>4. Isenção de Responsabilidade</h3>
      <p>
        Em nenhuma hipótese o desenvolvedor será responsabilizado por danos diretos ou indiretos, incluindo, mas não se limitando a, perdas financeiras, interrupções nas atividades do usuário, perda de dados, lucros cessantes ou prejuízos decorrentes da utilização ou falha do sistema.
      </p>
      <p>
        O usuário reconhece que falhas técnicas, uso incorreto, acidentes ou fatores externos podem comprometer os dados ou a operação do sistema, sendo de sua inteira responsabilidade mitigar esses riscos.
      </p>
    </li>

    <li>
      <h3>5. Atualizações e Riscos Associados</h3>
      <p>
        O sistema pode receber atualizações com melhorias ou correções. É responsabilidade do usuário realizar <strong>backup completo</strong> antes de aplicar qualquer atualização.
      </p>
      <p>
        A FGL Software Solutions <strong>não se responsabiliza</strong> por falhas, erros ou perda de dados decorrentes da aplicação inadequada de atualizações.
      </p>
    </li>

    <li>
      <h3>6. Licença e Propriedade Intelectual</h3>
      <p>
        O <strong>Gerenciando Estoque FGL</strong> é licenciado para uso individual e local, sendo <strong>propriedade intelectual exclusiva da FGL Software Solutions</strong>.
      </p>
      <p>
        É expressamente proibida a reprodução, redistribuição, venda, engenharia reversa, descompilação ou modificação do sistema ou de qualquer parte do seu código-fonte sem autorização expressa e formal do desenvolvedor.
      </p>
    </li>

    <li>
      <h3>7. Suporte Técnico</h3>
      <p>
        O suporte técnico é prestado de forma opcional e não contratual, conforme disponibilidade da equipe desenvolvedora.
      </p>
      <p>
        A FGL Software Solutions reserva-se o direito de descontinuar, limitar ou negar o suporte a qualquer momento, especialmente em casos de uso indevido ou falta de backups atualizados.
      </p>
    </li>

    <li>
      <h3>8. Foro</h3>
      <p>
        Para dirimir quaisquer controvérsias oriundas do uso deste sistema, as partes elegem o foro da comarca da sede da <strong>FGL Software Solutions</strong>, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
      </p>
    </li>
  </ol>
    <p>© FGL Software Solutions – Todos os direitos reservados Versão 2.1.0</p>
    <p><strong>Última atualização:</strong> 01/08/2025</p>
    <div style="margin-top: 20px;">
  <label style="display: flex; align-items: center; gap: 8px;">
    <input type="checkbox" id="aceito-termos">
    <span>Li e aceito os termos de uso.</span>
  
  </label>
    <div class='div-aceitar'>
         <button id="confirmar-termos"   style="margin-top: 10px;">
    Aceitar      <button id="nao-confirmar-termos" style="margin-top: 10px;">Sair do Aplicativo
        </button>
  </button>
  </div>
</div>
</div>
    `;
  document.body.appendChild(termosContainer);

  // AGORA os elementos existem no DOM
  const btnFechar = document.getElementById('btn-exit');
  const confirmarTermos = document.getElementById('confirmar-termos');
  const naoConfirmar = document.getElementById('nao-confirmar-termos');
  const aceitoTermos = document.getElementById('aceito-termos');
  const termosBox = document.getElementById('termos-box');

  if (termosBox.style.display !== 'none') {
    usernameCod.readOnly = true;
    passwordCod.readOnly = true;
  }

  btnFechar.addEventListener('click', () => {
    termosContainer.remove();
  });

  confirmarTermos.addEventListener('click', () => {
    if (!aceitoTermos.checked) {
      alertMsg('Para prosseguir, é necessário aceitar os termos de uso.', 'info', 4000);
      aceitoTermos.focus();
    } else {
      termosBox.style.display = 'none';
      // localStorage.setItem('aceitou_termos', 'true');
    }

    if (termosBox.style.display === 'none') {
      usernameCod.readOnly = false;
      passwordCod.readOnly = false;
      usernameCod.focus();
    }
  });

  naoConfirmar.addEventListener('click', () => {
    window.close();
  });
}

// Executar depois do DOM estar pronto:
window.addEventListener('DOMContentLoaded', () => {
  criarTermosUso();
});


const dataLogin= document.querySelector('#current-year');
const dataLogin1 = document.querySelector('#current-year-1');
const dataAtual = new Date();
const ano = dataAtual.getFullYear();
dataLogin.innerHTML = `${ano}`
dataLogin1.innerHTML = `${ano}`

const serial1 = document.getElementById('serial-input-1');
const serial2 = document.getElementById('serial-input-2');
const serial3 = document.getElementById('serial-input-3');
const serial4 = document.getElementById('serial-input-4');
const termosContainer = document.querySelector('.termos-uso');

// Foca no primeiro campo ao carregar
serial1.focus();

// Array para facilitar o controle dos inputs
const serialInputs = [serial1, serial2, serial3, serial4];

// Adiciona evento em cada input
serialInputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    if (input.value.length === 4 && index < serialInputs.length - 1) {
      serialInputs[index + 1].focus(); // Avança para o próximo input
    }
    updateSerialConst();
  });

  // Backspace para voltar ao anterior
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
      serialInputs[index - 1].focus();
    }
  });
});

// Atualiza a constante do serial completo
let serialCompleto = '';

function updateSerialConst() {
  serialCompleto = serial1.value + serial2.value + serial3.value + serial4.value;
  console.log('Serial atual:', serialCompleto);

if (serialCompleto.length === 16) {
  if (serialCompleto === 'AAAAAAAAAAAAAAAA') {
    if (termosContainer) {
      termosContainer.style.display = 'none';
    }
    alert('Serial válido!');
  } else {
    alertMsg('Chave serial inválida','info',4000);
  }
}

}


