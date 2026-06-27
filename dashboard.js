/*************************************************
            DASHBOARD.JS - SIRMED V4
*************************************************/

/*************************************************
            ATUALIZAR DASHBOARD
*************************************************/

function atualizarDashboard() {

    atualizarTotalPacientes();
    atualizarTotalProfissionais();
    atualizarTotalConsultas();
    atualizarTotalFinanceiro();

}

/*************************************************
            PACIENTES
*************************************************/

function atualizarTotalPacientes() {

    const elemento =
        document.getElementById("totalPacientes");

    if (!elemento) return;

    elemento.textContent = pacientes.length;

}

/*************************************************
            PROFISSIONAIS
*************************************************/

function atualizarTotalProfissionais() {

    const elemento =
        document.getElementById("totalProfissionais");

    if (!elemento) return;

    elemento.textContent = profissionais.length;

}

/*************************************************
            CONSULTAS
*************************************************/

function atualizarTotalConsultas() {

    const elemento =
        document.getElementById("totalConsultas");

    if (!elemento) return;

    elemento.textContent = consultas.length;

}

/*************************************************
            FINANCEIRO
*************************************************/

function atualizarTotalFinanceiro() {

    const elemento =
        document.getElementById("totalGastos");

    if (!elemento) return;

    let total = 0;

    gastos.forEach(gasto => {

        total += Number(gasto.valor || 0);

    });

    elemento.textContent = formatarMoeda(total);

}

/*************************************************
            ESTATÍSTICAS
*************************************************/

function estatisticasSistema() {

    return {

        pacientes: pacientes.length,

        profissionais: profissionais.length,

        consultas: consultas.length,

        financeiro: gastos.reduce((total, gasto) => {

            return total + Number(gasto.valor || 0);

        }, 0)

    };

}

/*************************************************
            EXPORTAÇÃO
*************************************************/

window.atualizarDashboard = atualizarDashboard;
window.estatisticasSistema = estatisticasSistema;

console.log("✅ dashboard.js carregado");
