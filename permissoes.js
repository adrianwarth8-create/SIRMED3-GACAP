/*************************************************
            PERMISSOES.JS - SIRMED V4
*************************************************/

function mostrar(id) {

    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.style.display = "";
    }

}

function esconder(id) {

    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.style.display = "none";
    }

}

function aplicarPermissoes() {

    // Primeiro mostra tudo
    mostrar("secaoPacientes");
    mostrar("secaoProfissionais");
    mostrar("secaoConsultas");
    mostrar("secaoHistorico");
    mostrar("secaoProntuarios");
    mostrar("secaoRelatorios");
    mostrar("financeiro");

    const perfil = window.perfilUsuario();

    console.log("Perfil:", perfil);

    switch (perfil) {

        case "gestor":

            // Gestor vê tudo
            break;

        case "medico":

            esconder("secaoProfissionais");
            esconder("financeiro");
            esconder("secaoProntuarios");

            break;

        case "operador":

            esconder("secaoPacientes");
            esconder("secaoProfissionais");
            esconder("secaoConsultas");

            // Operador continua vendo:
            // Histórico
            // Relatórios
            // Prontuários
            // Financeiro

            break;

        default:

            console.warn("Perfil não reconhecido:", perfil);

            break;

    }

}

window.aplicarPermissoes = aplicarPermissoes;

console.log("✅ permissoes.js carregado");
