/*************************************************
              LOGIN.JS - SIRMED V4.4
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


/*************************************************
              VARIÁVEIS DO USUÁRIO
*************************************************/

let perfilUsuario = "";

let usuarioAtual = null;


/*************************************************
                    ENTRAR
*************************************************/

export async function entrar() {

    const campoEmail =
        document.getElementById("email");

    const campoSenha =
        document.getElementById("senha");


    const email =
        campoEmail?.value.trim() || "";

    const senha =
        campoSenha?.value || "";


    if (!email || !senha) {

        alert(
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

    }

    catch (erro) {

        console.error(
            "Erro no login:",
            erro
        );


        alert(
            "Usuário ou senha inválidos."
        );

    }

}


/*************************************************
                    SAIR
*************************************************/

export async function sair() {

    try {

        await signOut(auth);

    }

    catch (erro) {

        console.error(
            "Erro ao sair:",
            erro
        );

    }

}


/*************************************************
                CARREGAR PERFIL
*************************************************/

export async function carregarPerfil() {

    /*
        Sem usuário autenticado,
        não existe perfil para carregar.
    */

    if (!usuarioAtual) {

        perfilUsuario = "";

        return "";

    }


    try {

        const referencia =
            doc(
                db,
                "usuarios",
                usuarioAtual.uid
            );


        const documento =
            await getDoc(
                referencia
            );


        if (documento.exists()) {

            perfilUsuario =
                String(
                    documento.data().perfil || ""
                )
                .trim()
                .toLowerCase();

        }

        else {

            /*
                Segurança:

                usuário autenticado sem documento
                na coleção usuarios não recebe
                automaticamente acesso de operador.
            */

            perfilUsuario = "";

            console.warn(
                "Usuário sem perfil cadastrado no Firestore."
            );

        }


        console.log(
            "👤 Perfil carregado:",
            perfilUsuario
        );


        return perfilUsuario;

    }

    catch (erro) {

        console.error(
            "Erro ao carregar perfil:",
            erro
        );


        perfilUsuario = "";

        return "";

    }

}


/*************************************************
          ATUALIZAR INTERFACE DO LOGIN
*************************************************/

function mostrarSistema(user) {

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
            `👤 ${user.email} (${perfilUsuario || "sem perfil"})`;

    }

}


/*************************************************
              MOSTRAR LOGIN
*************************************************/

function mostrarLogin() {

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

}


/*************************************************
          OBSERVADOR DE AUTENTICAÇÃO
*************************************************/

/*
    Esta função é chamada pelo script.js V4.4.

    Ela substitui o antigo:

    onAuthStateChanged(auth, async (user) => {...})

    que ficava executando diretamente
    dentro do login.js.
*/

export function iniciarObservadorAuth({

    aoEntrar = null,

    aoSair = null

} = {}) {


    return onAuthStateChanged(

        auth,

        async (user) => {


            /*************************************************
                        USUÁRIO SAIU
            *************************************************/

            if (!user) {

                usuarioAtual =
                    null;


                perfilUsuario =
                    "";


                mostrarLogin();


                console.log(
                    "🔒 Nenhum usuário autenticado."
                );


                if (
                    typeof aoSair ===
                    "function"
                ) {

                    try {

                        await aoSair();

                    }

                    catch (erro) {

                        console.error(
                            "Erro ao executar aoSair:",
                            erro
                        );

                    }

                }


                return;

            }


            /*************************************************
                    USUÁRIO AUTENTICADO
            *************************************************/

            usuarioAtual =
                user;


            /*
                Primeiro carregamos o perfil.

                Isso é importante porque
                permissões.js depende dele.
            */

            await carregarPerfil();


            mostrarSistema(
                user
            );


            console.log(
                "🔓 Usuário autenticado:",
                user.email
            );


            console.log(
                "🔐 Perfil:",
                perfilUsuario
            );


            /*************************************************
                    PERFIL NÃO CADASTRADO
            *************************************************/

            if (!perfilUsuario) {

                console.warn(
                    "⚠️ Usuário autenticado sem perfil válido."
                );

            }


            /*************************************************
                AVISAR SCRIPT.JS
            *************************************************/

            if (
                typeof aoEntrar ===
                "function"
            ) {

                try {

                    await aoEntrar(
                        user
                    );

                }

                catch (erro) {

                    console.error(
                        "Erro durante inicialização do usuário:",
                        erro
                    );

                }

            }

        }

    );

}


/*************************************************
              PERFIL ATUAL
*************************************************/

export const perfilUsuarioAtual =
    () => perfilUsuario;


/*************************************************
              USUÁRIO ATUAL
*************************************************/

export const usuarioAtualLogado =
    () => usuarioAtual;


/*************************************************
          VERIFICAÇÕES DE PERFIL
*************************************************/

export function ehGestor() {

    return (
        perfilUsuario ===
        "gestor"
    );

}


export function ehMedico() {

    return (
        perfilUsuario ===
        "medico"
    );

}


export function ehOperador() {

    return (
        perfilUsuario ===
        "operador"
    );

}


export function ehTriagem() {

    return (
        perfilUsuario ===
        "triagem"
    );

}


/*************************************************
              EXPORTAÇÃO GLOBAL
*************************************************/

window.entrar =
    entrar;


window.sair =
    sair;


window.perfilUsuario =
    perfilUsuarioAtual;


window.usuarioAtualLogado =
    usuarioAtualLogado;


window.ehGestor =
    ehGestor;


window.ehMedico =
    ehMedico;


window.ehOperador =
    ehOperador;


window.ehTriagem =
    ehTriagem;


/*************************************************
                    LOG
*************************************************/

console.log(
    "✅ login.js V4.4 carregado"
);
