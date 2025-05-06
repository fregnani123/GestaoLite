getUser();
const divCupon = document.querySelector('.cupom');
const imgLogo = document.querySelector('.imgLogo');

function formatarDataISO(dataISO) {
    const data = new Date(dataISO);
    const agora = new Date();
    data.setHours(agora.getHours(), agora.getMinutes());
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

function decode(encoded) {
    try {
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
        if (!decoded.startsWith("fgl") || !decoded.endsWith("1969")) {
            throw new Error("Formato inválido");
        }
        const trimmed = decoded.slice(3, -4);
        const reversed = trimmed.split('').reverse().join('');
        const parts = reversed.split('.');
        if (parts.length >= 3) {
            parts.splice(1, 1);
        }
        return parts.join('.');
    } catch (err) {
        return "Erro ao decodificar: " + err.message;
    }
}

function formatarValorReal(valor) {
    return parseFloat(valor).toFixed(2).replace('.', ',');
}

async function getUltimoPedidoImprimirFolha(venda_id, numero_pedido_imprimir) {
    const urlVenda = `http://localhost:3000/getVendaPorNumeroPedido/${numero_pedido_imprimir}`;
    const urlCliente = `http://localhost:3000/getCrediarioVenda/${venda_id}`;

    try {
        const [resClienteCred, resVenda] = await Promise.all([
            fetch(urlCliente, {
                method: 'GET',
                headers: {
                    'x-api-key': 'segredo123',
                    'Content-Type': 'application/json',
                }
            }),
            fetch(urlVenda, {
                method: 'GET',
                headers: {
                    'x-api-key': 'segredo123',
                    'Content-Type': 'application/json',
                }
            })
        ]);

        if (!resVenda.ok) {
            alertMsg('Erro ao buscar dados do crediário ou venda.', 'info', 4000);
            return;
        }

        const clienteData = await resClienteCred.json();
        const vendaData = await resVenda.json();

        if (divCupon.style.display === 'none' || divCupon.style.display === '') {
            divCupon.style.display = 'block';
        }

        const data = vendaData;
        const cpfDecod = decode(data[0].cpf);

        const nomeFantasia = nomeFantasiaUser;
        const ramoAtuacao = ramoAtuacaoUser;
        const endereco = `${enderecoUser} - ${numeroUser}, ${bairroUser} - ${cidadeUser}/${ufUser}`;
        const contato = contatoUser;
        const cnpj = cnpjCpfDecoded;
        const cliente = data[0].cliente_nome;
        const CPF = cpfDecod;
        const dataVenda = formatarDataISO(data[0].data_venda);
        const numeroVenda = data[0].numero_pedido;
        const naoFiscal = 'Não é documento Fiscal';
        const cuponDesconto = data[0].desconto_venda;
        const totalNota = formatarValorReal(data[0].total_liquido);
        const slogan = sloganUser;
        const cep = cepUser;
        const redeSocial = redeSocialUser;
        const formaPgto = data[0].tipo_pagamento;
        const valorRecebido = formaPgto.trim() === 'Crediário' ? '(Crediário Loja)' : formatarValorReal(data[0].valor_recebido);
        const troco = formatarValorReal(data[0].troco);

        // Exibe ou esconde vencimentos conforme o tipo de pagamento
        const vencimentosDiv = document.querySelector('.carne-cred');
        vencimentosDiv.innerHTML = ''; // Limpa conteúdo anterior

        if (formaPgto.trim() === 'Crediário') {
            if (Array.isArray(clienteData) && clienteData.length > 0) {
                vencimentosDiv.style.display = 'block';

                // Cria o título só uma vez
                const titulo = document.createElement('h4');
                titulo.classList.add('tituloCred')
                titulo.textContent = 'Vencimentos das Parcelas (Crediário)';
                titulo.style.marginBottom = '8px'; // opcional
                vencimentosDiv.appendChild(titulo);

                // Agora sim, adiciona as parcelas
                clienteData.forEach(parcela => {
                    const divParcela = document.createElement('div');
                    divParcela.classList.add('parcela-info');
                    divParcela.innerHTML = `
                <span>Parcela ${parcela.parcela_numero}:</span>
                <span>R$ ${formatarValorReal(parcela.valor_parcela)}</span>
                <span>Vencimento: ${formatarDataISOCupom(parcela.data_vencimento)}</span>
            `;
                    vencimentosDiv.appendChild(divParcela);
                });
            } else {
                vencimentosDiv.style.display = 'block';
                vencimentosDiv.innerHTML = '<span></span>';
            }
        } else {
            vencimentosDiv.style.display = 'none';
        }

        // SEMPRE atualize os campos do cupom independentemente do tipo de pagamento
        document.querySelector('.titulo-cupom').textContent = nomeFantasia;
        document.querySelector('#razaoSocial').textContent = ramoAtuacao;
        document.querySelector('#cep').textContent = `CEP: ${cep}`;
        document.querySelector('#endereco').textContent = endereco;
        document.querySelector('#contato').textContent = contato;
        document.querySelector('#cnpj').textContent = `CNPJ: ${cnpj}`;
        document.querySelector('.dados #cliente').textContent = cliente;
        document.querySelector('.dados #CPFCli').textContent = CPF;
        document.querySelector('.dados #dataVenda').textContent = dataVenda;
        document.querySelector('.dados #numeroVenda').textContent = numeroVenda;
        document.querySelector('.dados #naoFiscal').textContent = naoFiscal;
        document.querySelector('.total #cuponDesconto').textContent = `${cuponDesconto}%`;
        document.querySelector('.total #totalNota').textContent = totalNota;
        document.querySelector('.total #valorRecebidoCupom').textContent = valorRecebido;
        document.querySelector('.total #trocoCupom').textContent = troco;
        document.querySelector('.total #formaPgto').textContent = formaPgto;
        document.querySelector('.text-slogan').textContent = slogan;
        document.querySelector('.redeSocial').textContent = redeSocial;

        // Itens da venda
        const listaItens = document.querySelector('#listaItens');
        listaItens.innerHTML = ''; // limpa antes de adicionar
        data.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item-venda');
        
            // Construir a descrição completa
            let descricao = item.produto_nome;
        
            if (item.nome_cor_produto?.trim()) {
                descricao += ` ${item.nome_cor_produto}`;
            }
        
            if (item.tamanho_letras?.trim()) {
                descricao += ` ${item.tamanho_letras}`;
            }
        
            if (item.tamanho_numero?.trim()) {
                descricao += ` tam.${item.tamanho_numero}`;
            }
        
            if (item.medida_volume?.trim()) {
                descricao += ` ${item.medida_volume_qtd || ''}${item.medida_volume}`;
            }
        
            if (item.unidade_massa?.trim()) {
                descricao += ` ${item.unidade_massa_qtd || ''}${item.unidade_massa}`;
            }
        
            if (item.unidade_comprimento?.trim()) {
                descricao += ` ${item.unidade_comprimento_qtd || ''}${item.unidade_comprimento}`;
            }
        
            itemDiv.innerHTML = `
                <span>${item.codigo_ean}</span>
                <span>${descricao}</span>
                <span>${item.quantidade}${item.unidade_estoque_nome} x ${formatarValorReal(item.preco)}</span>
            `;
        
            listaItens.appendChild(itemDiv);
        });
        

    } catch (error) {
        console.error('Erro ao buscar informações:', error);
    }
}
