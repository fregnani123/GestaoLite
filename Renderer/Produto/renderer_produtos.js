// Seleciona os elementos do dropdown
const selectGrupo = document.querySelector('#grupo');
const selectSubGrupo = document.querySelector('#sub-grupo');
const selectFornecedor = document.querySelector('#fornecedor');
const cnpjFilter = document.querySelector('#cnpjFilter');
const selectTamanhoLetras = document.querySelector('#tamanhoLetras');
const selectTamanhoNumeros = document.querySelector('#tamanhoNumeros');
const selectUnidadeMassa = document.querySelector('#unidadeDeMassa');
const selectMedidaVolume = document.querySelector('#medidaVolume');
const selectUnidadeComprimento = document.querySelector('#unidadeComprimento');
const selectUnidadeEstoque = document.querySelector('#unidadeEstoque');
const selectCorProduto = document.querySelector('#corProduto');

// Seleciona todos os campos de input
const inputCodigoEANProduto = document.querySelector('#codigoDeBarras');
const inputNomeProduto = document.querySelector('#nomeProduto');
const inputObservacoes = document.querySelector('#observacoes');
const inputMassa = document.querySelector('#massaNumero');
const inputVolume = document.querySelector('#volumeNumero');
const inputComprimento = document.querySelector('#comprimento');
const inputQuantidadeEstoque = document.querySelector('#estoqueQtd');
const inputQuantidadeVendido = document.querySelector('#Qtd_vendido'); //Input Oculto, salva codidade 0 
const inputPathImg = document.querySelector('#produto-imagem');
const divImgProduct = document.querySelector('.quadro-img');
const btnFornecedorMenu = document.querySelector('.li-fornecedor');
const containerRegister = document.querySelector('.container-register');
const btnCadGrupo = document.querySelector('#add-grupo');
const btnCadSubGrupo = document.querySelector('#add-subGrupo');
const btnCadCor = document.querySelector('#add-cor');

// Seleciona os campos de input
const inputMarkup = document.querySelector('#inputMarkup');
const inputPrecoCompra = document.querySelector('#precoCusto');
const inputprecoVenda = document.querySelector('#precoVenda');
const inputLucro = document.querySelector('#lucro');

// Adiciona um atraso para evitar requisições a cada digitação
let timeout;
cnpjFilter.addEventListener('input', (e) => {
    formatarCNPJ(cnpjFilter);
    inputMaxCaracteres(cnpjFilter, 18);
    
    // Se o CNPJ for menor que 18 caracteres, redefine para o padrão e sai da função
    if (cnpjFilter.value.length < 18) {
        resetarFornecedor();
        return;
    }

    clearTimeout(timeout);
    timeout = setTimeout(() => {
        getFornecedor(selectFornecedor, cnpjFilter);
    }, 100); // Aguarda 100ms antes de buscar os fornecedores
});

// Função para redefinir o select para o padrão
function resetarFornecedor() {
    selectFornecedor.innerHTML = '<option value="1">Fornecedor não Cadastrado</option>';
    selectFornecedor.disabled = true;
}

//Metodos criado por mim que renderizam os values iniciais padrões ou cadastrados no DB.
getGrupo(selectGrupo);
getSubGrupo(selectSubGrupo);
getTamanhoLetras(selectTamanhoLetras);
getTamanhoNumeros(selectTamanhoNumeros);
getunidadeComprimento(selectUnidadeComprimento);
getunidadeEstoque(selectUnidadeEstoque);
getMedidaVolume(selectMedidaVolume);
getCorProduto(selectCorProduto);
getunidadeDeMassa(selectUnidadeMassa);

document.addEventListener("DOMContentLoaded", function () {
  const select = document.getElementById("escolhaUM");

  // Mapeamento dos valores do select para os IDs dos divs
  const sections = {
      "Tamanho - P/GG": "divTamanho",
      "Tamanho - Numeração": "divTamanhoNUm",
      "Medida de Volume": "volumeDiv",
      "Unidade Comprimento": "comprimentoDiv",
      "Unidade de Massa": "massaDiv"
  };

  // Evento para mudar a exibição
  select.addEventListener("change", function () {
      // Oculta todos os divs
      Object.values(sections).forEach(id => {
          document.getElementById(id).style.display = "none";
      });

      // Exibe o div correspondente, se um valor válido for selecionado
      const selectedValue = select.value;
      if (sections[selectedValue]) {
          document.getElementById(sections[selectedValue]).style.display = "flex";
      }
  });
});

