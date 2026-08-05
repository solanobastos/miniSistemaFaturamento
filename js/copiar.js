async function copiarTabela(tipo) {

    switch (tipo) {

        case "base":
            return copiarBase();

        case "policlinica":
            return copiarPoliclinica();

        case "sulamerica":
            return copiarSulAmerica();

        case "judicial":
            return copiarJudicial();

        case "particular":
            return copiarParticular();

        case "pacotes":
            return copiarPacotes();
    }

}

async function copiarPoliclinica() {

    let texto = "";

    agendaGerada.forEach(item => {

        texto +=
            item.data.toLocaleDateString("pt-BR") + "\t" +
            `${item.inicio}hs às ${item.fim}hs\t` +
            `${item.duracao} min.\t` +
            `${item.especialidade}\n`;

    });

    await navigator.clipboard.writeText(texto);

    alert("Dados copiados para Policlínica!");

}

async function copiarBase() {

    let texto = "";

    agendaGerada.forEach((item, indice) => {

        texto +=
            item.data.toLocaleDateString("pt-BR")
            + "\t"      // B
            + "\t"      // C
            + "\t"      // D
            + "\t"      // E
            + "\t"
            + item.especialidade // F
            + "\n";

        // A cada 13 atendimentos pula 7 linhas
        if ((indice + 1) % 13 === 0) {

            texto += "\n".repeat(7);

        }

    });

    await navigator.clipboard.writeText(texto);

    alert("Dados copiados para Base Aérea!");

}

async function copiarParticular() {

    let texto = "Olá, segue valores em aberto sobre o mês passado:\n\n";

    let total = 0;

    const resumo = {};

    agendaGerada.forEach(item => {

        const valor = valoresParticular[item.especialidade] || item.valor || 0;

        total += valor;

        texto +=
            item.data.toLocaleDateString("pt-BR") +
            "    " +
            item.especialidade +
            "\n";

        if (!resumo[item.especialidade]) {

            resumo[item.especialidade] = {
                quantidade: 0,
                valor: valor
            };

        }

        resumo[item.especialidade].quantidade++;

    });

    texto += "\n";

    texto += "Resumo por especialidade:\n";

    for (const especialidade in resumo) {

        const qtd = resumo[especialidade].quantidade;

        const valor = resumo[especialidade].valor;

        texto +=
            `${especialidade} (${qtd} sessões) = R$ ${(qtd * valor).toFixed(2).replace(".", ",")}\n`;

    }

    texto += "\n";

    texto +=
        `Valor Total = R$ ${total.toFixed(2).replace(".", ",")}\n\n`;

    texto +=
        "Chave pix (CNPJ): 36032223000188";

    await navigator.clipboard.writeText(texto);

    alert("Mensagem copiada!");

}

async function copiarPacotes() {

    let texto = "Olá, segue valores em aberto sobre o mês passado:\n\n";

    const frequencia = calcularFrequenciaSemanal();

    const pacotes = {

        1: 189.90,
        2: 309.90,
        3: 459.90,
        4: 609.90

    };

    const mensalidade = pacotes[frequencia] || 0;

    const valorSessao = 69.90;

    const valorAtendimentos = agendaGerada.length * valorSessao;

    const total = mensalidade + valorAtendimentos;

    agendaGerada.forEach(item => {

        texto +=
            item.data.toLocaleDateString("pt-BR") +
            "    " +
            item.especialidade +
            "\n";

    });

    texto += "\n";

    texto +=
        `Mensalidade = R$ ${mensalidade.toFixed(2).replace(".", ",")}\n`;

    texto +=
        `Atendimentos = R$ ${valorAtendimentos.toFixed(2).replace(".", ",")}\n`;

    texto +=
        `Valor Total = R$ ${total.toFixed(2).replace(".", ",")}\n\n`;

    texto +=
        "Chave pix (CNPJ): 36032223000188";

    await navigator.clipboard.writeText(texto);

    alert("Mensagem copiada!");

}

async function copiarJudicial() {

    let texto = "";

    agendaGerada.forEach(item => {

        texto +=
            item.data.toLocaleDateString("pt-BR") + "\t" +
            item.inicio + "\t" +
            item.fim + "\n";

    });

    await navigator.clipboard.writeText(texto);

    alert("Dados copiados para Judicial!");

}

async function copiarSulAmerica() { 

    let texto = "";

    agendaGerada.forEach((item, indice) => {

        texto +=
            item.data.toLocaleDateString("pt-BR")
            + "\t"
            + item.especialidade
            + "\n";

        // A cada bloco de 14 atendimentos
        if ((indice + 1) % 14 === 0) {

            // pula 10 linhas
            texto += "\n".repeat(9);

        }

    });

    await navigator.clipboard.writeText(texto);

    alert("Dados copiados para SulAmérica!");

}