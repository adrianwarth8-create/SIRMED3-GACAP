import { entrar, sair } from "./login.js";
import { cadastrarPaciente } from "./pacientes.js";
import { cadastrarProfissional } from "./profissionais.js";
import { registrarConsulta } from "./consultas.js";
import { gerarPDF, gerarWord } from "./relatorios.js";
import { carregarPacientes, renderPacientes } from "./pacientes.js";
import { carregarProfissionais, renderProfissionais } from "./profissionais.js";
import { carregarConsultas, renderConsultas } from "./consultas.js";
import { carregarProntuarios, renderProntuarios } from "./prontuarios.js";
import { carregarGastos, renderGastos } from "./financeiro.js";

document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("btnEntrar")
        ?.addEventListener("click", entrar);

    document
        .getElementById("btnSair")
        ?.addEventListener("click", sair);

    document
        .getElementById("btnCadastrarPaciente")
        ?.addEventListener("click", cadastrarPaciente);

    document
        .getElementById("btnCadastrarProfissional")
        ?.addEventListener("click", cadastrarProfissional);

    document
        .getElementById("btnRegistrarConsulta")
        ?.addEventListener("click", registrarConsulta);

    document
        .getElementById("btnPDF")
        ?.addEventListener("click", gerarPDF);

    document
        .getElementById("btnWord")
        ?.addEventListener("click", gerarWord);

    document
        .getElementById("btnImprimir")
        ?.addEventListener("click", () => window.print());

});
/*************************************************
                SCRIPT.JS - SIRMED V4
*************************************************/

mensagem("Bem-vindo ao SIRMED - BY CB WARTH");

console.log("🏥 SIRMED V4 carregado");

/*************************************************
                CARREGAR TUDO
*************************************************/

async function carregarTudo() {

    await carregarPacientes();

    await carregarProfissionais();

    await carregarConsultas();

    await carregarProntuarios();

    await carregarGastos();

}

/*************************************************
                RENDERIZAR TUDO
*************************************************/

function renderizarTudo() {

    renderPacientes();

    renderProfissionais();

    renderConsultas();

    renderProntuarios();

    renderGastos();

    preencherSelectsConsulta();

    preencherRelatorioPaciente();

    preencherRelatorioProfissional();

    atualizarDashboard();

}

/*************************************************
                EXPORTAÇÃO
*************************************************/

window.carregarTudo = carregarTudo;
window.renderizarTudo = renderizarTudo;

console.log("✅ script.js carregado");