// Função para calcular lucro
function calcularLucro() {
  // Remove qualquer coisa que não seja número, e converte para float
  let precoCompraNum = parseFloat(inputPrecoCompra.value.replace(/\D/g, '')) / 100;
  let precoVendaNum = parseFloat(inputprecoVenda.value.replace(/\D/g, '')) / 100;

  // Verifica se os valores são números válidos
  if (isNaN(precoCompraNum) || isNaN(precoVendaNum)) {
    inputLucro.value = ''; // Se não for válido, limpa o campo
    return;
  }

  // Calcula o lucro
  const lucro =  precoVendaNum - precoCompraNum ;

  // Atualiza o campo de lucro com o valor calculado
  inputLucro.value = lucro < 0 ? '0,00' : lucro.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

  // Função para formatar os valores como moeda brasileira
  function formatarMoeda(valor) {
    return valor.toFixed(2)
      .replace('.', ',') // Troca o ponto decimal por vírgula
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos como separador de milhar
  }

  inputPrecoCompra.addEventListener('input', () => {
    calcularLucro(); // chama o cálculo do lucro
    try {
      // Remove todos os caracteres que não sejam dígitos
      let value = inputPrecoCompra.value.replace(/\D/g, '');
  
      // Converte o valor para o formato de moeda brasileira
      if (value) {
        value = (parseInt(value, 10) / 100).toFixed(2) // Divide por 100 para obter o valor decimal
          .replace('.', ',') // Troca o ponto decimal por vírgula
          .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos como separador de milhar
      }
  
      // Atualiza o valor do campo formatado
      inputPrecoCompra.value = value;
      // Chama a função de cálculo usando o valor numérico original
      // calcularPrecoVenda(parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0, inputMarkup.value, inputprecoVenda);
      
    } catch (error) {
      console.error(error.message);
    }
  });

  inputMarkup.addEventListener('input', () => {
    try {
      // Remove caracteres inválidos, permitindo apenas números e um único ponto decimal
      let value = inputMarkup.value;
  
      // Substitui caracteres que não sejam números ou pontos
      value = value.replace(/[^0-9.]/g, '');
  
      // Garante que apenas o primeiro ponto seja mantido
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join(''); // Remove pontos adicionais
      }
  
      // Limita a duas casas decimais
      if (value.indexOf('.') !== -1) {
        value = value.slice(0, value.indexOf('.') + 3); // mantém duas casas após o ponto
      }
  
      // Atualiza o campo de entrada com o valor limpo e com no máximo 2 casas decimais
      inputMarkup.value = value;
      calcularLucro(); // chama o cálculo do lucro
      // Chama a função de cálculo com os valores
      calcularPrecoVenda(parseFloat(inputPrecoCompra.value.replace(',', '.')) || 0, parseFloat(value) || 0, inputprecoVenda);
    } catch (error) {
      console.error(error.message);
    }
  });


// Evento para calcular o markup quando o preço de venda é alterado
inputprecoVenda.addEventListener('input', (e) => {
  calcularLucro(); // chama o cálculo do lucro
  // Remove qualquer coisa que não seja número
  let value = e.target.value.replace(/\D/g, '');

  // Converte o valor para o formato de moeda brasileira
  if (value) {
    value = (parseInt(value, 10) / 100).toFixed(2) // Divide por 100 para obter o valor decimal
      .replace('.', ',') // Troca o ponto decimal por vírgula
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos como separador de milhar
  }

  // Atualiza o campo de entrada com o valor formatado
  e.target.value = value;

  // Chama a função para calcular o markup
  calcularMarkup(inputPrecoCompra.value, e.target.value);
  
});


inputCodigoEANProduto.addEventListener('input', (e) => {
  formatarCodigoEANProdutos(e.target);
  inputMaxCaracteres(inputCodigoEANProduto,13);
});
inputNomeProduto.addEventListener('input', (e) => {
    inputMaxCaracteres(inputNomeProduto,150);
});
inputObservacoes.addEventListener('input', (e) => {
    inputMaxCaracteres(inputObservacoes, 150);
});

inputCodigoEANProduto.focus();


btnCadGrupo.addEventListener('click', (e) => {
    e.preventDefault();
    containerRegister.style.display = 'flex';
    renderizarInputsGrupo();
});

btnCadSubGrupo.addEventListener('click', (e) => {
    e.preventDefault();
    containerRegister.style.display = 'flex';
    renderizarInputsSubGrupo();
});

btnCadCor.addEventListener('click', (e) => {
    e.preventDefault();
    containerRegister.style.display = 'flex';
    renderizarInputsColor();
});

