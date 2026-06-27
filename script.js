mensagem("Bem-Vindo ao SIRMED - BY CB WARTH");

async function gerarPDF(){

    const paciente =
        document.getElementById("relatorioPaciente").value;

    alert("Paciente escolhido: " + paciente);

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
