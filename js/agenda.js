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