/*************************************************
          PERMISSOES.JS - SIRMED V4.3
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
        "secaoProntuarios"
    ],

    operador: [
        "inicio",
        "financeiro",
        "secaoRelatorios"
    ]

};


/*************************************************
             OBTER PERMISSÕES
*************************************************/

export function obterPermissoesPerfil() {

    const perfil =
        String(
            perfilUsuarioAtual() || ""
        )
        .trim()
        .toLowerCase();


    return permissoes[perfil]
        || ["inicio"];

}


/*************************************************
            VERIFICAR PERMISSÃO
*************************************************/

export function temPermissao(
    secaoId
) {

    return obterPermissoesPerfil()
        .includes(
            secaoId
        );

}


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
                SEÇÕES DO SISTEMA
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


                if (!permitido) {

                    secao.classList.remove(
                        "tela-ativa"
                    );

                }

            }
        );


    /*************************************************
                MENU PRINCIPAL
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


                if (!permitido) {

                    botao.classList.remove(
                        "ativo"
                    );

                }

            }
        );


    /*************************************************
            GARANTIR TELA INICIAL
    *************************************************/

    const ativa =
        document.querySelector(
            ".tela-sistema.tela-ativa:not([hidden])"
        );


    if (!ativa) {

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
        "✅ Permissões aplicadas."
    );

}


/*************************************************
                    LOG
*************************************************/

console.log(
    "✅ permissoes.js V4.3 carregado"
);
