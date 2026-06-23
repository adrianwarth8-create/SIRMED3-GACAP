async function entrar() {

const email =
document.getElementById("email").value;

const senha =
document.getElementById("senha").value;

try {

const usuario =
await signInWithEmailAndPassword(
auth,
email,
senha
);

document.getElementById("login")
.style.display = "none";

document.getElementById("sistema")
.style.display = "block";

document.getElementById("usuarioLogado")
.innerHTML =
"👤 " + usuario.user.email;

}
catch(erro){

console.error(erro);

alert("E-mail ou senha inválidos");

}

}

async function sair(){

await signOut(auth);

document.getElementById("login")
.style.display = "block";

document.getElementById("sistema")
.style.display = "none";

}

window.entrar = entrar;
window.sair = sair;
