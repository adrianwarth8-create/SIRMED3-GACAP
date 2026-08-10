/*************************************************
                SCRIPT.JS - SIRMED V4.3
*************************************************/

import {
    entrar,
    sair,
    iniciarObservadorAuth,
    perfilUsuarioAtual
} from "./login.js";


import {
    cadastrarPaciente,
    carregarPacientes,
    renderPacientes,
    filtrarPacientes
} from "./pacientes.js";


import {
    cadastrarProfissional,
    carregarProfissionais,
    renderProfissionais,
    filtrarProfissionais
} from "./profissionais.js";


import {
    registrarConsulta,
    carregarConsultas,
    renderConsultas,
    filtrarConsultas,
    preencherSelectsConsulta
} from "./consultas.js";


import {
    carregarProntuarios,
    renderProntuarios,
    filtrarProntuarios
} from "./prontuarios.js";


import {
    carregarGastos,
    renderGastos
} from "./financeiro.js";


import {
    gerarPDF,
    gerarWord,
    preencherRelatorioPaciente,
    preencherRelatorioProfissional
} from "./relatorios.js";


import {
    atualizarDashboard
} from "./dashboard.js";


import {
    aplicarPermissoes,
    temPermissao
} from "./permissoes.js";


import {
    mensagem,
    formatarCPF,
    formatarTelefone
} from "./utils.js";


/*************************************************
            CONTROLE DE ATUALIZAÇÃO
*************************************************/

let atualizacaoEmAndamento = null;


/*************************************************
            CARREGAR POR PERFIL
*************************************************/

export async function carregarTudo() {

    const perfil =
        String(
            perfilUsuarioAtual() || ""
        )
        .trim()
        .toLowerCase();


    console.log(
        "📥 Carregando dados para:",
        perfil
    );


    /*************************************************
                    GESTOR
    *************************************************/

    if (
        perfil === "gestor"
    ) {

        await Promise.all([

            carregarPacientes(),

            carregarProfissionais(),

            carregarConsultas(),

            carregarProntuarios(),

            carregarGastos()

        ]);

        return;

    }


    /*************************************************
                    MÉDICO
    *************************************************/

    if (
        perfil === "medico"
    ) {

        await Promise.all([

            carregarPacientes(),

            carregarProfissionais(),

            carregarConsultas(),

            carregarProntuarios()

        ]);

        return;

    }


    /*************************************************
                    OPERADOR
    *************************************************/

    if (
        perfil === "operador"
    ) {

        /*
            O operador visualiza:

            - Início
            - Financeiro
            - Relatórios

            Os relatórios atuais utilizam
            pacientes, profissionais e consultas
            como fonte para filtros.
        */

        await Promise.all([

            carregarPacientes(),

            carregarProfissionais(),

            carregarConsultas(),

            carregarGastos()

        ]);

        return;

    }


    /*************************************************
                PERFIL DESCONHECIDO
    *************************************************/

    console.warn(
        "Perfil desconhecido:",
        perfil
    );

}


/*************************************************
                RENDERIZAR POR PERFIL
*************************************************/

export function renderizarTudo() {

    const perfil =
        String(
            perfilUsuarioAtual() || ""
        )
        .trim()
        .toLowerCase();


    /*************************************************
                    GESTOR
    *************************************************/

    if (
        perfil === "gestor"
    ) {

        renderPacientes();

        renderProfissionais();

        renderConsultas();

        renderProntuarios();

        renderGastos();


        preencherSelectsConsulta();

        preencherRelatorioPaciente();

        preencherRelatorioProfissional();


        atualizarDashboard();

        return;

    }


    /*************************************************
                    MÉDICO
    *************************************************/

    if (
        perfil === "medico"
    ) {

        renderPacientes();

        renderProfissionais();

        renderConsultas();

        renderProntuarios();


        preencherSelectsConsulta();


        atualizarDashboard();

        return;

    }


    /*************************************************
                    OPERADOR
    *************************************************/

    if (
        perfil === "operador"
    ) {

        /*
            Renderizamos internamente
            os dados necessários aos relatórios,
            mesmo que os módulos fiquem ocultos.
        */

        renderPacientes();

        renderProfissionais();

        renderConsultas();

        renderGastos();


        preencherRelatorioPaciente();

        preencherRelatorioProfissional();


        atualizarDashboard();

        return;

    }

}


/*************************************************
                ABRIR UMA TELA
*************************************************/

export function abrirSecao(
    secaoId
) {

    /*************************************************
                VERIFICAR PERMISSÃO
    *************************************************/

    if (
        !temPermissao(
            secaoId
        )
    ) {

        mensagem(
            "Você não possui permissão para acessar esta área."
        );

        return;

    }


    const secao =
        document.getElementById(
            secaoId
        );


    if (!secao) {

        console.warn(
            "Seção não encontrada:",
            secaoId
        );

        return;

    }


    /*************************************************
                ESCONDER TODAS
    *************************************************/

    document
        .querySelectorAll(
            ".tela-sistema"
        )
        .forEach(
            (tela) => {

                tela.classList.remove(
                    "tela-ativa"
                );

            }
        );


    /*************************************************
                MOSTRAR ESCOLHIDA
    *************************************************/

    secao.classList.add(
        "tela-ativa"
    );


    /*************************************************
                MARCAR MENU
    *************************************************/

    document
        .querySelectorAll(
            ".menu-item"
        )
        .forEach(
            (botao) => {

                botao.classList.toggle(

                    "ativo",

                    botao.dataset.secao ===
                    secaoId

                );

            }
        );


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/*************************************************
            CONFIGURAR MENU
*************************************************/

function configurarMenu() {

    document
        .querySelectorAll(
            ".menu-item"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    () => {

                        const secaoId =
                            botao.dataset.secao;


                        if (!secaoId) {

                            return;

                        }


                        abrirSecao(
                            secaoId
                        );

                    }
                );

            }
        );

}


