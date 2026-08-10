/*************************************************
                 LOGIN.JS - SIRMED V4
*************************************************/

import {
    auth,
    db,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    doc,
    getDoc
} from "./firebase.js";

import {
    mensagem
} from "./utils.js";


/*************************************************
                VARIÁVEIS
*************************************************/

let perfil = "";

let usuarioAtual = null;


/*************************************************
                    ENTRAR
*************************************************/

export async function entrar() {

    const email =
        document
            .getElementById("email")
            ?.value
            .trim()
        || "";

    const senha =
        document
            .getElementById("senha")
            ?.value
        || "";


    if (
        !email ||
        !senha
    ) {

        mensagem(
            "Informe o e-mail e a senha."
        );

        return;

    }


    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            senha
        );

    } catch (erro) {

        console.error(
            "Erro no login:",
            erro
        );


        mensagem(
            "Usuário ou senha inválidos."
        );

    }

}


/*************************************************
                    SAIR
*************************************************/

export async function sair() {

    try {

        await signOut(
            auth
        );

    } catch (erro) {

        console.error(
            "Erro ao sair:",
            erro
        );


        mensagem(
            "Não foi possível encerrar a sessão."
        );

    }

}


/*************************************************
                CARREGAR PERFIL
*************************************************/

export async function carregarPerfil() {

    if (!usuarioAtual) {

        perfil = "";

        return perfil;

    }


    try {

        const docUser =
            await getDoc(

                doc(
                    db,
                    "usuarios",
                    usuarioAtual.uid
                )

            );


        if (
            docUser.exists()
        ) {

            perfil =
                String(
                    docUser
                        .data()
                        .perfil
                    ||
                    "operador"
                )
                .toLowerCase();

        } else {

            perfil =
                "operador";

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar perfil:",
            erro
        );


        perfil =
            "operador";

    }


    return perfil;

}


/*************************************************
            PERFIL DO USUÁRIO ATUAL
*************************************************/

export function perfilUsuarioAtual() {

    return perfil;

}


/*************************************************
            USUÁRIO ATUAL LOGADO
*************************************************/

export function usuarioAtualLogado() {

    return usuarioAtual;

}


/*************************************************
            OBSERVADOR DE AUTENTICAÇÃO
*************************************************/

export function iniciarObservadorAuth({
    aoEntrar,
    aoSair
} = {}) {

    return onAuthStateChanged(

        auth,

        async (user) => {

            const login =
                document.getElementById(
                    "login"
                );


            const sistema =
                document.getElementById(
                    "sistema"
                );


            const usuarioLogado =
                document.getElementById(
                    "usuarioLogado"
                );


            /*************************************
                        SEM LOGIN
            *************************************/

            if (!user) {

                usuarioAtual =
                    null;


                perfil =
                    "";


                if (login) {

                    login.style.display =
                        "block";

                }


                if (sistema) {

                    sistema.style.display =
                        "none";

                }


                if (usuarioLogado) {

                    usuarioLogado.textContent =
                        "";

                }


                if (
                    typeof aoSair ===
                    "function"
                ) {

                    await aoSair();

                }


                return;

            }


            /*************************************
                        COM LOGIN
            *************************************/

            usuarioAtual =
                user;


            await carregarPerfil();


            if (login) {

                login.style.display =
                    "none";

            }


            if (sistema) {

                sistema.style.display =
                    "block";

            }


            if (usuarioLogado) {

                usuarioLogado.textContent =
                    `👤 ${user.email} (${perfil})`;

            }


            if (
                typeof aoEntrar ===
                "function"
            ) {

                await aoEntrar(
                    user,
                    perfil
                );

            }

        }

    );

}


/*************************************************
                LOG DO SISTEMA
*************************************************/

console.log(
    "✅ login.js carregado"
);
