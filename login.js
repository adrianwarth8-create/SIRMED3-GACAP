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
                LOGIN.JS - SIRMED V4
*************************************************/

let perfilUsuario = "";
let usuarioAtual = null;

/*************************************************
                ENTRAR
*************************************************/

export async function entrar() {

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
        alert("Informe o e-mail e a senha.");
        return;
    }

    try {

        await signInWithEmailAndPassword(auth, email, senha);

    } catch (erro) {

        console.error(erro);

        alert("Usuário ou senha inválidos.");

    }

}

/*************************************************
            LOGIN AUTOMÁTICO
*************************************************/

onAuthStateChanged(auth, await (user) => {

    if (!user) {

        document.getElementById("login").style.display = "block";
        document.getElementById("sistema").style.display = "none";
        return;

    }

    usuarioAtual = user;

    document.getElementById("login").style.display = "none";
    document.getElementById("sistema").style.display = "block";

    await carregarPerfil();

    document.getElementById("usuarioLogado").innerHTML =
        `👤 ${user.email} (${perfilUsuario})`;

    carregarTudo();

    renderizarTudo();

    aplicarPermissoes();

});
/*************************************************
            CARREGAR PERFIL
*************************************************/

export async function carregarPerfil() {

    try {

        const docUser = await getDoc(
            doc(db, "usuarios", usuarioAtual.uid)
        );

        if (docUser.exists()) {

            perfilUsuario = docUser.data().perfil;

        } else {

            perfilUsuario = "operador";

        }

    } catch (erro) {

        console.error(erro);

        perfilUsuario = "operador";

    }

}

/*************************************************
                    SAIR
*************************************************/

export async function sair() {

    await signOut(auth);

}

/*************************************************
                EXPORTAÇÃO
*************************************************/

export { entrar, sair };
export const perfilUsuarioAtual = () => perfilUsuario;
export const usuarioAtualLogado = () => usuarioAtual;

console.log("✅ login.js carregado");
