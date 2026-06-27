/*************************************************
            DASHBOARD.JS - SIRMED V4
*************************************************/

/*************************************************
            ATUALIZAR DASHBOARD
*************************************************/

export function atualizarDashboard() {

    atualizarTotalPacientes();
    atualizarTotalProfissionais();
    atualizarTotalConsultas();
    atualizarTotalFinanceiro();

}

/*************************************************
            PACIENTES
*************************************************/

export function atualizarTotalPacientes() {

    const elemento =
        document.getElementById("totalPacientes");

    if (!elemento) return;

    elemento.textContent = pacientes.length;

}

/*************************************************
            PROFISSIONAIS
*************************************************/

export function atualizarTotalProfissionais() {

    const elemento =
        document.getElementById("totalProfissionais");

    if (!elemento) return;

    elemento.textContent = profissionais.length;

}

/*************************************************
            CONSULTAS
*************************************************/

export function atualizarTotalConsultas() {

    const elemento =
        document.getElementById("totalConsultas");

    if (!elemento) return;

    elemento.textContent = consultas.length;

}

/*************************************************
            FINANCEIRO
*************************************************/

export function atualizarTotalFinanceiro() {

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

export function estatisticasSistema() {

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
