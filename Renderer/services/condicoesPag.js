const condicoesPgto = [
    { value: "", text: "-- Selecione --" },
    { value: "avista", text: "À Vista" },
    { value: "30 Dias", text: "30 Dias" },
    { value: "60 Dias", text: "60 Dias" },
    { value: "90 Dias", text: "90 Dias" },
    { value: "120 Dias", text: "120 Dias" },
    { value: "30 60 Dias", text: "30 60 Dias" },
    { value: "30 60 90 Dias", text: "30 60 90 Dias" },
    { value: "parcelado", text: "Parcelado" },
    { value: "semanal", text: "Semanal" },
    { value: "quinzenal", text: "Quinzenal" },
    { value: "mensal", text: "Mensal" },
    { value: "trimestral", text: "Trimestral" },
    { value: "semestral", text: "Semestral" },
    { value: "anual", text: "Anual" },
    { value: "sobnegociacao", text: "Sob Negociação" },
    { value: "antecipado", text: "Pagamento Antecipado" },
    { value: "entrada mais parcelas", text: "Entrada mais Parcelas" },
];

// Preenche condição de pagamento
preencherSelect('condicoesPgto', condicoesPgto);
 
