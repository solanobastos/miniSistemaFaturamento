let valoresParticular = {};

let agendaGerada = [];

const tabela = document.getElementById("tabelaRotinas");

const selectMes = document.getElementById("mes");

const selectAno = document.getElementById("ano");

let indiceEdicao = -1;

let modoEdicao = false;

const CONVENIOS = {

    base: mostrarBaseAerea,

    policlinica: mostrarPoliclinica,

    judicial: mostrarJudicial,

    sulamerica: mostrarSulAmerica,

    particular: mostrarFormularioValores,

    pacotes: mostrarPacotes

};

CONFIG.MESES.forEach((mes, indice) => {

    selectMes.innerHTML += `<option value="${indice}">${mes}</option>`;

});

const anoAtual = new Date().getFullYear();

for (

    let ano = CONFIG.ANO_INICIAL;

    ano <= CONFIG.ANO_INICIAL + CONFIG.ANOS_FUTUROS;

    ano++

) {

    selectAno.innerHTML += `<option>${ano}</option>`;

}
document
    .getElementById("btnAdicionar")
    .addEventListener("click", adicionarLinha);

document
    .getElementById("btnGerar")
    .addEventListener("click", gerarFicha);

function adicionarLinha() {

    const convenio =
        document.getElementById("convenio").value;

    switch (convenio) {

        case "judicial":

            adicionarLinhaJudicial();

            break;

        case "policlinica":

            adicionarLinhaCompleta();

            break;

        default:

            adicionarLinhaSimples();

    }

}

function adicionarLinhaSimples() {

    const tr = document.createElement("tr");

    tr.innerHTML = `

        <td>

            <select>

                ${CONFIG.DIAS.map(d => `<option>${d}</option>`).join("")}

            </select>

        </td>

        <td>

            <select>

                ${CONFIG.ESPECIALIDADES.map(e => `<option>${e}</option>`).join("")}

            </select>

        </td>

        <td>

<button class="btnExcluir remover">
🗑️
</button>

        </td>

    `;

    tr.querySelector(".remover").onclick = () => {

        tr.remove();

    };

    tabela.appendChild(tr);

}

function adicionarLinhaCompleta() {

    const tr = document.createElement("tr");

    tr.innerHTML = `

        <td>

            <select>

                ${CONFIG.DIAS.map(d => `<option>${d}</option>`).join("")}

            </select>

        </td>

        <td>

            <input type="time">

        </td>

        <td>

            <select>

                ${CONFIG.DURACOES.map(d => `<option>${d}</option>`).join("")}

            </select>

        </td>

        <td>

            <select>

                ${CONFIG.ESPECIALIDADES.map(e => `<option>${e}</option>`).join("")}

            </select>

        </td>

        <td>

<button class="btnExcluir remover">
🗑️
</button>

        </td>

    `;

    tr.querySelector(".remover").onclick = () => {

        tr.remove();

    };

    tabela.appendChild(tr);

}

function gerarFicha() {

    const resultado = document.getElementById("resultado");

    const convenio = document.getElementById("convenio").value;

    resultado.innerHTML = "";

    agendaGerada = [];

    const mes = Number(selectMes.value);

    const ano = Number(selectAno.value);

    const linhas = document.querySelectorAll("#tabelaRotinas tr");

    linhas.forEach(linha => {

        const selects = linha.querySelectorAll("select");

        const inputHora = linha.querySelector("input");

        const linhaCompleta = inputHora !== null;

        let dia;
        let hora = "";
        let duracao = 0;
        let especialidade;

        if (linhaCompleta) {

            dia = selects[0].value;

            hora = inputHora.value;

            duracao = Number(selects[1].value);

            if (convenio == "judicial") {

                especialidade = "";

            } else {

                especialidade = selects[2].value;

            }

            if (hora === "") {

                alert("Informe o horário do atendimento.");

                return;

            }

        } else {

            dia = selects[0].value;

            especialidade = selects[1].value;

        }

        const precisaHorario =
            convenio === "policlinica" ||
            convenio === "judicial";

        if (precisaHorario && hora === "") {

            alert("Informe o horário dos atendimentos.");

            return;

        }

        const datas = gerarDatasSemana(

            diasNumero[dia],

            mes,

            ano

        );

        datas.forEach(data => {

            agendaGerada.push({

                data,

                inicio: linhaCompleta ? hora : "",

                fim: linhaCompleta ? calcularHoraFinal(hora, duracao) : "",

                duracao: linhaCompleta ? duracao : "",

                especialidade,

                valor: CONFIG.VALORES_ESPECIALIDADE[especialidade] || 0

            });

        });

    });

    agendaGerada.sort((a, b) => {

        if (a.data - b.data != 0) {

            return a.data - b.data;

        }

        return a.inicio.localeCompare(b.inicio);

    });

    atualizarRelatorio();

}

