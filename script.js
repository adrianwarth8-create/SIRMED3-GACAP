/*************************************************
              SCRIPT.JS - SIRMED V4.4
*************************************************/


/*************************************************
                    LOGIN
*************************************************/

import {
    entrar,
    sair,
    iniciarObservadorAuth,
    perfilUsuarioAtual
} from "./login.js";


/*************************************************
                  PACIENTES
*************************************************/

import {
    cadastrarPaciente,
    carregarPacientes,
    renderPacientes,
    filtrarPacientes
} from "./pacientes.js";


/*************************************************
                PROFISSIONAIS
*************************************************/

import {
    cadastrarProfissional,
    carregarProfissionais,
    renderProfissionais,
    filtrarProfissionais
} from "./profissionais.js";


/*************************************************
                  CONSULTAS
*************************************************/

import {
    registrarConsulta,
    carregarConsultas,
    renderConsultas,
    filtrarConsultas,
    preencherSelectsConsulta
} from "./consultas.js";


/*************************************************
                PRONTUÁRIOS
*************************************************/

import {
    carregarProntuarios,
    renderProntuarios,
    filtrarProntuarios
} from "./prontuarios.js";


/*************************************************
                  FINANCEIRO
*************************************************/

import {
    carregarGastos,
    renderGastos
} from "./financeiro.js";


/*************************************************
                    TRIAGEM
*************************************************/

import {
    carregarTriagens,
    renderTriagens,
    preencherPacientesTriagem,
    configurarEventosTriagem
} from "./triagem.js";


/*************************************************
                  RELATÓRIOS
*************************************************/

import {
    gerarPDF,
    gerarWord,
    preencherRelatorioPaciente,
    preencherRelatorioProfissional
} from "./relatorios.js";


/*************************************************
                  DASHBOARD
*************************************************/

import {
    atualizarDashboard
} from "./dashboard.js";


/*************************************************
                  PERMISSÕES
*************************************************/

import {
    aplicarPermissoes,
    temPermissao
} from "./permissoes.js";


/*************************************************
                    UTILS
*************************************************/

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
              OBTER PERFIL
*************************************************/

function obterPerfil() {

    return String(
        perfilUsuarioAtual() || ""
    )
    .trim()
    .toLowerCase();

}


/*************************************************
            CARREGAR TUDO
*************************************************/

