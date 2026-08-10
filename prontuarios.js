/*************************************************
            PRONTUARIOS.JS - SIRMED V4.1
*************************************************/

import {
    db,
    collection,
    getDocs
} from "./firebase.js";

import {
    formatarData,
    escaparHTML
} from "./utils.js";


/*************************************************
                    VARIÁVEL
*************************************************/

const prontuarios = [];


/*************************************************
                OBTER PRONTUÁRIOS
*************************************************/

export function obterProntuarios() {

    return prontuarios;

}


/*************************************************
                CARREGAR PRONTUÁRIOS
*************************************************/

export async function carregarProntuarios() {

    const snap =
        await getDocs(
            collection(
                db,
                "prontuarios"
            )
        );


    prontuarios.length = 0;


    snap.forEach(
        (docSnap) => {

            prontuarios.push({

                id: docSnap.id,

                ...docSnap.data()

            });

        }
    );

}


/*************************************************
                RENDER PRONTUÁRIOS
*************************************************/

export function renderProntuarios() {

    const lista =
        document.getElementById(
            "listaProntuarios"
        );


    if (!lista) {

        return;

    }


    if (
        prontuarios.length === 0
    ) {

        lista.innerHTML = `

            <li class="lista-vazia">

                Nenhum prontuário encontrado.

            </li>

        `;

        return;

    }


    lista.innerHTML =

        prontuarios.map(
            (p) => `

                <li class="item-registro">

                    <strong>

                        📁 ${
                            escaparHTML(
                                p.pacienteNome || "-"
                            )
                        }

                    </strong>


                    <span>

                        <b>Profissional:</b>

                        ${
                            escaparHTML(
                                p.profissional || "-"
                            )
                        }

                    </span>


                    <span>

                        <b>Data:</b>

                        ${
                            escaparHTML(
                                formatarData(
                                    p.data
                                )
                            )
                        }

                    </span>


                    <span>

                        <b>Diagnóstico:</b>

                        ${
                            escaparHTML(
                                p.diagnostico || "-"
                            )
                        }

                    </span>


                    <div class="acoes-registro">

                        <button
                            type="button"
                            class="btn-visualizar"
                            data-ver-prontuario="${p.id}"
                        >
                            👁️ Ver prontuário
                        </button>


                        <button
                            type="button"
                            class="btn-imprimir-prontuario"
                            data-imprimir-prontuario="${p.id}"
                        >
                            🖨️ Imprimir
                        </button>


                        <button
                            type="button"
                            class="btn-pdf-prontuario"
                            data-pdf-prontuario="${p.id}"
                        >
                            📄 PDF
                        </button>

                    </div>

                </li>

            `
        ).join("");


    ligarBotoesProntuarios();

}


/*************************************************
            LIGAR BOTÕES PRONTUÁRIOS
*************************************************/

function ligarBotoesProntuarios() {

    document
        .querySelectorAll(
            "[data-ver-prontuario]"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    () => {

                        visualizarProntuario(
                            botao.dataset
                                .verProntuario
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-imprimir-prontuario]"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    () => {

                        imprimirProntuario(
                            botao.dataset
                                .imprimirProntuario
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-pdf-prontuario]"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    () => {

                        gerarPDFProntuario(
                            botao.dataset
                                .pdfProntuario
                        );

                    }
                );

            }
        );

}


/*************************************************
                BUSCAR PELO ID
*************************************************/

function obterProntuarioPorId(
    id
) {

    return prontuarios.find(
        (p) =>
            p.id === id
    );

}


/*************************************************
            VISUALIZAR PRONTUÁRIO
*************************************************/

