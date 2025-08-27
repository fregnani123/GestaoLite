document.addEventListener('click', (e) => {
    if (e.target.closest('.btnImprimir')) {
        const btn = e.target.closest('.btnImprimir');
        const numeroPedido = btn.getAttribute('data-pedido');

        // Captura o conteúdo da tabela referente a este pedido
        const saleCard = btn.closest('.sale-card').innerHTML;

        // Data/hora da impressão
        const dataImpressao = new Date().toLocaleString('pt-BR');

        // Abre em uma nova janela para imprimir
        const printWindow = window.open('', '', 'width=800,height=600');
     printWindow.document.write(`
    <html>
    <head>
        <title>Imprimir Pedido ${numeroPedido}</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                font-size: 13px;
                margin: 10px;
            }
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 10px;
            }
            th, td { 
                border: 1px solid #ccc; 
                padding: 6px; 
                text-align: left;
            }
            .linha-pontilhada { 
                border-top: 1px dashed #000; 
                margin: 10px 0; 
            }
            .btnImprimir, .pedido-numero-botao img {
                display: none !important;
            }
            .header {
                display: flex;
                justify-content: space-between;
                font-weight: bold;
                font-size: 14px;
                margin-bottom: 10px;
                border-bottom: 1px solid #000;
                padding-bottom: 5px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div>DOCUMENTO PARA CONFERÊNCIA DE MERCADORIAS</div>
            <div>Nº${numeroPedido.padStart(6, '0')}</div>
        </div>

        ${saleCard}

        <div><strong>Data da Impressão:</strong> ${dataImpressao}</div>

        <script>
            window.onload = () => window.print();
        <\/script>
    </body>
    </html>
`);
;
        printWindow.document.close();
    }
});
