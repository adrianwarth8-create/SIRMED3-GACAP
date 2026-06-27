alert("Bem-Vindo ao SIRMED - BY CB WARTH");

/*************************
 * SIRMED V2
 *************************/

let gastos = [];

/*************************
 * CARREGAMENTO GERAL
 *************************/

async function carregarTudo() {

    await Promise.all([
    carregarGastos(),
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

async function gerarPDF(){

    const paciente =
        document.getElementById("relatorioPaciente").value;

    alert("Paciente escolhido: " + paciente);

}

/*************************
 * RENDER GERAL
 *************************/

function renderizarTudo(){



 renderGastos();

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