export function visualizarProntuario(
    id
) {

    const prontuario =
        obterProntuarioPorId(
            id
        );


    if (!prontuario) {

        alert(
            "Prontuário não encontrado."
        );

        return;

    }


    /*************************************************
                CRIAR MODAL
    *************************************************/

    let modal =
        document.getElementById(
            "modalProntuario"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );


        modal.id =
            "modalProntuario";


        modal.className =
            "modal-prontuario";


        document.body.appendChild(
            modal
        );

    }


    modal.innerHTML = `

        <div class="modal-prontuario-conteudo">

            <button
                type="button"
                class="modal-fechar"
                id="fecharProntuario"
            >
                ✕
            </button>


            <div class="cabecalho-prontuario">

                <h2>
                    🏥 SIRMED
                </h2>

                <p>
                    Prontuário Clínico
                </p>

            </div>


            <div class="dados-prontuario">

                <h3>
                    👤 Dados do Atendimento
                </h3>


                <p>

                    <strong>Paciente:</strong>

                    ${
                        escaparHTML(
                            prontuario.pacienteNome || "-"
                        )
                    }

                </p>


                <p>

                    <strong>Profissional:</strong>

                    ${
                        escaparHTML(
                            prontuario.profissional || "-"
                        )
                    }

                </p>


                <p>

                    <strong>Data:</strong>

                    ${
                        escaparHTML(
                            formatarData(
                                prontuario.data
                            )
                        )
                    }

                </p>


                <hr>


                <h3>
                    🩺 Avaliação Clínica
                </h3>


                <p>

                    <strong>Queixa principal:</strong><br>

                    ${
                        escaparHTML(
                            prontuario.queixa || "-"
                        )
                    }

                </p>


                <p>

                    <strong>Pressão arterial:</strong>

                    ${
                        escaparHTML(
                            prontuario.pa || "-"
                        )
                    }

                </p>


                <p>

                    <strong>Frequência cardíaca:</strong>

                    ${
                        escaparHTML(
                            prontuario.fc || "-"
                        )
                    }

                </p>


                <p>

                    <strong>Temperatura:</strong>

                    ${
                        escaparHTML(
                            prontuario.temperatura || "-"
                        )
                    }

                </p>


                <hr>


                <h3>
                    🔎 Exame Físico
                </h3>

                <p class="texto-clinico">

                    ${
                        escaparHTML(
                            prontuario.exameFisico || "-"
                        )
                    }

                </p>


                <h3>
                    📋 Diagnóstico
                </h3>

                <p class="texto-clinico">

                    ${
                        escaparHTML(
                            prontuario.diagnostico || "-"
                        )
                    }

                </p>


                <h3>
                    💊 Prescrição
                </h3>

                <p class="texto-clinico">

                    ${
                        escaparHTML(
                            prontuario.prescricao || "-"
                        )
                    }

                </p>


                <h3>
                    📝 Observações
                </h3>

                <p class="texto-clinico">

                    ${
                        escaparHTML(
                            prontuario.observacoes || "-"
                        )
                    }

                </p>

            </div>


            <div class="acoes-registro">

                <button
                    type="button"
                    id="modalImprimirProntuario"
                    class="btn-imprimir-prontuario"
                >
                    🖨️ Imprimir
                </button>


                <button
                    type="button"
                    id="modalPDFProntuario"
                    class="btn-pdf-prontuario"
                >
                    📄 Gerar PDF
                </button>

            </div>

        </div>

    `;


    modal.style.display =
        "flex";


    /*************************************************
                    FECHAR
    *************************************************/

    document
        .getElementById(
            "fecharProntuario"
        )
        ?.addEventListener(
            "click",
            () => {

                modal.style.display =
                    "none";

            }
        );


    /*************************************************
                    IMPRIMIR
    *************************************************/

    document
        .getElementById(
            "modalImprimirProntuario"
        )
        ?.addEventListener(
            "click",
            () => {

                imprimirProntuario(
                    id
                );

            }
        );


    /*************************************************
                        PDF
    *************************************************/

    document
        .getElementById(
            "modalPDFProntuario"
        )
        ?.addEventListener(
            "click",
            () => {

                gerarPDFProntuario(
                    id
                );

            }
        );


    /*************************************************
            FECHAR CLICANDO FORA
    *************************************************/

    modal.onclick =
        (evento) => {

            if (
                evento.target ===
                modal
            ) {

                modal.style.display =
                    "none";

            }

        };

}


/*************************************************
                IMPRIMIR PRONTUÁRIO
*************************************************/