/*************************************************
                ATUALIZAR SISTEMA
*************************************************/

async function atualizarSistema() {

    if (
        atualizacaoEmAndamento
    ) {

        return atualizacaoEmAndamento;

    }


    atualizacaoEmAndamento =
        (
            async () => {

                try {

                    console.log(
                        "🔄 Atualizando dados do SIRMED..."
                    );


                    /*********************************
                        PERMISSÕES PRIMEIRO
                    *********************************/

                    aplicarPermissoes();


                    /*********************************
                        CARREGAR DADOS
                    *********************************/

                    await carregarTudo();


                    /*********************************
                        RENDERIZAR
                    *********************************/

                    renderizarTudo();


                    /*********************************
                        REAPLICAR PERMISSÕES
                    *********************************/

                    aplicarPermissoes();


                    console.log(
                        "✅ SIRMED atualizado."
                    );

                } catch (erro) {

                    console.error(
                        "Erro ao atualizar SIRMED:",
                        erro
                    );


                    mensagem(
                        "Erro ao carregar os dados permitidos para este usuário."
                    );

                } finally {

                    atualizacaoEmAndamento =
                        null;

                }

            }
        )();


    return atualizacaoEmAndamento;

}


/*************************************************
                LIGAR EVENTOS
*************************************************/

function ligarEventos() {


    /*************************************************
                        LOGIN
    *************************************************/

    document
        .getElementById(
            "btnEntrar"
        )
        ?.addEventListener(
            "click",
            entrar
        );


    document
        .getElementById(
            "btnSair"
        )
        ?.addEventListener(
            "click",
            sair
        );


    document
        .getElementById(
            "senha"
        )
        ?.addEventListener(
            "keydown",
            (evento) => {

                if (
                    evento.key ===
                    "Enter"
                ) {

                    entrar();

                }

            }
        );


    /*************************************************
                    PACIENTES
    *************************************************/

    document
        .getElementById(
            "btnCadastrarPaciente"
        )
        ?.addEventListener(
            "click",
            cadastrarPaciente
        );


    document
        .getElementById(
            "pesquisaPaciente"
        )
        ?.addEventListener(
            "input",
            filtrarPacientes
        );


    document
        .getElementById(
            "pacienteCpf"
        )
        ?.addEventListener(
            "input",
            (evento) => {

                evento.target.value =
                    formatarCPF(
                        evento.target.value
                    );

            }
        );


    document
        .getElementById(
            "pacienteTelefone"
        )
        ?.addEventListener(
            "input",
            (evento) => {

                evento.target.value =
                    formatarTelefone(
                        evento.target.value
                    );

            }
        );


    /*************************************************
                PROFISSIONAIS
    *************************************************/

    document
        .getElementById(
            "btnCadastrarProfissional"
        )
        ?.addEventListener(
            "click",
            cadastrarProfissional
        );


    document
        .getElementById(
            "pesquisaProfissional"
        )
        ?.addEventListener(
            "input",
            filtrarProfissionais
        );


    /*************************************************
                    CONSULTAS
    *************************************************/

    document
        .getElementById(
            "btnRegistrarConsulta"
        )
        ?.addEventListener(
            "click",
            registrarConsulta
        );


    document
        .getElementById(
            "pesquisaConsulta"
        )
        ?.addEventListener(
            "input",
            filtrarConsultas
        );


    /*************************************************
                    PRONTUÁRIOS
    *************************************************/

    document
        .getElementById(
            "pesquisaProntuario"
        )
        ?.addEventListener(
            "input",
            filtrarProntuarios
        );


    /*************************************************
                    RELATÓRIOS
    *************************************************/

    document
        .getElementById(
            "btnPDF"
        )
        ?.addEventListener(
            "click",
            gerarPDF
        );


    document
        .getElementById(
            "btnWord"
        )
        ?.addEventListener(
            "click",
            gerarWord
        );


    document
        .getElementById(
            "btnImprimir"
        )
        ?.addEventListener(
            "click",
            () => {

                window.print();

            }
        );


    /*************************************************
                DADOS ALTERADOS
    *************************************************/

    document
        .addEventListener(
            "sirmed:dados-alterados",
            atualizarSistema
        );

}


/*************************************************
                INICIAR SIRMED
*************************************************/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        console.log(
            "🏥 SIRMED V4.3 carregado"
        );


        ligarEventos();


        configurarMenu();


        iniciarObservadorAuth({

            /*********************************
                    AO ENTRAR
            *********************************/

            aoEntrar:
                async () => {

                    /*
                        Primeiro fecha qualquer
                        tela indevida.
                    */

                    aplicarPermissoes();


                    await atualizarSistema();


                    abrirSecao(
                        "inicio"
                    );


                    mensagem(
                        "Bem-vindo ao SIRMED - BY CB WARTH"
                    );

                },


            /*********************************
                    AO SAIR
            *********************************/

            aoSair:
                async () => {

                    document
                        .querySelectorAll(
                            ".tela-sistema"
                        )
                        .forEach(
                            (tela) => {

                                tela.classList.remove(
                                    "tela-ativa"
                                );

                            }
                        );


                    document
                        .getElementById(
                            "inicio"
                        )
                        ?.classList.add(
                            "tela-ativa"
                        );


                    console.log(
                        "🔒 Sessão encerrada."
                    );

                }

        });

    }

);


/*************************************************
                    LOG FINAL
*************************************************/

console.log(
    "✅ script.js V4.3 carregado"
);
