/*************************************************
              PERMISSOES.JS - SIRMED V4
*************************************************/

import {
    perfilUsuarioAtual
} from "./login.js";


/*************************************************
                    MOSTRAR
*************************************************/

export function mostrar(id) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.hidden = false;

    }

}


/*************************************************
                    ESCONDER
*************************************************/

export function esconder(id) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.hidden = true;

    }

}


/*************************************************
              APLICAR PERMISSÕES
*************************************************/

export function aplicarPermissoes() {

    const secoes = [

        "secaoPacientes",

        "secaoProfissionais",

        "secaoConsultas",

        "secaoHistorico",

        "secaoProntuarios",

        "secaoRelatorios",

        "financeiro"

    ];


    /*************************************************
                MOSTRAR TUDO PRIMEIRO
    *************************************************/

    secoes.forEach(
        mostrar
    );


    /*************************************************
                IDENTIFICAR PERFIL
    *************************************************/

    const perfil =
        perfilUsuarioAtual();


    console.log(
        "🔐 Perfil atual:",
        perfil
    );


    /*************************************************
                    PERMISSÕES
    *************************************************/

    switch (perfil) {


        /*********************************************
                        GESTOR
        *********************************************/

        case "gestor":

            /*
                GESTOR:
                - Pacientes
                - Profissionais
                - Consultas
                - Histórico
                - Prontuários
                - Relatórios
                - Financeiro
            */

            break;


        /*********************************************
                        MÉDICO
        *********************************************/

        case "medico":

            /*
                MÉDICO:
                - Pacientes
                - Consultas
                - Histórico
                - Prontuários
                - Relatórios

                NÃO ACESSA:
                - Cadastro de profissionais
                - Financeiro
            */

            esconder(
                "secaoProfissionais"
            );


            esconder(
                "financeiro"
            );


            break;


        /*********************************************
                        OPERADOR
        *********************************************/

        case "operador":

            /*
                OPERADOR:
                - Cadastro de pacientes
                - Consultas
                - Histórico

                NÃO ACESSA:
                - Profissionais
                - Prontuários
                - Relatórios
                - Financeiro
            */

            esconder(
                "secaoProfissionais"
            );


            esconder(
                "secaoProntuarios"
            );


            esconder(
                "secaoRelatorios"
            );


            esconder(
                "financeiro"
            );


            break;


        /*********************************************
                    PERFIL DESCONHECIDO
        *********************************************/

        default:

            console.warn(
                "⚠️ Perfil não reconhecido:",
                perfil
            );


            /*
                Por segurança, perfil desconhecido
                recebe o menor nível visual de acesso.
            */

            esconder(
                "secaoProfissionais"
            );


            esconder(
                "secaoProntuarios"
            );


            esconder(
                "secaoRelatorios"
            );


            esconder(
                "financeiro"
            );


            break;

    }


    console.log(
        "✅ Permissões aplicadas."
    );

}


/*************************************************
                LOG DO SISTEMA
*************************************************/

console.log(
    "✅ permissoes.js carregado"
);
