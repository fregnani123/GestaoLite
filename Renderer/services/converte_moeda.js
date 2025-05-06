//consverte Moeda valor fixo, sem interação usuário.
function converteMoeda(value) {

    // Converte para string com duas casas decimais
    value = value.toFixed(2);

    // Converte para formato brasileiro: substitui o ponto decimal por vírgula e adiciona pontos de milhares
    value = value.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return value; // Retorna o valor formatado
}

// Formata valor com separador de milhar
function formatCurrency(value) {
    return value
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatarNumero(valor) {
    // Remove todas as vírgulas (milhares) e troca a vírgula decimal por ponto
    let valorFormatado = valor.replace(/\./g, '');  // Remove os pontos de milhares
    valorFormatado = valorFormatado.replace(',', '.');  // Substitui a vírgula por ponto
    return parseFloat(valorFormatado);  // Converte para float
}

// Esta funcão é a que melhor apresentou a converção ao digitar no input para valores
function formatarMoedaBRL(input) {
    input.addEventListener('input', () => {
        try {
            // Remove todos os caracteres que não sejam dígitos
            let value = input.value.replace(/\D/g, '');

            // Converte o valor para o formato correto (sem "R$")
            if (value) {
                value = (parseInt(value, 10) / 100).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            } else {
                value = '0,00';
            }

            // Atualiza o valor do input com o formato correto
            input.value = value;
        } catch (error) {
            console.error(error.message);
        }
    });
}


