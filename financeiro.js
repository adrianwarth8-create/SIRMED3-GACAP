/*************************************************
            FINANCEIRO.JS - SIRMED V4
*************************************************/

let gastos = [];

/*************************************************
            CARREGAR FINANCEIRO
*************************************************/

async function carregarGastos() {

    gastos = [];

    const snap = await getDocs(
        collection(db, "gastos")
    );

    snap.forEach(docSnap => {

        gastos.push({
            id: docSnap.id,
            ...docSnap.data()
        });

    });

}

/*************************************************
            RENDER FINANCEIRO
*************************************************/

function renderGastos() {

    const lista =
        document.getElementById("listaGastos");

    if (!lista) return;

    lista.innerHTML = "";

    if (gastos.length === 0) {

        lista.innerHTML =
            "<li>Nenhuma movimentação financeira encontrada.</li>";

        return;

    }

    gastos.forEach(gasto => {

        lista.innerHTML += `

<li>

<b>💰 ${gasto.tipo || "Movimentação"}</b><br>

👤 ${gasto.paciente || "-"}<br>

📅 ${gasto.data || "-"}<br>

Valor:
<b>${formatarMoeda(gasto.valor)}</b>

</li>

`;

    });

}

/*************************************************
            TOTAL ARRECADADO
*************************************************/

function totalFinanceiro() {

    let total = 0;

    gastos.forEach(gasto => {

        total += Number(gasto.valor || 0);

    });

    return total;

}

/*************************************************
            QUANTIDADE
*************************************************/

function quantidadeMovimentacoes() {

    return gastos.length;

}

/*************************************************
            FILTRAR
*************************************************/

function filtrarFinanceiro(texto) {

    texto = texto.toLowerCase();

    return gastos.filter(gasto =>

        (gasto.paciente || "")
        .toLowerCase()
        .includes(texto)

        ||

        (gasto.tipo || "")
        .toLowerCase()
        .includes(texto)

    );

}

/*************************************************
            EXPORTAÇÃO
*************************************************/

window.gastos = gastos;

window.carregarGastos =
carregarGastos;

window.renderGastos =
renderGastos;

window.totalFinanceiro =
totalFinanceiro;

window.quantidadeMovimentacoes =
quantidadeMovimentacoes;

window.filtrarFinanceiro =
filtrarFinanceiro;

console.log("✅ financeiro.js carregado");
