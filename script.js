/*************************************************
                SCRIPT.JS - SIRMED V4
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

    /*
        Impede duas atualizações completas
        ao mesmo tempo.
    */

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
                        CARREGAR FIRESTORE
                    *********************************/

                    await carregarTudo();


                    /*********************************
                        ATUALIZAR INTERFACE
                    *********************************/

                    renderizarTudo();


                    /*********************************
                        APLICAR PERMISSÕES
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

document
    .getElementById(
        "pesquisaProntuario"
    )
    ?.addEventListener(
        "input",
        filtrarProntuarios
    );

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
        EVENTO INTERNO DE ATUALIZAÇÃO DO SIRMED
    *************************************************/
function ligareventos() {

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
            "🏥 SIRMED V4 carregado"
        );


        /*************************************
                LIGAR EVENTOS
        *************************************/

        ligarEventos();


        /*************************************
            OBSERVAR AUTENTICAÇÃO
        *************************************/

        iniciarObservadorAuth({

            /*********************************
                    AO ENTRAR
            *********************************/

            aoEntrar:
                async () => {

                    await atualizarSistema();


                    mensagem(
                        "Bem-vindo ao SIRMED - BY CB WARTH"
                    );

                },


            /*********************************
                    AO SAIR
            *********************************/

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
    "✅ script.js carregado"
);
