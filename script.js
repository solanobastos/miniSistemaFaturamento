const dias = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado"
];

const duracoes = [
    45,
    50,
    60
];

const especialidades = [
    "Psicologia",
    "Fonoaudiologia",
    "Terapia Ocupacional",
    "Psicopedagogia",
    "Fisioterapia",
    "Musicoterapia",
    "Nutrição",
    "ABA"
];

const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];

let agendaGerada = [];

const tabela = document.getElementById("tabelaRotinas");

const selectMes = document.getElementById("mes");

const selectAno = document.getElementById("ano");

meses.forEach((mes, indice) => {

    selectMes.innerHTML += `<option value="${indice}">${mes}</option>`;

});

const anoAtual = new Date().getFullYear();

for (let ano = 2026; ano <= 2035; ano++) {

    selectAno.innerHTML += `<option value="${ano}">${ano}</option>`;

}

document
    .getElementById("btnAdicionar")
    .addEventListener("click", adicionarLinha);

document
    .getElementById("btnGerar")
    .addEventListener("click", gerarFicha);

function adicionarLinha() {

    const tr = document.createElement("tr");

    tr.innerHTML = `

    <td>

        <select>

            ${dias.map(d => `<option>${d}</option>`).join("")}

        </select>

    </td>

    <td>

        <input type="time">

    </td>

    <td>

        <select>

            ${duracoes.map(d => `<option>${d}</option>`).join("")}

        </select>

    </td>

    <td>

        <select>

            ${especialidades.map(e => `<option>${e}</option>`).join("")}

        </select>

    </td>

    <td>

        <button class="remover">

            X

        </button>

    </td>

    `;

    tr.querySelector(".remover").onclick = () => {

        tr.remove();

    };

    tabela.appendChild(tr);

}

adicionarLinha();

const diasNumero = {

    "Domingo": 0,
    "Segunda": 1,
    "Terça": 2,
    "Quarta": 3,
    "Quinta": 4,
    "Sexta": 5,
    "Sábado": 6

};

function gerarDatasSemana(diaSemana, mes, ano) {

    const datas = [];

    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    for (let dia = 1; dia <= ultimoDia; dia++) {

        const data = new Date(ano, mes, dia);

        if (data.getDay() == diaSemana) {

            datas.push(data);

        }

    }

    return datas;

}

function calcularHoraFinal(inicio, duracao) {

    const partes = inicio.split(":");

    const data = new Date();

    data.setHours(Number(partes[0]));
    data.setMinutes(Number(partes[1]));

    data.setMinutes(data.getMinutes() + Number(duracao));

    return data.toLocaleTimeString("pt-BR", {

        hour: "2-digit",

        minute: "2-digit"

    });

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

        const hora = linha.querySelector("input").value;

        if (hora == "") return;

        const dia = selects[0].value;

        const duracao = Number(selects[1].value);

        const especialidade = selects[2].value;

        const datas = gerarDatasSemana(

            diasNumero[dia],

            mes,

            ano

        );

        datas.forEach(data => {

            agendaGerada.push({

                data,

                inicio: hora,

                fim: calcularHoraFinal(hora, duracao),

                duracao,

                especialidade

            });

        });

    });
    agendaGerada.sort((a, b) => {

        if (a.data - b.data != 0) {

            return a.data - b.data;

        }

        return a.inicio.localeCompare(b.inicio);

    });

    switch (convenio) {

        case "Base Aerea":

            mostrarBaseAerea();

            break;

        case "Policlinica":

            mostrarPoliclinica();

            break;

        case "Judicial":

            mostrarJudicial();

            break;

        case "SulAmerica":

            mostrarSulAmerica();

            break;

        default:

            mostrarBaseAerea();

    }

}

function mostrarBaseAerea() {

    const resultado = document.getElementById("resultado");

    let html = `

    <table>

    <thead>

    <tr>

        <th>Data</th>

        <th>Especialidade</th>

    </tr>

    </thead>

    <tbody>

    `;

    agendaGerada.forEach(item => {

        html += `

        <tr>

            <td>${item.data.toLocaleDateString("pt-BR")}</td>

            <td>${item.especialidade}</td>

        </tr>

        `;

    });

    html += `

    </tbody>

    </table>

    <br>

    <button onclick="copiarTabela('base')">

        📋 Copiar

    </button>

    `;

    resultado.innerHTML = html;

}

function mostrarPoliclinica() {

    const resultado = document.getElementById("resultado");

    let html = `

    <table>

    <thead>

    <tr>

        <th>Data</th>

        <th>Horário</th>

        <th>Duração</th>

        <th>Especialidade</th>

    </tr>

    </thead>

    <tbody>

    `;

    agendaGerada.forEach(item => {

        html += `

        <tr>

            <td>${item.data.toLocaleDateString("pt-BR")}</td>

            <td>${item.inicio} às ${item.fim}</td>

            <td>${item.duracao} min</td>

            <td>${item.especialidade}</td>

        </tr>

        `;

    });

    html += `

    </tbody>

    </table>

    <br>

    <button onclick="copiarTabela('policlinica')">

        📋 Copiar

    </button>

    `;

    resultado.innerHTML = html;

}

function mostrarJudicial() {

    const resultado = document.getElementById("resultado");

    let html = `

    <table>

    <thead>

    <tr>

        <th>Data</th>

        <th>Hora Inicial</th>

        <th>Hora Final</th>

    </tr>

    </thead>

    <tbody>

    `;

    agendaGerada.forEach(item => {

        html += `

        <tr>

            <td>${item.data.toLocaleDateString("pt-BR")}</td>

            <td>${item.inicio}</td>

            <td>${item.fim}</td>

        </tr>

        `;

    });

    html += `

    </tbody>

    </table>

    <br>

    <button onclick="copiarTabela('judicial')">

        📋 Copiar

    </button>

    `;

    resultado.innerHTML = html;

}

function mostrarSulAmerica() {

    mostrarBaseAerea();

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

        }

    });

    await navigator.clipboard.writeText(texto);

    alert("Dados copiados com sucesso!");
}