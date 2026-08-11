/*************************************************
          SCRIPT.JS - SIRMED V4.8
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
    carregarPacientes,
    cadastrarPaciente,
    renderPacientes,
    filtrarPacientes
} from "./pacientes.js";


/*************************************************
                PROFISSIONAIS
*************************************************/

import {
    carregarProfissionais,
    cadastrarProfissional,
    renderProfissionais,
    filtrarProfissionais
} from "./profissionais.js";


/*************************************************
                  CONSULTAS
*************************************************/

import {
    carregarConsultas,
    registrarConsulta,
    renderConsultas,
    filtrarConsultas,
    preencherSelectsConsulta
} from "./consultas.js";


/*************************************************
                  HISTÓRICO
*************************************************/

import {
    renderHistorico,
    configurarEventosHistorico
} from "./historico.js";


/*************************************************
                PRONTUÁRIOS
*************************************************/

import {
    carregarProntuarios,
    renderProntuarios
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
    configurarEventosRelatorios
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
          CONTROLE DE ATUALIZAÇÃO
*************************************************/

let atualizacaoEmAndamento =
    false;


/*************************************************
              OBTER PERFIL ATUAL
*************************************************/

function obterPerfil() {

    return String(
        perfilUsuarioAtual() || ""
    )
    .trim()
    .toLowerCase();

}


/*************************************************
              ABRIR UMA SEÇÃO
*************************************************/

export function abrirSecao(
    secaoId
) {

    if (!secaoId) {

        return;

    }


    /*************************************************
                VERIFICAR PERMISSÃO
    *************************************************/

    if (
        !temPermissao(
            secaoId
        )
    ) {

        alert(
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
            "⚠️ Seção não encontrada:",
            secaoId
        );

        return;

    }


    /*************************************************
                FECHAR OUTRAS TELAS
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
                ABRIR SEÇÃO
    *************************************************/

    secao.hidden =
        false;


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


    /*************************************************
                ABRIR TRIAGEM
    *************************************************/

    if (
        secaoId ===
        "secaoTriagem"
    ) {

        preencherPacientesTriagem();

    }


    /*************************************************
                ABRIR CONSULTAS
    *************************************************/

    if (
        secaoId ===
        "secaoConsultas"
    ) {

        preencherSelectsConsulta();

    }


    /*************************************************
                ABRIR HISTÓRICO
    *************************************************/

    if (
        secaoId ===
        "secaoHistorico"
    ) {

        renderHistorico();

    }


    /*************************************************
                  TOPO DA TELA
    *************************************************/

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/*************************************************
                CARREGAR DADOS
*************************************************/

export async function carregarTudo() {

    const perfil =
        obterPerfil();


    console.log(
        "📥 Carregando SIRMED para:",
        perfil
    );


    /*************************************************
                    GESTOR
    *************************************************/

    if (
        perfil ===
        "gestor"
    ) {

        await Promise.all([

            carregarPacientes(),

            carregarProfissionais(),

            carregarConsultas(),

            carregarProntuarios(),

            carregarGastos(),

            carregarTriagens()

        ]);


        return;

    }


    /*************************************************
                    MÉDICO
    *************************************************/

    if (
        perfil ===
        "medico"
    ) {

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

    if (
        perfil ===
        "operador"
    ) {

        /*
            O operador vê:

            - Início
            - Financeiro
            - Relatórios

            Mas os relatórios precisam
            carregar os dados de:

            - Pacientes
            - Profissionais
            - Consultas
            - Financeiro
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

    if (
        perfil ===
        "triagem"
    ) {

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
              RENDERIZAR DADOS
*************************************************/

export function renderizarTudo() {

    const perfil =
        obterPerfil();


    /*************************************************
                    GESTOR
    *************************************************/

    if (
        perfil ===
        "gestor"
    ) {

        renderPacientes();

        renderProfissionais();

        renderConsultas();

        renderHistorico();

        renderProntuarios();

        renderGastos();

        renderTriagens();


        preencherSelectsConsulta();

        preencherPacientesTriagem();


        atualizarDashboard();


        return;

    }


    /*************************************************
                    MÉDICO
    *************************************************/

    if (
        perfil ===
        "medico"
    ) {

        renderPacientes();

        renderConsultas();

        renderHistorico();

        renderProntuarios();


        /*
            O médico precisa
            dos profissionais e pacientes
            no select de consulta.
        */

        preencherSelectsConsulta();


        atualizarDashboard();


        return;

    }


    /*************************************************
                    OPERADOR
    *************************************************/

    if (
        perfil ===
        "operador"
    ) {

        /*
            Não mostramos pacientes,
            profissionais ou consultas
            para o operador.

            Eles são carregados somente
            em memória para gerar relatórios.
        */

        renderGastos();


        atualizarDashboard();


        return;

    }


    /*************************************************
                    TRIAGEM
    *************************************************/

    if (
        perfil ===
        "triagem"
    ) {

        renderPacientes();

        renderTriagens();

        preencherPacientesTriagem();

        atualizarDashboard();


        return;

    }

}


/*************************************************
          ATUALIZAR SISTEMA COMPLETO
*************************************************/

async function atualizarSistema() {

    if (
        atualizacaoEmAndamento
    ) {

        console.log(
            "⏳ Atualização já em andamento."
        );

        return;

    }


    atualizacaoEmAndamento =
        true;


    try {

        console.log(
            "🔄 Atualizando dados do SIRMED..."
        );


        /*************************************************
                RECARREGAR FIRESTORE
        *************************************************/

        await carregarTudo();


        /*************************************************
                    RENDERIZAR
        *************************************************/

        renderizarTudo();


        /*************************************************
                REAPLICAR PERMISSÕES
        *************************************************/

        aplicarPermissoes();


        console.log(
            "✅ Dados do SIRMED atualizados."
        );

    }

    catch (erro) {

        console.error(
            "❌ Erro ao atualizar SIRMED:",
            erro
        );

    }

    finally {

        atualizacaoEmAndamento =
            false;

    }

}


/*************************************************
            INICIALIZAR USUÁRIO
*************************************************/

async function inicializarUsuario() {

    try {

        console.log(
            "🔄 Inicializando usuário..."
        );


        /*************************************************
                APLICAR PERMISSÕES
        *************************************************/

        aplicarPermissoes();


        /*************************************************
                  CARREGAR DADOS
        *************************************************/

        await carregarTudo();


        /*************************************************
                    RENDERIZAR
        *************************************************/

        renderizarTudo();


        /*************************************************
                REAPLICAR PERMISSÕES
        *************************************************/

        aplicarPermissoes();


        /*************************************************
                    ABRIR INÍCIO
        *************************************************/

        abrirSecao(
            "inicio"
        );


        console.log(
            "✅ SIRMED inicializado."
        );

    }

    catch (erro) {

        console.error(
            "❌ Erro ao inicializar SIRMED:",
            erro
        );


        aplicarPermissoes();

    }

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

                        const destino =
                            botao.dataset.secao;


                        if (!destino) {

                            return;

                        }


                        abrirSecao(
                            destino
                        );

                    }

                );

            }
        );

}


/*************************************************
            CONFIGURAR LOGIN
*************************************************/

function configurarLogin() {

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


    /*************************************************
                  ENTER NA SENHA
    *************************************************/

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

}


/*************************************************
          CONFIGURAR PACIENTES
*************************************************/

function configurarPacientes() {

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

}


/*************************************************
        CONFIGURAR PROFISSIONAIS
*************************************************/

function configurarProfissionais() {

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

}


/*************************************************
          CONFIGURAR CONSULTAS
*************************************************/

function configurarConsultas() {

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

}


/*************************************************
          CONFIGURAR PRONTUÁRIOS
*************************************************/

function configurarProntuarios() {

    const pesquisa =
        document.getElementById(
            "pesquisaProntuario"
        );


    if (!pesquisa) {

        return;

    }


    pesquisa.addEventListener(

        "input",

        () => {

            const filtro =
                pesquisa.value
                    .trim()
                    .toLowerCase();


            document
                .querySelectorAll(
                    "#listaProntuarios li"
                )
                .forEach(
                    (li) => {

                        li.style.display =

                            li.textContent
                                .toLowerCase()
                                .includes(
                                    filtro
                                )

                                ? ""

                                : "none";

                    }
                );

        }

    );

}


/*************************************************
        EVENTO GLOBAL: DADOS ALTERADOS
*************************************************/

function configurarAtualizacaoAutomatica() {

    document.addEventListener(

        "sirmed:dados-alterados",

        async () => {

            console.log(
                "🔔 Alteração detectada no SIRMED."
            );


            await atualizarSistema();


            const perfil =
                obterPerfil();


            /*************************************************
                    TRIAGEM
            *************************************************/

            if (
                perfil === "triagem"
                ||
                perfil === "gestor"
            ) {

                preencherPacientesTriagem();

            }


            /*************************************************
                    CONSULTAS
            *************************************************/

            if (
                perfil === "medico"
                ||
                perfil === "gestor"
            ) {

                preencherSelectsConsulta();

            }


            /*************************************************
                    HISTÓRICO
            *************************************************/

            if (
                perfil === "medico"
                ||
                perfil === "gestor"
            ) {

                renderHistorico();

            }

        }

    );

}


/*************************************************
          EXPORTAÇÕES GLOBAIS
*************************************************/

window.atualizarDashboard =
    atualizarDashboard;


window.preencherSelectsConsulta =
    preencherSelectsConsulta;


window.preencherPacientesTriagem =
    preencherPacientesTriagem;


window.renderHistorico =
    renderHistorico;


window.carregarTudo =
    carregarTudo;


window.renderizarTudo =
    renderizarTudo;


window.abrirSecao =
    abrirSecao;


/*************************************************
            INICIAR APLICAÇÃO
*************************************************/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        console.log(
            "🏥 Iniciando SIRMED V4.8..."
        );


        /*************************************************
                    LOGIN E MENU
        *************************************************/

        configurarLogin();

        configurarMenu();


        /*************************************************
                    CADASTROS
        *************************************************/

        configurarPacientes();

        configurarProfissionais();

        configurarConsultas();

        configurarProntuarios();


        /*************************************************
                    TRIAGEM
        *************************************************/

        configurarEventosTriagem();


        /*************************************************
                    HISTÓRICO
        *************************************************/

        configurarEventosHistorico();


        /*************************************************
                    RELATÓRIOS
        *************************************************/

        configurarEventosRelatorios();


        /*************************************************
              ATUALIZAÇÃO AUTOMÁTICA
        *************************************************/

        configurarAtualizacaoAutomatica();


        /*************************************************
                  AUTENTICAÇÃO
        *************************************************/

        iniciarObservadorAuth({

            aoEntrar:

                async () => {

                    await inicializarUsuario();

                },


            aoSair:

                async () => {

                    console.log(
                        "🔒 Usuário desconectado."
                    );

                }

        });

    }

);


/*************************************************
                    LOG
*************************************************/

console.log(
    "✅ script.js V4.8 + Histórico + Relatórios carregado"
);
