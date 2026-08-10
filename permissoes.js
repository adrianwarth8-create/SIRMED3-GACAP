/*************************************************
        PERMISSOES.JS - SIRMED V4.4
*************************************************/

import {
    perfilUsuarioAtual
} from "./login.js";


/*************************************************
            MAPA DE PERMISSÕES
*************************************************/

const permissoes = {


    /*************************************************
                    GESTOR
    *************************************************/

    gestor: [

        "inicio",

        "secaoPacientes",

        "secaoProfissionais",

        "secaoConsultas",

        "secaoHistorico",

        "secaoProntuarios",

        "secaoTriagem",

        "financeiro",

        "secaoRelatorios"

    ],


    /*************************************************
                    MÉDICO
    *************************************************/

    medico: [

        "inicio",

        "secaoPacientes",

        "secaoConsultas",

        "secaoHistorico",

        "secaoProntuarios"

    ],


    /*************************************************
                    OPERADOR
    *************************************************/

    operador: [

        "inicio",

        "financeiro",

        "secaoRelatorios"

    ],


    /*************************************************
                    TRIAGEM
    *************************************************/

    triagem: [

        "inicio",

        "secaoPacientes",

        "secaoTriagem"

    ]

};


/*************************************************
            NORMALIZAR PERFIL
*************************************************/

function obterPerfilAtual() {

    return String(
        perfilUsuarioAtual() || ""
    )
    .trim()
    .toLowerCase();

}


/*************************************************
            OBTER PERMISSÕES
*************************************************/

export function obterPermissoesPerfil() {

    const perfil =
        obterPerfilAtual();


    /*
        Caso o perfil não seja reconhecido,
        libera somente o início.
    */

    return (
        permissoes[perfil]
        ||
        ["inicio"]
    );

}


/*************************************************
            VERIFICAR PERMISSÃO
*************************************************/

export function temPermissao(
    secaoId
) {

    const permitidas =
        obterPermissoesPerfil();


    return permitidas.includes(
        secaoId
    );

}


/*************************************************
            APLICAR PERMISSÕES
*************************************************/

export function aplicarPermissoes() {

    const perfil =
        obterPerfilAtual();


    const permitidas =
        obterPermissoesPerfil();


    console.log(
        "🔐 Perfil:",
        perfil
    );


    console.log(
        "🔑 Seções permitidas:",
        permitidas
    );


    /*************************************************
            CONTROLAR SEÇÕES
    *************************************************/

    document
        .querySelectorAll(
            ".tela-sistema"
        )
        .forEach(
            (secao) => {

                const permitido =
                    permitidas.includes(
                        secao.id
                    );


                secao.hidden =
                    !permitido;


                /*
                    Remove a classe ativa
                    das seções proibidas.
                */

                if (!permitido) {

                    secao.classList.remove(
                        "tela-ativa"
                    );

                }

            }
        );


    /*************************************************
            CONTROLAR MENU
    *************************************************/

    document
        .querySelectorAll(
            ".menu-item"
        )
        .forEach(
            (botao) => {

                const destino =
                    botao.dataset.secao;


                if (!destino) {

                    botao.hidden =
                        true;

                    return;

                }


                const permitido =
                    permitidas.includes(
                        destino
                    );


                botao.hidden =
                    !permitido;


                /*
                    Remove marcação ativa
                    dos botões proibidos.
                */

                if (!permitido) {

                    botao.classList.remove(
                        "ativo"
                    );

                }

            }
        );


    /*************************************************
        VERIFICAR SE A TELA ATIVA É PERMITIDA
    *************************************************/

    const telaAtiva =
        document.querySelector(
            ".tela-sistema.tela-ativa"
        );


    if (
        telaAtiva
        &&
        permitidas.includes(
            telaAtiva.id
        )
        &&
        !telaAtiva.hidden
    ) {

        console.log(
            "✅ Tela ativa autorizada:",
            telaAtiva.id
        );


        return;

    }


    /*************************************************
                ABRIR INÍCIO
    *************************************************/

    document
        .querySelectorAll(
            ".tela-sistema"
        )
        .forEach(
            (secao) => {

                secao.classList.remove(
                    "tela-ativa"
                );

            }
        );


    const inicio =
        document.getElementById(
            "inicio"
        );


    if (inicio) {

        inicio.hidden =
            false;


        inicio.classList.add(
            "tela-ativa"
        );

    }


    /*************************************************
            MARCAR BOTÃO INÍCIO
    *************************************************/

    document
        .querySelectorAll(
            ".menu-item"
        )
        .forEach(
            (botao) => {

                botao.classList.toggle(

                    "ativo",

                    botao.dataset.secao ===
                    "inicio"

                );

            }
        );


    console.log(
        "🏠 Tela inicial ativada."
    );

}


/*************************************************
        VERIFICAR PERFIL ESPECÍFICO
*************************************************/

export function usuarioEhGestor() {

    return (
        obterPerfilAtual()
        ===
        "gestor"
    );

}


export function usuarioEhMedico() {

    return (
        obterPerfilAtual()
        ===
        "medico"
    );

}


export function usuarioEhOperador() {

    return (
        obterPerfilAtual()
        ===
        "operador"
    );

}


export function usuarioEhTriagem() {

    return (
        obterPerfilAtual()
        ===
        "triagem"
    );

}


/*************************************************
            EXPORTAÇÃO GLOBAL
*************************************************/

window.temPermissao =
    temPermissao;


window.aplicarPermissoes =
    aplicarPermissoes;


window.usuarioEhGestor =
    usuarioEhGestor;


window.usuarioEhMedico =
    usuarioEhMedico;


window.usuarioEhOperador =
    usuarioEhOperador;


window.usuarioEhTriagem =
    usuarioEhTriagem;


/*************************************************
                    LOG
*************************************************/

console.log(
    "✅ permissoes.js V4.4 carregado"
);
