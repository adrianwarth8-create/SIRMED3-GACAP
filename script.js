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
