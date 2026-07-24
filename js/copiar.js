async function copiarParticular(){

    let texto = "";

    let total = 0;

    agendaGerada.forEach(item=>{

        const valor = valoresParticular[item.especialidade] || 0;

        total += valor;

        texto +=
            item.data.toLocaleDateString("pt-BR")
            + "\t"
            + item.especialidade
            + "\t"
            + valor.toFixed(2).replace(".",",")
            + "\n";

    });

    texto += "\n";

    texto += "TOTAL\t\t";

    texto += total.toFixed(2).replace(".",",");

    await navigator.clipboard.writeText(texto);

    alert("Dados copiados com sucesso!");

}

async function copiarTabela(tipo) {

    let texto = "";

    agendaGerada.forEach(item => {

        switch (tipo) {

            case "base":

                texto +=
                    item.data.toLocaleDateString("pt-BR") + "\t" +
                    item.especialidade + "\n";

                break;

            case "policlinica":

                texto +=
                    item.data.toLocaleDateString("pt-BR") + "\t" +
                    item.inicio + " às " + item.fim + "\t" +
                    item.duracao + " min\t" +
                    item.especialidade + "\n";

                break;

            case "judicial":

                texto +=
                    item.data.toLocaleDateString("pt-BR") + "\t" +
                    item.inicio + "\t" +
                    item.fim + "\n";

                break;

            case "particular":

                let totalParticular = 0;

                agendaGerada.forEach(item => {

                    totalParticular += item.valor;

                    texto +=
                        item.data.toLocaleDateString("pt-BR") + "\t" +
                        item.especialidade + "\t" +
                        item.valor.toFixed(2).replace(".", ",") + "\n";

                });

                texto += "\n";

                texto += "TOTAL\t\t" +
                    totalParticular.toFixed(2).replace(".", ",");

                break;

            case "pacotes":

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
                        item.especialidade + "\t69,90\n";

                });

                texto += "\n";

                texto += "Mensalidade\t\t" +
                    mensalidade.toFixed(2).replace(".", ",") + "\n";

                texto += "Atendimentos\t\t" +
                    valorAtendimentos.toFixed(2).replace(".", ",") + "\n";

                texto += "TOTAL\t\t" +
                    total.toFixed(2).replace(".", ",");

                break;

        }

    });

    await navigator.clipboard.writeText(texto);

    alert("Dados copiados com sucesso!");
}

async function copiarBase(){

    let texto = "";

    agendaGerada.forEach(item=>{

        texto +=
            item.data.toLocaleDateString("pt-BR")
            + "\t"      // Coluna A
            + "\t"      // Coluna B (mesclada)
            + "\t"      // Coluna C
            + "\t"      // Coluna D (mesclada)
            + "\t"      // Coluna E
            + item.especialidade // Coluna F
            + "\n";

    });

    await navigator.clipboard.writeText(texto);

    alert("Dados copiados para Base Aérea!");

}