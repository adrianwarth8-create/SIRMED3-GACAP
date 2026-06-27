/*************************************************
                LOGIN.JS - SIRMED V4
*************************************************/

let perfilUsuario = "";
let usuarioAtual = null;

/*************************************************
                ENTRAR
*************************************************/

async function entrar() {

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

onAuthStateChanged(auth, async (user) => {

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

    await carregarTudo();

    renderizarTudo();

    aplicarPermissoes();

});

/*************************************************
            CARREGAR PERFIL
*************************************************/

async function carregarPerfil() {

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

async function sair() {

    await signOut(auth);

}

/*************************************************
                EXPORTAÇÃO
*************************************************/

window.entrar = entrar;
window.sair = sair;
window.perfilUsuario = () => perfilUsuario;
window.usuarioAtual = () => usuarioAtual;

console.log("✅ login.js carregado");
