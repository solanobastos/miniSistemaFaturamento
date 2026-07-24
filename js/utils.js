function criarTabela(colunas, linhas) {

    let html = `
    <table>
        <thead>
            <tr>
    `;

    colunas.forEach(coluna => {
        html += `<th>${coluna}</th>`;
    });

    html += `
            </tr>
        </thead>
        <tbody>
    `;

    linhas.forEach(linha => {

        html += "<tr>";

        linha.forEach(celula => {

            html += `<td>${celula}</td>`;

        });

        html += "</tr>";

    });

    html += `
        </tbody>
    </table>
    `;

    return html;

}

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"

    });

}

function formatarData(data) {

    return data.toLocaleDateString("pt-BR");

}

function criarBotaoCopiar(funcao) {

    return `
<button
class="btnCopiar"
onclick="${funcao}">
📋 Copiar
</button>
`;

}

function criarTabela(colunas, linhas) {

    let html = "<table>";

    html += "<thead><tr>";

    colunas.forEach(coluna => {

        html += `<th>${coluna}</th>`;

    });

    html += "</tr></thead>";

    html += "<tbody>";

    linhas.forEach(linha => {

        html += "<tr>";

        linha.forEach(valor => {

            html += `<td>${valor}</td>`;

        });

        html += "</tr>";

    });

    html += "</tbody>";

    html += "</table>";

    return html;

}

function criarTabelaEditavel(colunas, linhas) {

    let html = "<table>";

    html += "<thead><tr>";

    colunas.forEach(coluna => {

        html += `<th>${coluna}</th>`;

    });

    html += "<th>Ações</th>";

    html += "</tr></thead>";

    html += "<tbody>";

    linhas.forEach((linha, indice) => {

        html += "<tr>";

        linha.forEach(valor => {

            html += `<td>${valor}</td>`;

        });

        html += `
            <td style="white-space: nowrap; text-align:center;">

                <button class="btnEditar" onclick="editarAtendimento(${indice})">✏️</button>

                <button class="btnExcluir" onclick="excluirAtendimento(${indice})">🗑️</button>

            </td>
        `;

        html += "</tr>";

    });

    html += "</tbody>";

    html += "</table>";

    return html;

}

function criarBotaoAdicionar() {

    return `
<button
class="btnAdicionarRelatorio"
onclick="abrirNovoAtendimento()">
➕ Adicionar Atendimento
</button>
`;

}