function atualizarRelatorio() {

    const convenio = document.getElementById("convenio").value;

    const funcao = CONVENIOS[convenio];

    if (funcao) {

        funcao();

    }

}

const convenio = document.getElementById("convenio");

convenio.addEventListener("change", () => {

    tabela.innerHTML = "";

    adicionarLinha();

    atualizarCamposConvenio();

});

atualizarCamposConvenio();

adicionarLinha();

function atualizarCamposConvenio() {

    const mostrarHorario =
        convenio.value === "policlinica" ||
        convenio.value === "judicial";

    document.querySelectorAll(".colHora").forEach(td => {
        td.style.display = mostrarHorario ? "" : "none";
    });

    document.querySelectorAll(".colDuracao").forEach(td => {
        td.style.display = mostrarHorario ? "" : "none";
    });

    document.getElementById("configConvenio").style.display = "none";

    document.getElementById("campoPacote").style.display = "none";

    switch (convenio.value) {

        case "particular":

            document.getElementById("configConvenio").style.display = "block";

            break;

        case "pacotes":

            document.getElementById("configConvenio").style.display = "block";

            document.getElementById("campoPacote").style.display = "block";

            break;

    }

}

function montarCamposValoresEspecialidades() {

    const div = document.getElementById("configValoresEspecialidades");

    // Salva os valores digitados
    const valores = {};

    document.querySelectorAll(".valorEspecialidade").forEach(input => {

        valores[input.dataset.especialidade] = input.value;

    });

    div.innerHTML = "";

    const especialidades = obterEspecialidadesUnicas();

    especialidades.forEach(especialidade => {

        const valor =

            valores[especialidade]

            ||

            CONFIG.VALORES_ESPECIALIDADE[especialidade]

            ||

            0;

        div.innerHTML += `

            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">

                <label style="width:180px;">

                    ${especialidade}

                </label>

                <input

                    type="number"

                    class="valorEspecialidade"

                    data-especialidade="${especialidade}"

                    value="${valor}"

                    step="0.01"

                >

            </div>

        `;

    });

}

function calcularFrequenciaSemanal() {

    return document.querySelectorAll("#tabelaRotinas tr").length;

}

function obterEspecialidadesUnicas() {

    const especialidades = [];

    const linhas = document.querySelectorAll("#tabelaRotinas tr");

    linhas.forEach(linha => {

        const selects = linha.querySelectorAll("select");

        let especialidade;

        // Linha com horário (Policlínica/Judicial)
        if (linha.querySelector("input")) {

            especialidade = selects[2].value;

        }
        // Linha simples (Base, SulAmérica, Particular, Pacotes)
        else {

            especialidade = selects[1].value;

        }

        if (
            especialidade &&
            !especialidades.includes(especialidade)
        ) {

            especialidades.push(especialidade);

        }

    });

    return especialidades;

}

function editarAtendimento(indice) {

    modoEdicao = true;

    indiceEdicao = indice;

    const atendimento = agendaGerada[indice];

    document.getElementById("tituloEdicao").innerText =
        "Editar Atendimento";

    document.getElementById("editarData").value =
        atendimento.data.toISOString().split("T")[0];

    document.getElementById("editarEspecialidade").innerHTML = "";

    CONFIG.ESPECIALIDADES.forEach(especialidade => {

        document.getElementById("editarEspecialidade").innerHTML += `
            <option value="${especialidade}">
                ${especialidade}
            </option>
        `;

    });

    const convenio = document.getElementById("convenio").value;

    document.getElementById("editarEspecialidade").value =
        atendimento.especialidade;

    if (convenio === "particular") {

        document.getElementById("editarValor").value =
            atendimento.valor;

    }

    const selectDuracao = document.getElementById("editarDuracao");

    selectDuracao.innerHTML = "";

    CONFIG.DURACOES.forEach(duracao => {

        selectDuracao.innerHTML += `
        <option value="${duracao}">
            ${duracao} min
        </option>
    `;

    });

    selectDuracao.value = atendimento.duracao;

    configurarFormulario(convenio);

    document.getElementById("painelEdicao").style.display = "block";

}

function excluirAtendimento(indice) {

    if (!confirm("Deseja excluir este atendimento?")) {

        return;

    }

    agendaGerada.splice(indice, 1);

    atualizarRelatorio();

}

function fecharPainelEdicao() {

    document.getElementById("painelEdicao").style.display = "none";

    indiceEdicao = -1;

    modoEdicao = false;

}

