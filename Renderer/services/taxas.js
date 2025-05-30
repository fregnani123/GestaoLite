const selectParcela = document.getElementById("numero-max-parcela");

for (let i = 0; i <= 24; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `Acima de ${i}x`;
    selectParcela.appendChild(option);
}

const selectJuros = document.getElementById("taxa-juros");
const taxas = [0, 0.5, 1, 1.5, 1.6, 1.7, 1.8, 1.9, 2];

taxas.forEach(taxa => {
    const option = document.createElement("option");
    option.value = taxa;
    option.textContent = `Taxa de juros ${taxa.toFixed(1)}%`;
    selectJuros.appendChild(option);
});

  const selectAtraso = document.getElementById("taxaJurosAtraso");
  const taxasAtraso = [0, 0.5, 1, 1.5, 1.6, 1.7, 1.8, 1.9, 2];

  taxasAtraso.forEach(taxa => {
    const option = document.createElement("option");
    option.value = taxa;
    option.textContent = `Taxa de juros ${taxa.toFixed(1)}%`;
    selectAtraso.appendChild(option);
  });