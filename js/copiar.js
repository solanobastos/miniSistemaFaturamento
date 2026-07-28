async function copiarTabela(tipo) {

    switch (tipo) {

        case "base":
            return copiarBase();

        case "policlinica":
            return copiarPoliclinica();

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

    let texto = "";

    let total = 0;

    agendaGerada.forEach(item => {

        const valor = valoresParticular[item.especialidade] || item.valor || 0;

        total += valor;

        texto +=
            item.data.toLocaleDateString("pt-BR") + "\t" +
            item.especialidade + "\t" +
            valor.toFixed(2).replace(".", ",") + "\n";

    });

    texto += "\n";
    texto += "TOTAL\t\t";
    texto += total.toFixed(2).replace(".", ",");

    await navigator.clipboard.writeText(texto);

    alert("Dados copiados com sucesso!");

}

async function copiarPacotes() {

    let texto = "";

    const frequencia = calcularFrequenciaSemanal();

    const pacotes = {

        1: 189.90,
        2: 309.90,
        3: 459.90,
        4: 609.90

    };

    const mensalidade = pacotes[frequencia] || 0;

    const valorAtendimentos = agendaGerada.length * 69.90;

    const total = mensalidade + valorAtendimentos;

    agendaGerada.forEach(item => {

        texto +=
            item.data.toLocaleDateString("pt-BR") + "\t" +
            item.especialidade + "\t" +
            "69,90\n";

    });

    texto += "\n";

    texto +=
        "Mensalidade\t\t" +
        mensalidade.toFixed(2).replace(".", ",") +
        "\n";

    texto +=
        "Atendimentos\t\t" +
        valorAtendimentos.toFixed(2).replace(".", ",") +
        "\n";

    texto +=
        "TOTAL\t\t" +
        total.toFixed(2).replace(".", ",");

    await navigator.clipboard.writeText(texto);

    alert("Dados copiados com sucesso!");

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