/*************************************************
          SCRIPT.JS - SIRMED V4.5
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

export function abrirSecao(secaoId) {

    if (!secaoId) {

        return;

    }


    /*
        Verifica a permissão antes
        de abrir a tela.
    */

    if (!temPermissao(secaoId)) {

        alert(
            "Você não possui permissão para acessar esta área."
        );

        return;

    }


    const secao =
        document.getElementById(secaoId);


    if (!secao) {

        console.warn(
            "⚠️ Seção não encontrada:",
            secaoId
        );

        return;

    }


    /*
        Fecha todas as telas.
    */

    document
        .querySelectorAll(".tela-sistema")
        .forEach(tela => {

            tela.classList.remove(
                "tela-ativa"
            );

        });


    /*
        Abre a tela selecionada.
    */

    secao.hidden = false;

    secao.classList.add(
        "tela-ativa"
    );


    /*
        Atualiza botão ativo do menu.
    */

    document
        .querySelectorAll(".menu-item")
        .forEach(botao => {

            botao.classList.toggle(
                "ativo",
                botao.dataset.secao === secaoId
            );

        });


    /*
        Sempre atualiza o select
        quando abrir a Triagem.
    */

    if (secaoId === "secaoTriagem") {

        preencherPacientesTriagem();

    }


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

    if (perfil === "gestor") {

        await carregarPacientes();

        await carregarProfissionais();

        await carregarConsultas();

        await carregarProntuarios();

        await carregarGastos();

        await carregarTriagens();

        return;

    }


    /*************************************************
                    MÉDICO
    *************************************************/

    if (perfil === "medico") {

        await carregarPacientes();

        await carregarProfissionais();

        await carregarConsultas();

        await carregarProntuarios();

        await carregarTriagens();

        return;

    }


    /*************************************************
                    OPERADOR
    *************************************************/

    if (perfil === "operador") {

        await carregarPacientes();

        await carregarProfissionais();

        await carregarConsultas();

        await carregarGastos();

        return;

    }


    /*************************************************
                    TRIAGEM
    *************************************************/

    if (perfil === "triagem") {

        await carregarPacientes();

        await carregarTriagens();

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

    if (perfil === "gestor") {

        renderPacientes();

        renderProfissionais();

        renderConsultas();

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

    if (perfil === "medico") {

        renderPacientes();

        renderConsultas();

        renderProntuarios();


        /*
            Precisamos dos profissionais
            carregados para o select da consulta,
            mesmo que a tela Profissionais
            esteja oculta para o médico.
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
              INICIALIZAR USUÁRIO
*************************************************/

async function inicializarUsuario() {

    try {

        console.log(
            "🔄 Inicializando usuário..."
        );


        /*
            Primeiro aplica o menu
            conforme o perfil.
        */

        aplicarPermissoes();


        /*
            Depois carrega apenas os dados
            permitidos para aquele perfil.
        */

        await carregarTudo();


        /*
            Renderiza.
        */

        renderizarTudo();


        /*
            Reaplica as permissões para
            garantir que nenhuma renderização
            reexibiu uma tela proibida.
        */

        aplicarPermissoes();


        /*
            Abre início.
        */

        abrirSecao("inicio");


        console.log(
            "✅ SIRMED inicializado."
        );

    }

    catch (erro) {

        console.error(
            "❌ Erro ao inicializar SIRMED:",
            erro
        );


        /*
            O sistema continua aberto mesmo
            se algum carregamento falhar.
        */

        aplicarPermissoes();

    }

}


/*************************************************
                CONFIGURAR MENU
*************************************************/

function configurarMenu() {

    document
        .querySelectorAll(".menu-item")
        .forEach(botao => {

            botao.addEventListener(
                "click",
                () => {

                    const destino =
                        botao.dataset.secao;

                    if (destino) {

                        abrirSecao(destino);

                    }

                }
            );

        });

}


/*************************************************
            CONFIGURAR LOGIN
*************************************************/

function configurarLogin() {

    document
        .getElementById("btnEntrar")
        ?.addEventListener(
            "click",
            entrar
        );


    document
        .getElementById("btnSair")
        ?.addEventListener(
            "click",
            sair
        );


    document
        .getElementById("senha")
        ?.addEventListener(
            "keydown",
            evento => {

                if (evento.key === "Enter") {

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
          FILTRO DE PRONTUÁRIOS
*************************************************/

/*
    Não importamos filtrarProntuarios(),
    pois o prontuarios.js original
    não possui essa função.

    Fazemos o filtro diretamente aqui.
*/

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
                .forEach(li => {

                    li.style.display =

                        li.textContent
                            .toLowerCase()
                            .includes(filtro)

                            ? ""

                            : "none";

                });

        }
    );

}


/*************************************************
          ATUALIZAR APÓS CADASTROS
*************************************************/

/*
    Os módulos antigos chamam funções
    globais como atualizarDashboard()
    e preencherSelectsConsulta().

    Por isso garantimos que essas funções
    estejam disponíveis no window.
*/

window.atualizarDashboard =
    atualizarDashboard;


window.preencherSelectsConsulta =
    preencherSelectsConsulta;


window.preencherPacientesTriagem =
    preencherPacientesTriagem;


/*************************************************
            INICIAR APLICAÇÃO
*************************************************/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "🏥 Iniciando SIRMED V4.5..."
        );


        /*************************************************
                    EVENTOS
        *************************************************/

        configurarLogin();

        configurarMenu();

        configurarPacientes();

        configurarProfissionais();

        configurarConsultas();

        configurarProntuarios();

        configurarEventosTriagem();


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
    "✅ script.js V4.5 carregado"
);
