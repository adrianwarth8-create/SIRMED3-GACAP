/*************************************************
              RELATORIOS.JS - SIRMED V4
*************************************************/

import {
    obterPacientes
} from "./pacientes.js";

import {
    obterProfissionais
} from "./profissionais.js";

import {
    obterConsultas
} from "./consultas.js";

import {
    formatarData
} from "./utils.js";


/*************************************************
        PREENCHER RELATÓRIO DE PACIENTE
*************************************************/

export function preencherRelatorioPaciente() {

    const select =
        document.getElementById(
            "relatorioPaciente"
        );


    if (!select) {

        return;

    }


    const valorAtual =
        select.value;


    select.innerHTML =
        `
            <option value="">
                Todos os pacientes
            </option>
        `;


    obterPacientes()
        .forEach(
            (p) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    p.id;


                option.textContent =
                    p.nome;


                select.appendChild(
                    option
                );

            }
        );


    if (
        [
            ...select.options
        ]
        .some(
            (option) =>
                option.value === valorAtual
        )
    ) {

        select.value =
            valorAtual;

    }

}


/*************************************************
      PREENCHER RELATÓRIO PROFISSIONAL
*************************************************/

export function preencherRelatorioProfissional() {

    const select =
        document.getElementById(
            "relatorioProfissional"
        );


    if (!select) {

        return;

    }


    const valorAtual =
        select.value;


    select.innerHTML =
        `
            <option value="">
                Todos os profissionais
            </option>
        `;


    obterProfissionais()
        .forEach(
            (p) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    p.id;


                option.textContent =
                    p.nome;


                select.appendChild(
                    option
                );

            }
        );


    if (
        [
            ...select.options
        ]
        .some(
            (option) =>
                option.value === valorAtual
        )
    ) {

        select.value =
            valorAtual;

    }

}


/*************************************************
                CONSULTAS FILTRADAS
*************************************************/

export function consultasFiltradas() {

    const pacienteId =
        document
            .getElementById(
                "relatorioPaciente"
            )
            ?.value
        || "";


    const profissionalId =
        document
            .getElementById(
                "relatorioProfissional"
            )
            ?.value
        || "";


    const dataInicial =
        document
            .getElementById(
                "dataInicial"
            )
            ?.value
        || "";


    const dataFinal =
        document
            .getElementById(
                "dataFinal"
            )
            ?.value
        || "";


    const pacienteSelecionado =
        obterPacientes()
            .find(
                (p) =>
                    p.id === pacienteId
            );


    const profissionalSelecionado =
        obterProfissionais()
            .find(
                (p) =>
                    p.id === profissionalId
            );


    return obterConsultas()
        .filter(
            (c) => {

                /*************************************
                        PACIENTE
                *************************************/

                const pacienteOK =

                    !pacienteId

                    ||

                    c.pacienteId === pacienteId

                    ||

                    (
                        !c.pacienteId
                        &&
                        pacienteSelecionado
                        &&
                        c.paciente ===
                            pacienteSelecionado.nome
                    );


                /*************************************
                        PROFISSIONAL
                *************************************/

                const profissionalOK =

                    !profissionalId

                    ||

                    c.profissionalId ===
                        profissionalId

                    ||

                    (
                        !c.profissionalId
                        &&
                        profissionalSelecionado
                        &&
                        c.profissional ===
                            profissionalSelecionado.nome
                    );


                /*************************************
                            DATA
                *************************************/

                const dataConsulta =
                    normalizarDataFiltro(
                        c.data
                    );


                const inicialOK =

                    !dataInicial

                    ||

                    (
                        dataConsulta
                        &&
                        dataConsulta >=
                            dataInicial
                    );


                const finalOK =

                    !dataFinal

                    ||

                    (
                        dataConsulta
                        &&
                        dataConsulta <=
                            dataFinal
                    );


                return (

                    pacienteOK
                    &&
                    profissionalOK
                    &&
                    inicialOK
                    &&
                    finalOK

                );

            }
        );

}


/*************************************************
            NORMALIZAR DATA DO FILTRO
*************************************************/

function normalizarDataFiltro(
    data
) {

    if (!data) {

        return "";

    }


    const texto =
        String(data);


    /*************************************************
                    YYYY-MM-DD
    *************************************************/

    if (
        /^\d{4}-\d{2}-\d{2}$/
        .test(texto)
    ) {

        return texto;

    }


    /*************************************************
                    DD/MM/YYYY
    *************************************************/

    const dataBR =
        texto.match(
            /^(\d{2})\/(\d{2})\/(\d{4})$/
        );


    if (dataBR) {

        return `${dataBR[3]}-${dataBR[2]}-${dataBR[1]}`;

    }


    return "";

}


/*************************************************
                    GERAR PDF
*************************************************/

