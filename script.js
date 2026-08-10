/*************************************************
                SCRIPT.JS - SIRMED V4.1
*************************************************/

import {
    entrar,
    sair,
    iniciarObservadorAuth
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
    aplicarPermissoes
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
                CARREGAR TUDO
*************************************************/

export async function carregarTudo() {

    await Promise.all([

        carregarPacientes(),

        carregarProfissionais(),

        carregarConsultas(),

        carregarProntuarios(),

        carregarGastos()

    ]);

}


/*************************************************
                RENDERIZAR TUDO
*************************************************/

export function renderizarTudo() {

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


                    await carregarTudo();


                    renderizarTudo();


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
                        "Erro ao carregar os dados do SIRMED."
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


    /*************************************************
                FORMATAÇÃO CPF
    *************************************************/

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


    /*************************************************
            FORMATAÇÃO TELEFONE
    *************************************************/

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
            EVENTO INTERNO DO SIRMED
    *************************************************/

    document
        .addEventListener(
            "sirmed:dados-alterados",
            atualizarSistema
        );

}


/*************************************************
            INICIAR O SIRMED
*************************************************/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        console.log(
            "🏥 SIRMED V4.1 carregado"
        );


        /*************************************
                LIGAR EVENTOS
        *************************************/

        ligarEventos();


        /*************************************
            OBSERVAR AUTENTICAÇÃO
        *************************************/

        iniciarObservadorAuth({

            aoEntrar:
                async () => {

                    await atualizarSistema();


                    mensagem(
                        "Bem-vindo ao SIRMED - BY CB WARTH"
                    );

                },


            aoSair:
                async () => {

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
    "✅ script.js V4.1 carregado"
);