export function imprimirProntuario(
    id
) {

    const p =
        obterProntuarioPorId(
            id
        );


    if (!p) {

        alert(
            "Prontuário não encontrado."
        );

        return;

    }


    const janela =
        window.open(
            "",
            "_blank"
        );


    if (!janela) {

        alert(
            "O navegador bloqueou a janela de impressão."
        );

        return;

    }


    janela.document.write(`

        <!DOCTYPE html>

        <html lang="pt-BR">

        <head>

            <meta charset="UTF-8">

            <title>
                Prontuário - ${
                    escaparHTML(
                        p.pacienteNome || ""
                    )
                }
            </title>


            <style>

                body {

                    font-family:
                        Arial,
                        sans-serif;

                    color:
                        #222;

                    padding:
                        35px;

                    line-height:
                        1.5;

                }


                h1 {

                    color:
                        #1565C0;

                    margin-bottom:
                        0;

                }


                h2 {

                    margin-top:
                        5px;

                }


                h3 {

                    color:
                        #1565C0;

                    margin-top:
                        25px;

                }


                .cabecalho {

                    border-bottom:
                        2px solid #1565C0;

                    padding-bottom:
                        15px;

                    margin-bottom:
                        25px;

                }


                .campo {

                    margin-bottom:
                        12px;

                }


                .assinatura {

                    margin-top:
                        70px;

                    text-align:
                        center;

                }


                .linha-assinatura {

                    width:
                        300px;

                    border-top:
                        1px solid #000;

                    margin:
                        auto;

                    padding-top:
                        5px;

                }

            </style>

        </head>


        <body>

            <div class="cabecalho">

                <h1>
                    SIRMED
                </h1>

                <h2>
                    Prontuário Clínico
                </h2>

            </div>


            <div class="campo">

                <strong>Paciente:</strong>

                ${
                    escaparHTML(
                        p.pacienteNome || "-"
                    )
                }

            </div>


            <div class="campo">

                <strong>Profissional:</strong>

                ${
                    escaparHTML(
                        p.profissional || "-"
                    )
                }

            </div>


            <div class="campo">

                <strong>Data:</strong>

                ${
                    escaparHTML(
                        formatarData(
                            p.data
                        )
                    )
                }

            </div>


            <h3>
                Avaliação Clínica
            </h3>


            <div class="campo">

                <strong>Queixa principal:</strong><br>

                ${
                    escaparHTML(
                        p.queixa || "-"
                    )
                }

            </div>


            <div class="campo">

                <strong>Pressão arterial:</strong>

                ${
                    escaparHTML(
                        p.pa || "-"
                    )
                }

            </div>


            <div class="campo">

                <strong>Frequência cardíaca:</strong>

                ${
                    escaparHTML(
                        p.fc || "-"
                    )
                }

            </div>


            <div class="campo">

                <strong>Temperatura:</strong>

                ${
                    escaparHTML(
                        p.temperatura || "-"
                    )
                }

            </div>


            <h3>
                Exame Físico
            </h3>

            <p>
                ${
                    escaparHTML(
                        p.exameFisico || "-"
                    )
                }
            </p>


            <h3>
                Diagnóstico
            </h3>

            <p>
                ${
                    escaparHTML(
                        p.diagnostico || "-"
                    )
                }
            </p>


            <h3>
                Prescrição
            </h3>

            <p>
                ${
                    escaparHTML(
                        p.prescricao || "-"
                    )
                }
            </p>


            <h3>
                Observações
            </h3>

            <p>
                ${
                    escaparHTML(
                        p.observacoes || "-"
                    )
                }
            </p>


            <div class="assinatura">

                <div class="linha-assinatura">

                    ${
                        escaparHTML(
                            p.profissional || "Profissional responsável"
                        )
                    }

                </div>

            </div>

        </body>

        </html>

    `);


    janela.document.close();


    janela.focus();


    setTimeout(
        () => {

            janela.print();

        },
        300
    );

}


/*************************************************
                GERAR PDF INDIVIDUAL
*************************************************/