export async function gerarPDF() {

    /*************************************************
                VERIFICAR jsPDF
    *************************************************/

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


    const lista =
        consultasFiltradas();


    /*************************************************
                    CABEÇALHO
    *************************************************/

    pdf.setFontSize(
        18
    );


    pdf.text(
        "SIRMED",
        15,
        18
    );


    pdf.setFontSize(
        11
    );


    pdf.text(
        "Sistema Integrado de Registros Médicos",
        15,
        25
    );


    pdf.setFontSize(
        14
    );


    pdf.text(
        "Relatório de Consultas",
        15,
        35
    );


    let y =
        48;


    /*************************************************
                    SEM RESULTADOS
    *************************************************/

    if (
        lista.length === 0
    ) {

        pdf.setFontSize(
            11
        );


        pdf.text(

            "Nenhuma consulta encontrada para os filtros selecionados.",

            15,

            y

        );

    }


    /*************************************************
                REGISTROS DO PDF
    *************************************************/

    lista.forEach(
        (c, indice) => {

            const linhas = [

                `Paciente: ${c.paciente || "-"}`,

                `Profissional: ${c.profissional || "-"}`,

                `Data: ${formatarData(c.data)}`,

                `Queixa: ${c.queixa || "-"}`,

                `Diagnóstico: ${c.diagnostico || "-"}`,

                `Prescrição: ${c.prescricao || "-"}`

            ];


            linhas.forEach(
                (texto) => {

                    const quebradas =
                        pdf.splitTextToSize(
                            texto,
                            180
                        );


                    /*********************************
                        NOVA PÁGINA
                    *********************************/

                    if (
                        y +
                        quebradas.length * 6
                        >
                        280
                    ) {

                        pdf.addPage();

                        y =
                            20;

                    }


                    pdf.text(
                        quebradas,
                        15,
                        y
                    );


                    y +=
                        quebradas.length * 6;

                }
            );


            y +=
                5;


            /*************************************
                    LINHA SEPARADORA
            *************************************/

            if (
                indice <
                lista.length - 1
            ) {

                pdf.line(
                    15,
                    y - 2,
                    195,
                    y - 2
                );


                y +=
                    4;

            }

        }
    );


    /*************************************************
                    SALVAR PDF
    *************************************************/

    pdf.save(
        "Relatorio_SIRMED.pdf"
    );

}


/*************************************************
                    GERAR WORD
*************************************************/

export function gerarWord() {

    const lista =
        consultasFiltradas();


    /*************************************************
                CONTEÚDO DOS REGISTROS
    *************************************************/

    const registros =
        lista.map(
            (c) => `

                <div class="registro">

                    <p>
                        <strong>Paciente:</strong>
                        ${escaparWord(
                            c.paciente || "-"
                        )}
                    </p>

                    <p>
                        <strong>Profissional:</strong>
                        ${escaparWord(
                            c.profissional || "-"
                        )}
                    </p>

                    <p>
                        <strong>Data:</strong>
                        ${escaparWord(
                            formatarData(
                                c.data
                            )
                        )}
                    </p>

                    <p>
                        <strong>Queixa:</strong>
                        ${escaparWord(
                            c.queixa || "-"
                        )}
                    </p>

                    <p>
                        <strong>Diagnóstico:</strong>
                        ${escaparWord(
                            c.diagnostico || "-"
                        )}
                    </p>

                    <p>
                        <strong>Prescrição:</strong>
                        ${escaparWord(
                            c.prescricao || "-"
                        )}
                    </p>

                </div>

            `
        )
        .join("");


    /*************************************************
                DOCUMENTO WORD
    *************************************************/

    const html = `

        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <style>

                body {

                    font-family:
                        Arial,
                        sans-serif;

                    color:
                        #222;

                }


                h1 {

                    color:
                        #1565C0;

                    margin-bottom:
                        0;

                }


                h2 {

                    margin-top:
                        4px;

                }


                .registro {

                    margin:
                        18px 0;

                    padding-bottom:
                        12px;

                    border-bottom:
                        1px solid #aaa;

                }


                p {

                    margin:
                        5px 0;

                }

            </style>

        </head>


        <body>

            <h1>
                SIRMED
            </h1>


            <h2>
                Relatório de Consultas
            </h2>


            ${
                registros
                ||
                `
                    <p>
                        Nenhuma consulta encontrada
                        para os filtros selecionados.
                    </p>
                `
            }

        </body>

        </html>

    `;


    /*************************************************
                    CRIAR ARQUIVO
    *************************************************/

    const blob =
        new Blob(

            [
                "\ufeff",
                html
            ],

            {
                type:
                    "application/msword;charset=utf-8"
            }

        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "Relatorio_SIRMED.doc";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/*************************************************
                ESCAPAR TEXTO WORD
*************************************************/

function escaparWord(
    valor
) {

    return String(
        valor ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        );

}


/*************************************************
                LOG DO SISTEMA
*************************************************/

console.log(
    "✅ relatorios.js carregado"
);
