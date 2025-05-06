const formasDePagamento = [
    { value: "Selecione", text: "Selecione:" },
    { value: "dinheiro", text: "Dinheiro" },
    { value: "boleto", text: "Boleto Bancário" },
    { value: "cartao credito", text: "Cartão de Crédito" },
    { value: "cartao debito", text: "Cartão de Débito" },
    { value: "pix", text: "PIX" },
    { value: "transferencia bancaria", text: "Transferência Bancária" },
    { value: "cheque", text: "Cheque" },
    { value: "crediario", text: "Crediário" },
    { value: "deposito bancario", text: "Depósito Bancário" },
    { value: "paypal", text: "PayPal" },
    { value: "pagseguro", text: "PagSeguro" },
    { value: "mercado pago", text: "Mercado Pago" },
    { value: "cripto", text: "Criptomoedas" },
    { value: "permuta", text: "Permuta" },
];

function preencherSelect(idSelect) {
    const select = document.getElementById(idSelect);
    if (!select) return;

    formasDePagamento.forEach(ocupacao => {
        const option = document.createElement("option");
        option.value = ocupacao.value;
        option.textContent = ocupacao.text;
        select.appendChild(option);
    });
}

preencherSelect('formaPgto')