export function gerarPDFProntuario(
    id
) {

    const p =
        obterProntuarioPorId(
            id
        );


    if (!p) {

        alert(
            "Prontuário não encontrado."
        );

        return;

    }


    if (
        !window.jspdf
        ||
        !window.jspdf.jsPDF
    ) {

        alert(
            "Biblioteca de PDF não carregada."
        );

        return;

    }


    const {
        jsPDF
    } = window.jspdf;


    const pdf =
        new jsPDF();


    /*************************************************
                    CABEÇALHO
    *************************************************/

    pdf.setFontSize(
        20
    );


    pdf.setTextColor(
        21,
        101,
        192
    );


    pdf.text(
        "SIRMED",
        15,
        18
    );


    pdf.setFontSize(
        13
    );


    pdf.setTextColor(
        40,
        40,
        40
    );


    pdf.text(
        "Prontuário Clínico",
        15,
        27
    );


    pdf.line(
        15,
        32,
        195,
        32
    );


    let y =
        43;


    /*************************************************
                FUNÇÃO PARA TEXTO
    *************************************************/

    function adicionarCampo(
        titulo,
        valor
    ) {

        if (
            y > 270
        ) {

            pdf.addPage();

            y =
                20;

        }


        pdf.setFont(
            "helvetica",
            "bold"
        );


        pdf.text(
            titulo,
            15,
            y
        );


        y +=
            6;


        pdf.setFont(
            "helvetica",
            "normal"
        );


        const linhas =
            pdf.splitTextToSize(
                String(
                    valor || "-"
                ),
                175
            );


        if (
            y +
            linhas.length * 6
            >
            280
        ) {

            pdf.addPage();

            y =
                20;

        }


        pdf.text(
            linhas,
            15,
            y
        );


        y +=
            linhas.length * 6 +
            5;

    }


    /*************************************************
                    DADOS
    *************************************************/

    adicionarCampo(
        "Paciente:",
        p.pacienteNome
    );


    adicionarCampo(
        "Profissional:",
        p.profissional
    );


    adicionarCampo(
        "Data:",
        formatarData(
            p.data
        )
    );


    adicionarCampo(
        "Queixa principal:",
        p.queixa
    );


    adicionarCampo(
        "Pressão arterial:",
        p.pa
    );


    adicionarCampo(
        "Frequência cardíaca:",
        p.fc
    );


    adicionarCampo(
        "Temperatura:",
        p.temperatura
    );


    adicionarCampo(
        "Exame Físico:",
        p.exameFisico
    );


    adicionarCampo(
        "Diagnóstico:",
        p.diagnostico
    );


    adicionarCampo(
        "Prescrição:",
        p.prescricao
    );


    adicionarCampo(
        "Observações:",
        p.observacoes
    );


    /*************************************************
                    SALVAR
    *************************************************/

    const nomeArquivo =
        String(
            p.pacienteNome ||
            "Paciente"
        )
        .replace(
            /[^a-zA-ZÀ-ÿ0-9]/g,
            "_"
        );


    pdf.save(
        `Prontuario_${nomeArquivo}.pdf`
    );

}


/*************************************************
            BUSCAR POR PACIENTE
*************************************************/

export function buscarProntuariosPaciente(
    nomePaciente
) {

    return prontuarios.filter(
        (p) =>

            String(
                p.pacienteNome || ""
            )
            .toLowerCase()
            .includes(

                String(
                    nomePaciente || ""
                )
                .toLowerCase()

            )
    );

}


/*************************************************
            FILTRAR NA INTERFACE
*************************************************/

export function filtrarProntuarios() {

    const filtro =
        (
            document
                .getElementById(
                    "pesquisaProntuario"
                )
                ?.value
            || ""
        )
        .toLowerCase();


    document
        .querySelectorAll(
            "#listaProntuarios li"
        )
        .forEach(
            (li) => {

                li.style.display =

                    li
                        .textContent
                        .toLowerCase()
                        .includes(
                            filtro
                        )

                    ? ""

                    : "none";

            }
        );

}


/*************************************************
                TOTAL PRONTUÁRIOS
*************************************************/

export function totalProntuarios() {

    return prontuarios.length;

}


/*************************************************
                    LOG
*************************************************/

console.log(
    "✅ prontuarios.js V4.1 carregado"
);
