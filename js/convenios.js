function mostrarBaseAerea() {

    const resultado = document.getElementById("resultado");

    const linhas = [];

    agendaGerada.forEach(item => {

        linhas.push([

            formatarData(item.data),

            item.especialidade

        ]);

    });

    let html = criarTabelaEditavel(

        [

            "Data",

            "Especialidade"

        ],

        linhas

    );

    html += `
<div class="botoesRelatorio">
`;

    html += criarBotaoAdicionar();

    html += criarBotaoCopiar("copiarBase()");

    html += `
</div>
`;

    resultado.innerHTML = html;

}

function mostrarPoliclinica() {

    const resultado = document.getElementById("resultado");

    const linhas = [];

    agendaGerada.forEach(item => {

        linhas.push([

            formatarData(item.data),

            `${item.inicio} às ${item.fim}`,

            `${item.duracao} min`,

            item.especialidade

        ]);

    });

    let html = criarTabelaEditavel(

        [

            "Data",

            "Horário",

            "Duração",

            "Especialidade"

        ],

        linhas

    );

    html += criarBotaoAdicionar();

    html += criarBotaoCopiar("copiarPoliclinica()");

    resultado.innerHTML = html;

}

function mostrarJudicial() {

    const resultado = document.getElementById("resultado");

    const linhas = [];

    agendaGerada.forEach(item => {

        linhas.push([

            formatarData(item.data),

            item.inicio,

            item.fim

        ]);

    });

    let html = criarTabelaEditavel(

        [

            "Data",

            "Hora Inicial",

            "Hora Final"

        ],

        linhas

    );

    html += criarBotaoAdicionar();

    html += criarBotaoCopiar("copiarTabela('judicial')");

    resultado.innerHTML = html;

}

function mostrarSulAmerica() {

    const resultado = document.getElementById("resultado");

    const linhas = [];

    agendaGerada.forEach(item => {

        linhas.push([

            formatarData(item.data),

            item.especialidade

        ]);

    });

    let html = criarTabelaEditavel(

        [

            "Data",

            "Especialidade"

        ],

        linhas

    );

    html += criarBotaoAdicionar();

    html += criarBotaoCopiar("copiarTabela('sulamerica')");

    resultado.innerHTML = html;

}

function mostrarParticular() {

    const resultado = document.getElementById("resultado");

    let total = 0;

    const linhas = [];

    const resumo = {};

    agendaGerada.forEach(item => {

        total += item.valor;

        linhas.push([

            formatarData(item.data),

            item.especialidade,

            formatarMoeda(item.valor)

        ]);

        if (!resumo[item.especialidade]) {

            resumo[item.especialidade] = {

                quantidade: 0,

                valor: item.valor

            };

        }

        resumo[item.especialidade].quantidade++;

    });

    let html = criarTabelaEditavel(

        [

            "Data",

            "Especialidade",

            "Valor"

        ],

        linhas

    );

    html += "<br>";

    html += "<h3>Total: " + formatarMoeda(total) + "</h3>";

    html += "<hr>";

    html += "<h4>Resumo por especialidade</h4>";

    for (const especialidade in resumo) {

        const qtd = resumo[especialidade].quantidade;

        const valor = resumo[especialidade].valor;

        html += `

            <p>

                ${especialidade}

                (${qtd} sessões)

                =

                ${formatarMoeda(qtd * valor)}

            </p>

        `;

    }

    html += criarBotaoAdicionar();

    html += criarBotaoCopiar("copiarTabela('particular')");

    resultado.innerHTML = html;

}

function mostrarPacotes() {

    const resultado = document.getElementById("resultado");

    const pacoteSelecionado = Number(
        document.getElementById("pacoteContratado").value
    );

    const mensalidade =
        CONFIG.PACOTES[pacoteSelecionado] || 0;

    const atendimentos = agendaGerada.length;

    const valorAtendimentos =
        atendimentos * CONFIG.VALOR_ATENDIMENTO_PACOTE;

    const total =
        mensalidade + valorAtendimentos;

    const linhas = [];

    agendaGerada.forEach(item => {

        linhas.push([

            formatarData(item.data),

            item.especialidade,

            formatarMoeda(CONFIG.VALOR_ATENDIMENTO_PACOTE)

        ]);

    });

    let html = criarTabelaEditavel(

        [

            "Data",

            "Especialidade",

            "Valor"

        ],

        linhas

    );

    html += `

        <br>

        <p><b>Pacote contratado:</b> ${pacoteSelecionado}</p>

        <p><b>Mensalidade:</b> ${formatarMoeda(mensalidade)}</p>

        <p><b>Quantidade de atendimentos:</b> ${atendimentos}</p>

        <p><b>Atendimentos:</b> ${formatarMoeda(valorAtendimentos)}</p>

        <h3>TOTAL: ${formatarMoeda(total)}</h3>

    `;

    html += criarBotaoAdicionar();

    html += criarBotaoCopiar("copiarTabela('pacotes')");

    resultado.innerHTML = html;

}

function mostrarFormularioValores() {

    const resultado = document.getElementById("resultado");

    const especialidades = obterEspecialidadesUnicas();

    let html = `
        <h3>Informe o valor de cada especialidade</h3>

        <table>

            <tr>

                <th>Especialidade</th>

                <th>Valor (R$)</th>

            </tr>
    `;

    especialidades.forEach(especialidade => {

        html += `

            <tr>

                <td>${especialidade}</td>

                <td>

                    <input
                        type="number"
                        class="valorEspecialidade"
                        data-especialidade="${especialidade}"
                        step="0.01"
                        min="0"
                        value="${CONFIG.VALORES_ESPECIALIDADE[especialidade] || 0}">

                </td>

            </tr>

        `;

    });

    html += `

        </table>

        <br>

        <button onclick="calcularParticular()">

            Calcular Valores

        </button>

    `;

    resultado.innerHTML = html;

}

function calcularParticular() {

    document.querySelectorAll(".valorEspecialidade").forEach(input => {

        const especialidade = input.dataset.especialidade;

        const valor = Number(
            input.value.replace(",", ".")
        ) || 0;

        agendaGerada.forEach(item => {

            if (item.especialidade === especialidade) {

                item.valor = valor;

            }

        });

    });

    mostrarParticular();

}