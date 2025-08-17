const formasDePagamento = [
    { value: "", text: "-- Selecione --" },
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


// Preenche forma de pagamento
preencherSelect('formaPgto', formasDePagamento);

 
