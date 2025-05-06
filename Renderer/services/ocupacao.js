const ocupacoes = [
    { value: "", text: "Selecione:" },
    { value: "administrador", text: "Administrador" },
    { value: "advogado", text: "Advogado" },
    { value: "agricultor", text: "Agricultor" },
    { value: "analista_sistemas", text: "Analista de Sistemas" },
    { value: "arquiteto", text: "Arquiteto" },
    { value: "artesao", text: "Artesão" },
    { value: "atendente", text: "Atendente" },
    { value: "autonomo", text: "Autônomo" },
    { value: "bancario", text: "Bancário" },
    { value: "caminhoneiro", text: "Caminhoneiro" },
    { value: "carpinteiro", text: "Carpinteiro" },
    { value: "comerciante", text: "Comerciante" },
    { value: "construtor", text: "Construtor" },
    { value: "contador", text: "Contador" },
    { value: "cozinheiro", text: "Cozinheiro" },
    { value: "desenvolvedor", text: "Desenvolvedor" },
    { value: "eletricista", text: "Eletricista" },
    { value: "encanador", text: "Encanador" },
    { value: "engenheiro", text: "Engenheiro" },
    { value: "enfermeiro", text: "Enfermeiro" },
    { value: "esteticista", text: "Esteticista" },
    { value: "estudante", text: "Estudante" },
    { value: "farmaceutico", text: "Farmacêutico" },
    { value: "faxineiro", text: "Faxineiro" },
    { value: "funcionario_publico", text: "Funcionário Público" },
    { value: "garcom", text: "Garçom" },
    { value: "gerente", text: "Gerente" },
    { value: "jardineiro", text: "Jardineiro" },
    { value: "jornalista", text: "Jornalista" },
    { value: "marceneiro", text: "Marceneiro" },
    { value: "mecanico", text: "Mecânico" },
    { value: "medico", text: "Médico" },
    { value: "motorista", text: "Motorista" },
    { value: "operador_maquinas", text: "Operador de Máquinas" },
    { value: "pedreiro", text: "Pedreiro" },
    { value: "pintor", text: "Pintor" },
    { value: "policial", text: "Policial" },
    { value: "professor", text: "Professor" },
    { value: "programador", text: "Programador" },
    { value: "recepcionista", text: "Recepcionista" },
    { value: "secretaria", text: "Secretária" },
    { value: "seguranca", text: "Segurança" },
    { value: "servicos_gerais", text: "Serviços Gerais" },
    { value: "soldador", text: "Soldador" },
    { value: "tecnico_informatica", text: "Técnico em Informática" },
    { value: "vendedor", text: "Vendedor" },
    { value: "veterinario", text: "Veterinário" },
    { value: "outro", text: "Outro" }
];

function preencherSelect(idSelect) {
    const select = document.getElementById(idSelect);
    if (!select) return;

    ocupacoes.forEach(ocupacao => {
        const option = document.createElement("option");
        option.value = ocupacao.value;
        option.textContent = ocupacao.text;
        select.appendChild(option);
    });
}

preencherSelect("ocupacao");

