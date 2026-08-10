/*************************************************
              DASHBOARD.JS - SIRMED V4
*************************************************/

import {
    totalPacientes
} from "./pacientes.js";

import {
    totalProfissionais
} from "./profissionais.js";

import {
    totalConsultas
} from "./consultas.js";

import {
    totalFinanceiro
} from "./financeiro.js";

import {
    formatarMoeda
} from "./utils.js";


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
                TOTAL PACIENTES
*************************************************/

export function atualizarTotalPacientes() {

    const elemento =
        document.getElementById(
            "totalPacientes"
        );


    if (!elemento) {

        return;

    }


    elemento.textContent =
        totalPacientes();

}


/*************************************************
              TOTAL PROFISSIONAIS
*************************************************/

export function atualizarTotalProfissionais() {

    const elemento =
        document.getElementById(
            "totalProfissionais"
        );


    if (!elemento) {

        return;

    }


    elemento.textContent =
        totalProfissionais();

}


/*************************************************
                TOTAL CONSULTAS
*************************************************/

export function atualizarTotalConsultas() {

    const elemento =
        document.getElementById(
            "totalConsultas"
        );


    if (!elemento) {

        return;

    }


    elemento.textContent =
        totalConsultas();

}


/*************************************************
                TOTAL FINANCEIRO
*************************************************/

export function atualizarTotalFinanceiro() {

    const elemento =
        document.getElementById(
            "totalGastos"
        );


    if (!elemento) {

        return;

    }


    elemento.textContent =
        formatarMoeda(
            totalFinanceiro()
        );

}


/*************************************************
              ESTATÍSTICAS DO SISTEMA
*************************************************/

export function estatisticasSistema() {

    return {

        pacientes:
            totalPacientes(),

        profissionais:
            totalProfissionais(),

        consultas:
            totalConsultas(),

        financeiro:
            totalFinanceiro()

    };

}


/*************************************************
                LOG DO SISTEMA
*************************************************/

console.log(
    "✅ dashboard.js carregado"
);
