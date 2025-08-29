const mesVigenteSelect = document.getElementById('mesVigente');
const dadosParcelasDiv = document.getElementById('dadosParcelas');

// Cria dinamicamente o select de anos
const anoSelect = document.createElement('select');
anoSelect.id = 'anoFilter';
anoSelect.style.width = '35%';
anoSelect.style.marginLeft = '2%';
anoSelect.style.textAlign = 'center';

// Define ano atual
const anoAtual = new Date().getFullYear();

// Adiciona anos do anoAtual -10 até anoAtual +1
for (let i = anoAtual - 10; i <= anoAtual + 1; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = i;
  if (i === anoAtual) option.selected = true;
  anoSelect.appendChild(option);
}

// Insere o select de anos após o select de mês
mesVigenteSelect.parentNode.appendChild(anoSelect);

// Define mês atual como padrão
const mesAtual = new Date().getMonth() + 1;
mesVigenteSelect.value = mesAtual;

/* ----------------- helpers ----------------- */
const toNumber = (v) => {
  if (v == null) return 0;
  // aceita "26,66" ou 26.66
  return parseFloat(String(v).replace(',', '.')) || 0;
};

const normalizarStatus = (s) =>
  (s ?? '')
    .toString()
    .normalize('NFD')                // remove acentos
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const isPago = (status, data_pagamento) => {
  const s = normalizarStatus(status);
  // cobre "paga", "pago", "quitado/quitada"
  if (s.includes('paga') || s.includes('pago') || s.includes('quitad')) return true;
  // fallback: se tem data de pagamento válida, considera pago
  if (data_pagamento && data_pagamento !== '-' && String(data_pagamento).trim() !== '') return true;
  return false;
};
/* ------------------------------------------- */

// Função para buscar parcelas
async function getParcelasCrediario(ano, mes) {
  try {
    const mesFormatado = mes.toString().padStart(2, '0');

    const response = await fetch(
      `http://localhost:3000/getCrediariosMesVigente?ano=${ano}&mes=${mesFormatado}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': 'segredo123',
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.log('Nenhum dado encontrado ou erro na requisição');
      return;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      console.log('Nenhum dado retornado pela API');
      dadosParcelasDiv.innerHTML =
        "<p class='p-info-parcela'>Nenhuma parcela encontrada para o período selecionado.</p>";
      atualizarTotais(0, 0, 0);
      return;
    }

    montarTabela(data);
    calcularTotais(data);

  } catch (error) {
    console.error('Erro ao buscar Taxas Crediario:', error);
  }
}

// Monta tabela dentro da div
function montarTabela(parcelas) {
  let html = '<table style="width: 100%;">';
  html += `
    <tr class='tr-info'>   
      <th>Nº da Venda</th>
      <th style="width: 30%;">Cliente</th>
      <th>Parcela</th>
      <th>Valor</th>
      <th>Multa</th>
      <th>Valor C/juros</th>
      <th>Vencimento</th>
      <th>Data Pagamento</th>
      <th style="width: 10%;">Status</th>
    </tr>
  `;

  parcelas.forEach(p => {
    const valor = toNumber(p.valor_parcela);
    const multa = toNumber(p.multa_atraso);
    const valorComJuros = valor + multa;

    html += `
      <tr>
        <td>${p.venda_id}</td>
        <td>${p.nome}</td>
        <td>${p.parcela_numero}</td>
        <td>${valor.toFixed(2)}</td>
        <td>${multa.toFixed(2)}</td>
        <td>${valorComJuros.toFixed(2)}</td>
        <td>${p.data_vencimento}</td>
        <td>${p.data_pagamento || '-'}</td>
        <td>${p.status}</td>
      </tr>
    `;
  });

  html += '</table>';
  dadosParcelasDiv.innerHTML = html;
}

// Calcula totais (mês, pagas, pendentes)
function calcularTotais(parcelas) {
  let totalMes = 0;
  let totalPagas = 0;
  let totalPendentes = 0;

  parcelas.forEach(p => {
    const valor = toNumber(p.valor_parcela);
    const multa = toNumber(p.multa_atraso);
    const valorComJuros = valor + multa;

    totalMes += valorComJuros;

    if (isPago(p.status, p.data_pagamento)) {
      totalPagas += valorComJuros;
    } else {
      totalPendentes += valorComJuros;
    }
  });

  atualizarTotais(totalMes, totalPagas, totalPendentes);
}

// Atualiza os valores na linha de totais (precisa ter #totalMes, #totalPagas, #totalPendentes no HTML)
function atualizarTotais(mes, pagas, pendentes) {
  document.getElementById('totalMes').textContent = mes.toFixed(2);
  document.getElementById('totalPagas').textContent = pagas.toFixed(2);
  document.getElementById('totalPendentes').textContent = pendentes.toFixed(2);
}

// Dispara busca com valores atuais
function buscarParcelasSelecionadas() {
  const mesSelecionado = mesVigenteSelect.value;
  const anoSelecionado = anoSelect.value;
  getParcelasCrediario(anoSelecionado, mesSelecionado);
}

// Eventos de input para mês e ano
mesVigenteSelect.addEventListener('input', buscarParcelasSelecionadas);
anoSelect.addEventListener('input', buscarParcelasSelecionadas);

// Busca inicial
buscarParcelasSelecionadas();