function abrirNovoAtendimento() {

    modoEdicao = false;

    indiceEdicao = -1;

    document.getElementById("tituloEdicao").innerText =
        "Novo Atendimento";

    document.getElementById("editarData").value = "";

    document.getElementById("editarHora").value = "";

    const select = document.getElementById("editarEspecialidade");

    select.innerHTML = "";

    CONFIG.ESPECIALIDADES.forEach(especialidade => {

        select.innerHTML += `
            <option value="${especialidade}">
                ${especialidade}
            </option>
        `;

    });

    const selectDuracao = document.getElementById("editarDuracao");

    selectDuracao.innerHTML = "";

    CONFIG.DURACOES.forEach(d => {

        selectDuracao.innerHTML += `
        <option value="${d}">
            ${d} minutos
        </option>
    `;

    });

    selectDuracao.value = 60;

    const convenio = document.getElementById("convenio").value;

    configurarFormulario(convenio);

    document.getElementById("painelEdicao").style.display = "block";

    configurarFormulario(convenio);

}

function salvarNovoAtendimento() {

    const convenio = document.getElementById("convenio").value;

    const data = document.getElementById("editarData").value;

    if (data === "") {

        alert("Informe a data.");

        return;

    }

    const especialidade =
        document.getElementById("editarEspecialidade").value;

    let valor = 0;

    if (convenio === "particular") {

        valor = Number(
            document.getElementById("editarValor").value.replace(",", ".")
        ) || 0;

    }
    else if (modoEdicao) {

        valor = agendaGerada[indiceEdicao].valor;

    }
    else {

        valor = CONFIG.VALORES_ESPECIALIDADE[especialidade] || 0;

    }
    const novo = {

        data: new Date(data + "T00:00:00"),

        especialidade,

        valor

    };

    if (convenio === "policlinica" || convenio === "judicial") {

        const hora = document.getElementById("editarHora").value;

        if (hora === "") {

            alert("Informe o horário.");

            return;

        }

        novo.inicio = hora;

        const duracao = Number(
            document.getElementById("editarDuracao").value
        );

        novo.duracao = duracao;

        novo.fim = calcularHoraFinal(hora, duracao);

    } else {

        novo.inicio = "";

        novo.fim = "";

        novo.duracao = "";

    }

    if (modoEdicao) {

        agendaGerada[indiceEdicao] = novo;

    } else {

        agendaGerada.push(novo);

    }

    modoEdicao = false;

    indiceEdicao = -1;

    fecharPainelEdicao();

    atualizarRelatorio();

    agendaGerada.sort((a, b) => {

        if (a.data - b.data !== 0) {

            return a.data - b.data;

        }

        return (a.inicio || "").localeCompare(b.inicio || "");

    });

    fecharPainelEdicao();

    atualizarRelatorio();

}

document
    .getElementById("btnSalvarEdicao")
    .addEventListener("click", salvarNovoAtendimento);

function configurarFormulario(convenio) {

    const grupoHora = document.getElementById("grupoHora");
    const grupoDuracao = document.getElementById("grupoDuracao");
    const grupoEspecialidade = document.getElementById("grupoEspecialidade");
    const grupoValor = document.getElementById("grupoValor");

    if (grupoHora) grupoHora.style.display = "none";
    if (grupoDuracao) grupoDuracao.style.display = "none";
    if (grupoEspecialidade) grupoEspecialidade.style.display = "none";
    if (grupoValor) grupoValor.style.display = "none";

    switch (convenio) {

        case "base":

        case "sulamerica":

        case "pacotes":

            if (grupoEspecialidade)
                grupoEspecialidade.style.display = "block";

            break;

        case "particular":

            if (grupoEspecialidade)
                grupoEspecialidade.style.display = "block";

            if (grupoValor)
                grupoValor.style.display = "block";

            break;

        case "policlinica":

            if (grupoHora)
                grupoHora.style.display = "block";

            if (grupoDuracao)
                grupoDuracao.style.display = "block";

            if (grupoEspecialidade)
                grupoEspecialidade.style.display = "block";

            break;

        case "judicial":

            if (grupoHora)
                grupoHora.style.display = "block";

            if (grupoDuracao)
                grupoDuracao.style.display = "block";

            break;

    }
}

function adicionarLinhaJudicial() {

    const tr = document.createElement("tr");

    tr.innerHTML = `

        <td>

            <select>

                ${CONFIG.DIAS.map(d => `<option>${d}</option>`).join("")}

            </select>

        </td>

        <td>

            <input type="time">

        </td>

        <td>

            <select>

                ${CONFIG.DURACOES.map(d => `<option>${d}</option>`).join("")}

            </select>

        </td>

        <td>

            <button class="remover">

                🗑

            </button>

        </td>

    `;

    tr.querySelector(".remover").onclick = () => {

        tr.remove();

    };

    tabela.appendChild(tr);

}

const btnTema = document.getElementById("btnTema");

btnTema.onclick = () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        btnTema.innerHTML = "☀️";

    } else {

        btnTema.innerHTML = "🌙";

    }

}