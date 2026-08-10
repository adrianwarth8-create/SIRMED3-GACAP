/*************************************************
           PERMISSOES.JS - SIRMED V4.2
*************************************************/

import {
    perfilUsuarioAtual
} from "./login.js";


/*************************************************
              MAPA DE PERMISSÕES
*************************************************/

const permissoes = {

    gestor: [

        "inicio",
        "secaoPacientes",
        "secaoProfissionais",
        "secaoConsultas",
        "secaoHistorico",
        "secaoProntuarios",
        "financeiro",
        "secaoRelatorios"

    ],


    medico: [

        "inicio",
        "secaoPacientes",
        "secaoConsultas",
        "secaoHistorico",
        "secaoProntuarios",
        "secaoRelatorios"

    ],


    operador: [

        "inicio",
        "secaoPacientes",
        "secaoConsultas",
        "secaoHistorico"

    ]

};


/*************************************************
            APLICAR PERMISSÕES
*************************************************/

export function aplicarPermissoes() {

    const perfil =
        String(
            perfilUsuarioAtual() || ""
        )
        .trim()
        .toLowerCase();


    console.log(
        "🔐 Aplicando permissões:",
        perfil
    );


    /*
        Se o perfil não existir,
        usa acesso mínimo.
    */

    const permitidas =
        permissoes[perfil]
        ||
        ["inicio"];


    /*************************************************
            CONTROLAR AS SEÇÕES
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
                    Se não tem permissão,
                    garante que não fique ativa.
                */

                if (!permitido) {

                    secao.classList.remove(
                        "tela-ativa"
                    );

                }

            }
        );


    /*************************************************
            CONTROLAR BOTÕES DO MENU
    *************************************************/

    document
        .querySelectorAll(
            ".menu-item"
        )
        .forEach(
            (botao) => {

                const destino =
                    botao.dataset.secao;


                const permitido =
                    permitidas.includes(
                        destino
                    );


                botao.hidden =
                    !permitido;

            }
        );


    /*************************************************
        GARANTIR UMA TELA AUTORIZADA ABERTA
    *************************************************/

    const telaAtiva =
        document.querySelector(
            ".tela-sistema.tela-ativa"
        );


    if (
        !telaAtiva
        ||
        telaAtiva.hidden
    ) {

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

    }


    console.log(
        "✅ Permissões aplicadas para:",
        perfil
    );

}


/*************************************************
          VERIFICAR PERMISSÃO
*************************************************/

export function temPermissao(
    secaoId
) {

    const perfil =
        String(
            perfilUsuarioAtual() || ""
        )
        .trim()
        .toLowerCase();


    return (
        permissoes[perfil]
        ||
        ["inicio"]
    )
    .includes(
        secaoId
    );

}


/*************************************************
                    LOG
*************************************************/

console.log(
    "✅ permissoes.js V4.2 carregado"
);