document.addEventListener('DOMContentLoaded', (event) => {
    const inputPathImg = document.querySelector('#produto-imagem');
    const divImgProduct = document.querySelector('.quadro-img');

    inputPathImg.onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            // Verifica se já existe uma imagem com a classe .img-produto e a remove
            let imgProduto = divImgProduct.querySelector('.img-produto');
            if (imgProduto) {
                divImgProduct.removeChild(imgProduto);
            }

            // Cria um novo elemento de imagem
            imgProduto = document.createElement('img');
            imgProduto.className = 'img-produto';

            const reader = new FileReader();

            reader.onload = function (e) {
                imgProduto.src = e.target.result;
            };

            reader.readAsDataURL(file);

            // Adiciona a nova imagem à div.quadro-img
            divImgProduct.appendChild(imgProduto);

            const relativePath = file.name.replace(/\.[^/.]+$/, "");
            inputPathImg.setAttribute('data-relative-path', relativePath);
        }
    };
});

inputPathImg.onchange = function (event) {
    const file = event.target.files[0];
    if (file) {
        const produtoImg = document.getElementById('produtoImg');

        const reader = new FileReader();

        reader.onload = function (e) {
            produtoImg.src = e.target.result;
        };

        reader.readAsDataURL(file);

        const relativePath = file.name.replace(/\.[^/.]+$/, "");
        document.querySelector('#inputPathImg').setAttribute('data-relative-path', relativePath);
    }
};

document.querySelector('#btn-cadastrar-produto').addEventListener('click', async function (e) {
  e.preventDefault();
  
  if (inputCodigoEANProduto.value.length !== 13) {
    alertMsg('O código do produto deve conter exatamente 13 números. Por favor, revise se está correto.','info');
    return;
  }
  
  const file = document.querySelector('input[type="file"]').files[0];
  let relativePath = null;

  if (file) {
      const extension = file.name.split('.').pop();
      relativePath = `${inputPathImg.getAttribute('data-relative-path')}.${extension}`;
  }

  const produtoData = { 
      codigo_ean: inputCodigoEANProduto.value,
      grupo_id: selectGrupo.value,
      sub_grupo_id: selectSubGrupo.value,
      nome_produto: inputNomeProduto.value,
      tamanho_letras_id: selectTamanhoLetras.value,
      tamanho_num_id: selectTamanhoNumeros.value,
      unidade_massa_id: selectUnidadeMassa.value,
      medida_volume_id: selectMedidaVolume.value,
      unidade_comprimento_id: selectUnidadeComprimento.value,
      quantidade_estoque: parseInt(inputQuantidadeEstoque.value, 10),
      quantidade_vendido: parseInt(inputQuantidadeVendido.value, 10),
      preco_compra: parseFloat(inputPrecoCompra.value.replace(',', '.')),
      markup: parseFloat(inputMarkup.value.replace(',', '.')),
      preco_venda: parseFloat(inputprecoVenda.value.replace(',', '.')),
      unidade_estoque_id: selectUnidadeEstoque.value,
      unidade_massa_qtd: parseFloat(inputMassa.value || 0),
      medida_volume_qtd: parseFloat(inputVolume.value || 0),
      unidade_comprimento_qtd: parseFloat(inputComprimento.value || 0),
      fornecedor_id: selectFornecedor.value,
      caminho_img_produto: relativePath,
      cor_produto_id: selectCorProduto.value,
      observacoes: inputObservacoes.value,
  };

  // Verificar quais campos obrigatórios não foram preenchidos
  let camposFaltando = [];

  if (!produtoData.codigo_ean) camposFaltando.push("Código EAN");
  if (!produtoData.nome_produto) camposFaltando.push("Nome do Produto");
  if (!produtoData.grupo_id) camposFaltando.push("Grupo");
  if (!produtoData.sub_grupo_id) camposFaltando.push("Subgrupo");
  if (!produtoData.preco_compra) camposFaltando.push("Preço de Compra");
  if (!produtoData.preco_venda) camposFaltando.push("Preço de Venda");
  if (!produtoData.unidade_estoque_id) camposFaltando.push("Unidade de Estoque");
  if (!produtoData.quantidade_estoque) camposFaltando.push("Quantidade em Estoque");

  // Se algum campo obrigatório estiver faltando
  if (camposFaltando.length > 0) {
      alertMsg(`Todos os campos obrigatórios devem ser preenchidos. Faltando: ${camposFaltando.join(", ")}`, 'info');
      return;
  }

  // Caso todos os campos obrigatórios estejam preenchidos
  await postNewProdutoWithImage(produtoData, file);

  // console.log('Dados do Produto Enviados:', produtoData);
});

function limparCampos() {
  setTimeout(() => {
    // Recarregar a página 
    location.reload();
}, 2000);
};


const filterButtonLimparAlterar = document.getElementById('limparButton');

filterButtonLimparAlterar.addEventListener('click',()=>{
    location.reload();
  })

  

