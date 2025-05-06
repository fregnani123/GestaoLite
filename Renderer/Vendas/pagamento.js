const valorCrediario = document.getElementById('Crediario');

// Função para permitir navegação entre os campos com setas para cima e para baixo
function navegarCampos(evento, campos) {
    let index = campos.indexOf(document.activeElement);
  
    if (evento.key === 'ArrowDown') {
      // Mover para o próximo campo
      index = (index + 1) % campos.length;
    } else if (evento.key === 'ArrowUp') {
      // Mover para o campo anterior
      index = (index - 1 + campos.length) % campos.length;
    }
  
    const campoDestino = campos[index];
    campoDestino.focus();
  
    // Garante que o cursor vai para o final do campo ao focar
    const length = campoDestino.value.length;
    campoDestino.setSelectionRange(length, length);
  }
  
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
  
  // Adiciona o evento a todos os campos de pagamento
  const camposPagamento = [
    document.getElementById('valorDinheiro'),
    document.getElementById('PIX'),
    document.getElementById('Cartao-Debito'),
    document.getElementById('Cartao-Credito'),
    document.getElementById('Crediario'),
    document.getElementById('total-pago')
  ];
  
  // Itera pelos campos e associa o evento 'input' à função genérica
  camposPagamento.forEach(campo => {
    if (campo) {
      campo.addEventListener('input', () => formatarMoeda(campo));
  
      // Garante que o cursor começa no lado direito ao focar no campo
      campo.addEventListener('focus', () => {
        const length = campo.value.length;
        campo.setSelectionRange(length, length);
      });
  
      // Adiciona navegação por teclas de seta (apenas para cima e para baixo)
      campo.addEventListener('keydown', (evento) => {
        // Só permite navegação com as setas para cima e para baixo
        if (evento.key === 'ArrowUp' || evento.key === 'ArrowDown') {
          navegarCampos(evento, camposPagamento);
        }
      });
    }
  });

  function getFormasDePagamento() {
    const formasDePagamento = [];

    const valorDinheiro = parseCurrency(document.getElementById('valorDinheiro').value);
    const valorPIX = parseCurrency(document.getElementById('PIX').value);
    const valorCartaoDebito = parseCurrency(document.getElementById('Cartao-Debito').value);
    const valorCartaoCredito = parseCurrency(document.getElementById('Cartao-Credito').value);
    const valorCrediario = parseCurrency(document.getElementById('Crediario').value);

   
    if (valorDinheiro > 0) {
        formasDePagamento.push({ tipo: 'Dinheiro', valor: valorDinheiro.toFixed(2) });
    }
    if (valorPIX > 0) {
        formasDePagamento.push({ tipo: 'PIX', valor: valorPIX.toFixed(2) });
    }
    if (valorCartaoDebito > 0) {
        formasDePagamento.push({ tipo: 'Cartão Débito', valor: valorCartaoDebito.toFixed(2) });
    }
    if (valorCartaoCredito > 0) {
        formasDePagamento.push({ tipo: 'Cartão Crédito', valor: valorCartaoCredito.toFixed(2) });
    }
    if (valorCrediario > 0) {
        formasDePagamento.push({ tipo: 'Crediário', valor: valorCrediario.toFixed(2) });
    }

    return formasDePagamento;
}

// Função para converter valores monetários para números
function parseCurrency(value) {
    const parsedValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));
    return isNaN(parsedValue) ? 0 : parsedValue;
}

  
  function calcularValores() {
    // Seleciona e obtém os valores de todos os campos
    const camposPagamentoCalc = [
      document.getElementById('valorDinheiro').value,
      document.getElementById('PIX').value,
      document.getElementById('Cartao-Debito').value,
      document.getElementById('Cartao-Credito').value,
      document.getElementById('Crediario').value,
    ];
  
    // Converte os valores para números e soma com reduce
    const totalPago = camposPagamentoCalc.reduce((total, valor) => {
      // Remove caracteres não numéricos e converte para número
      const valorNumerico = parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
      return total + valorNumerico;
    }, 0); // Começa a soma com 0

    inputTotalPago.value = converteMoeda(totalPago)  ;
  
    return totalPago;
  }

// Função genérica para calcular e atualizar o troco
function atualizarTroco() {
    // Formatar o total líquido
    const totalLiquidoFormatado = parseFloat(inputTotalLiquido.value.replace(/\./g, '').replace(',', '.')) || 0;
    
    // Calcular o troco
    const trocoCliente = calcularValores() - totalLiquidoFormatado;
  
    // Atualizar o campo de troco
    inputTroco.value = trocoCliente < 0 ? '0,00' : converteMoeda(trocoCliente);
  }
  
  // Adicionando o evento de 'input' a todos os campos de pagamento
  const camposPagamentoTroco = [
    valorDinheiro,
    PIX,
    CartaoCredito,
    CartaoDebito,
    Crediario
  ];

  // Itera pelos campos e associa o evento 'input' à função genérica
  camposPagamentoTroco.forEach(campo => {
    if (campo) {
      campo.addEventListener('input', atualizarTroco);
    }
  });

  let valorTotalOriginal = null; // começa nulo

  inputdescontoPorcentagem.addEventListener('input', () => {
      // Se ainda não salvou o valor original, salva agora
      if (valorTotalOriginal === null) {
          valorTotalOriginal = parseFloat(inputTotalLiquido.value.replace(/\./g, '').replace(',', '.')) || 0;
      }
  
      let descontoPorcentagem = parseFloat(inputdescontoPorcentagem.value) || 0;
  
      let valorDesconto = (descontoPorcentagem / 100) * valorTotalOriginal;
      let novoTotalLiquido = valorTotalOriginal - valorDesconto;
  
      inputTotalLiquido.value = converteMoeda(novoTotalLiquido);
  
      mostrarDesconto.value = `${inputdescontoPorcentagem.value}%`
      mostrarDescontoReal.value = converteMoeda(valorDesconto);

      console.log('Valor original:', valorTotalOriginal.toFixed(2));
      console.log('Desconto aplicado (%):', descontoPorcentagem);
      console.log('Valor do desconto em reais:', valorDesconto.toFixed(2));
      console.log('Novo total líquido com desconto:', novoTotalLiquido.toFixed(2));
  
      atualizarTroco();

  });
  
  // Quando você apagar o desconto (campo vazio), reseta o valor original
  inputdescontoPorcentagem.addEventListener('blur', () => {
      if (inputdescontoPorcentagem.value === '' || parseFloat(inputdescontoPorcentagem.value) === 0) {
          valorTotalOriginal = null;
      }
  });
  




   
 