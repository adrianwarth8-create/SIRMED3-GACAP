/*************************************************
                SCRIPT.JS - SIRMED V4.2
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
                ABRIR UMA TELA
*************************************************/

export function abrirSecao(
    secaoId
) {

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


    /*
        Se a seção estiver bloqueada
        pelo perfil do usuário,
        não permite a abertura.
    */

    if (
        secao.hidden
    ) {

        mensagem(
            "Você não possui permissão para acessar esta área."
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
                ATUALIZAR MENU
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
                VOLTAR AO TOPO
    *************************************************/

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/*************************************************
            CONFIGURAR MENU PRINCIPAL
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
            SINCRONIZAR MENU E PERMISSÕES
*************************************************/

function sincronizarMenuPermissoes() {

    document
        .querySelectorAll(
            ".menu-item"
        )
        .forEach(
            (botao) => {

                const secaoId =
                    botao.dataset.secao;


                if (
                    !secaoId
                    ||
                    secaoId === "inicio"
                ) {

                    botao.hidden =
                        false;

                    return;

                }


                const secao =
                    document.getElementById(
                        secaoId
                    );


                /*
                    Se a seção foi escondida
                    pelas permissões,
                    o botão do menu também some.
                */

                botao.hidden =
                    !secao
                    ||
                    secao.hidden;

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
                        CARREGAR FIRESTORE
                    *********************************/

                    await carregarTudo();


                    /*********************************
                        RENDERIZAR INTERFACE
                    *********************************/

                    renderizarTudo();


                    /*********************************
                        PERMISSÕES
                    *********************************/

                    aplicarPermissoes();


                    /*********************************
                        MENU POR PERFIL
                    *********************************/

                    sincronizarMenuPermissoes();


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
                ENTER PARA LOGIN
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
            "🏥 SIRMED V4.2 carregado"
        );


        /*************************************
                EVENTOS
        *************************************/

        ligarEventos();


        /*************************************
                MENU
        *************************************/

        configurarMenu();


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


                    /*
                        Sempre abre o painel
                        inicial após o login.
                    */

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

                    /*
                        Retorna a navegação
                        para o início.
                    */

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
    "✅ script.js V4.2 carregado"
);