export async function carregarTudo() {

    const perfil =
        obterPerfil();


    console.log(
        "📥 Carregando dados para:",
        perfil
    );


    /*************************************************
                    GESTOR
    *************************************************/

    if (perfil === "gestor") {

        await Promise.all([

            carregarPacientes(),

            carregarProfissionais(),

            carregarConsultas(),

            carregarProntuarios(),

            carregarTriagens(),

            carregarGastos()

        ]);

        return;

    }


    /*************************************************
                    MÉDICO
    *************************************************/

    if (perfil === "medico") {

        await Promise.all([

            carregarPacientes(),

            carregarProfissionais(),

            carregarConsultas(),

            carregarProntuarios(),

            carregarTriagens()

        ]);

        return;

    }


    /*************************************************
                    OPERADOR
    *************************************************/

    if (perfil === "operador") {

        /*
            O operador visualiza:

            - Início
            - Financeiro
            - Relatórios

            Os relatórios atuais utilizam
            pacientes, profissionais e consultas.
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
                    TRIAGEM
    *************************************************/

    if (perfil === "triagem") {

        /*
            O perfil Triagem acessa:

            - Início
            - Pacientes
            - Triagem
        */

        await Promise.all([

            carregarPacientes(),

            carregarTriagens()

        ]);

        return;

    }


    console.warn(
        "⚠️ Perfil não reconhecido:",
        perfil
    );

}


/*************************************************
            RENDERIZAR TUDO
*************************************************/

export function renderizarTudo() {

    const perfil =
        obterPerfil();


    /*************************************************
                    GESTOR
    *************************************************/

    if (perfil === "gestor") {

        renderPacientes();

        renderProfissionais();

        renderConsultas();

        renderProntuarios();

        renderTriagens();

        renderGastos();


        preencherSelectsConsulta();

        preencherPacientesTriagem();

        preencherRelatorioPaciente();

        preencherRelatorioProfissional();


        atualizarDashboard();

        return;

    }


    /*************************************************
                    MÉDICO
    *************************************************/

    if (perfil === "medico") {

        renderPacientes();

        renderProfissionais();

        renderConsultas();

        renderProntuarios();


        /*
            O médico não possui a tela
            de Triagem no menu.

            Porém os dados estão carregados
            para posteriormente aparecerem
            dentro da Consulta.
        */

        preencherSelectsConsulta();


        atualizarDashboard();

        return;

    }


    /*************************************************
                    OPERADOR
    *************************************************/

    if (perfil === "operador") {

        renderGastos();


        preencherRelatorioPaciente();

        preencherRelatorioProfissional();


        atualizarDashboard();

        return;

    }


    /*************************************************
                    TRIAGEM
    *************************************************/

    if (perfil === "triagem") {

        renderPacientes();

        renderTriagens();


        preencherPacientesTriagem();


        atualizarDashboard();

        return;

    }

}


/*************************************************
                ABRIR SEÇÃO
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
                ABRIR ESCOLHIDA
    *************************************************/

    secao.hidden =
        false;


    secao.classList.add(
        "tela-ativa"
    );


    /*************************************************
                MENU ATIVO
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


    /*************************************************
            ATUALIZAÇÕES DA TRIAGEM
    *************************************************/

    if (
        secaoId ===
        "secaoTriagem"
    ) {

        preencherPacientesTriagem();

    }


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
                        "🔄 Atualizando SIRMED..."
                    );


                    aplicarPermissoes();


                    await carregarTudo();


                    renderizarTudo();


                    aplicarPermissoes();


                    console.log(
                        "✅ SIRMED atualizado."
                    );

                }

                catch (erro) {

                    console.error(
                        "❌ Erro ao atualizar SIRMED:",
                        erro
                    );


                    mensagem(
                        "Erro ao carregar os dados permitidos para este usuário."
                    );

                }

                finally {

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

            () => {

                /*
                    Mantém compatibilidade caso
                    a função esteja exposta
                    globalmente.
                */

                if (
                    typeof window.filtrarProntuarios
                    ===
                    "function"
                ) {

                    window.filtrarProntuarios();

                }

            }

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
            "🏥 SIRMED V4.4 iniciando..."
        );


        /*************************************************
                    EVENTOS GERAIS
        *************************************************/

        ligarEventos();


        /*************************************************
                    EVENTOS TRIAGEM
        *************************************************/

        configurarEventosTriagem();


        /*************************************************
                        MENU
        *************************************************/

        configurarMenu();


        /*************************************************
                OBSERVADOR DE LOGIN
        *************************************************/

        iniciarObservadorAuth({

            aoEntrar:
                async () => {

                    aplicarPermissoes();


                    await atualizarSistema();


                    abrirSecao(
                        "inicio"
                    );


                    console.log(
                        "🔓 Usuário autenticado."
                    );

                },


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


                    const inicio =
                        document.getElementById(
                            "inicio"
                        );


                    if (inicio) {

                        inicio.classList.add(
                            "tela-ativa"
                        );

                    }


                    console.log(
                        "🔒 Sessão encerrada."
                    );

                }

        });

    }

);


/*************************************************
              EXPORTAÇÃO GLOBAL
*************************************************/

window.carregarTudo =
    carregarTudo;


window.renderizarTudo =
    renderizarTudo;


window.abrirSecao =
    abrirSecao;


/*************************************************
                    LOG
*************************************************/

console.log(
    "✅ script.js V4.4 carregado"
);
