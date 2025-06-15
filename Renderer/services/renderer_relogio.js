document.addEventListener('DOMContentLoaded', () => {
    const relogioElement = document.querySelector('.square-time');
    const dataElement = document.querySelector('.square-day');
    const dataElementAgenda = document.querySelector('.square-day-agenda');
    const inputData = document.querySelector('#data-venda');

    function atualizarRelogio() {
        const dataAtual = new Date();
        const dia = String(dataAtual.getDate()).padStart(2, '0');
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const ano = dataAtual.getFullYear();
        const hora = String(dataAtual.getHours()).padStart(2, '0');
        const minuto = String(dataAtual.getMinutes()).padStart(2, '0');
        const segundo = String(dataAtual.getSeconds()).padStart(2, '0');

        // Atualizar horário
        if (relogioElement) {
            relogioElement.innerHTML = `${hora}:${minuto}<span class="segundo-none">:</span><span class="segundo">${segundo}</span>`;
        }
     
        // Atualizar input
        if (inputData) {
            inputData.value = `${dia}/${mes}/${ano}`;
        }

        // Formatar e atualizar data
        const opcoesData = { weekday: 'long', day: 'numeric', month: 'long' };
        const dataFormatada = dataAtual.toLocaleDateString('pt-BR', opcoesData).replace('.', '');
        const dataFinal = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);

        if (dataElement) {
            dataElement.innerHTML = dataFinal;
        }

        if (dataElementAgenda) {
            dataElementAgenda.innerHTML = dataFinal;
        }
    }

    atualizarRelogio(); // chama uma vez ao carregar
    setInterval(atualizarRelogio, 1000); // atualiza a cada segundo
});
