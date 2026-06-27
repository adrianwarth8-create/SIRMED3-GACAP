alert("Bem-Vindo ao SIRMED - BY CB WARTH");

/*************************
 * SIRMED V2
 *************************/

let gastos = [];
let prontuarios = [];

let perfilUsuario = "";

/*************************
 * CARREGAMENTO GERAL
 *************************/

async function carregarTudo() {

    await Promise.all([
    carregarGastos(),
    carregarProntuarios()
]);

}
/*************************
 * GASTOS
 *************************/

async function carregarGastos() {

    gastos = [];

    const snap =
        await getDocs(
            collection(
                db,
                "gastos"
            )
        );

    snap.forEach(docSnap => {

        gastos.push({
            id: docSnap.id,
            ...docSnap.data()
        });

    });

}

/*************************
 * RENDER GASTOS
 *************************/

function renderGastos() {

    const el =
        document.getElementById(
            "listaGastos"
        );

    if (!el) return;

    el.innerHTML = "";

    gastos.forEach(g => {

        el.innerHTML += `

<li>

<b>${g.tipo}</b><br>

👤 ${g.paciente}<br>

📅 ${g.data}<br>

<span class="valor-financeiro">

R$ ${Number(g.valor || 0).toFixed(2)}

</span>

</li>

`;

    });

}

async function carregarProntuarios(){

 prontuarios = [];

 const snap =
 await getDocs(
 collection(
 db,
 "prontuarios"
 )
 );

 snap.forEach(docSnap=>{

 prontuarios.push({
 id: docSnap.id,
 ...docSnap.data()
 });

 });

}

async function gerarPDF(){

    const paciente =
        document.getElementById("relatorioPaciente").value;

    alert("Paciente escolhido: " + paciente);

}

function renderProntuarios(){

 const el =
 document.getElementById(
 "listaProntuarios"
 );

 if(!el) return;

 el.innerHTML = "";

 prontuarios.forEach(p=>{

 el.innerHTML += `

<li>

<b>👤 ${p.pacienteNome}</b><br>

👨‍⚕️ ${p.profissional}<br>

📅 ${p.data}<br>

🩺 ${p.queixa}<br>

📋 ${p.diagnostico}<br>

💊 ${p.prescricao}

</li>

`;

 });

}

/*************************
 * RENDER GERAL
 *************************/

function renderizarTudo(){



 renderGastos();

 renderProntuarios();

}

/*************************
 * EXPORTAÇÃO GLOBAL
 *************************/

window.cadastrarProfissional =
    cadastrarProfissional;

window.registrarConsulta =
    registrarConsulta;

window.filtrarProfissionais =
    filtrarProfissionais;

window.filtrarConsultas =
    filtrarConsultas;

    if (user) {

        document.getElementById("login").style.display = "none";
        document.getElementById("sistema").style.display = "block";

        document.getElementById("usuarioLogado").innerHTML =
            "👤 " + user.email;

        await carregarTudo();

        renderizarTudo();

    } else {

        document.getElementById("login").style.display = "block";
        document.getElementById("sistema").style.display = "none";

    }

});

/*************************
 * INICIALIZAÇÃO
 *************************/

console.log(
    "🏥 SIRMED V2 carregado"
);
window.entrar = entrar;
window.sair = sair;
window.registrarConsulta = registrarConsulta;
onAuthStateChanged(auth, async (user) => {

    if(user){

        document.getElementById("login")
            .style.display = "none";

        document.getElementById("sistema")
            .style.display = "block";

        document.getElementById("usuarioLogado")
            .innerHTML =
            "👤 " + user.email;

        await carregarTudo();

        renderizarTudo();
    }

});
window.onAuthStateChanged(window.auth, (user) => {

    if(user){
        entrarAutomatico(user);
    }

});
    if (usuario) {

        document.getElementById("login").style.display = "none";
        document.getElementById("sistema").style.display = "block";

        document.getElementById("usuarioLogado").innerHTML =
            "👤 " + usuario.email;

        await carregarTudo();
        renderizarTudo();

    } else {

        document.getElementById("login").style.display = "block";
        document.getElementById("sistema").style.display = "none";

    }

});
