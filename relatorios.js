/*************************************************
        RELATORIOS.JS - SIRMED V4.7
*************************************************/


/*************************************************
                    PACIENTES
*************************************************/

import {
    obterPacientes
} from "./pacientes.js";


/*************************************************
                    CONSULTAS
*************************************************/

import {
    obterConsultas
} from "./consultas.js";


/*************************************************
                    FINANCEIRO
*************************************************/

import {
    obterGastos,
    totalFinanceiro
} from "./financeiro.js";


/*************************************************
                    UTILS
*************************************************/

import {
    formatarData,
    formatarMoeda,
    escaparHTML
} from "./utils.js";


/*************************************************
              VERIFICAR JSPDF
*************************************************/

function obterJsPDF() {

    if (
        !window.jspdf
        ||
        !window.jspdf.jsPDF
    ) {

        alert(
            "Biblioteca de PDF não carregada."
        );

        return null;

    }


    return window.jspdf.jsPDF;

}


/*************************************************
              CABEÇALHO DO PDF
*************************************************/

function criarCabecalho(
    pdf,
    titulo
) {

    /*************************************************
                    SIRMED
    *************************************************/

    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        19
    );


    pdf.setTextColor(
        45,
        65,
        30
    );


    pdf.text(
        "SIRMED",
        15,
        18
    );


    /*************************************************
                  SUBTÍTULO
    *************************************************/

    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.setFontSize(
        10
    );


    pdf.setTextColor(
        70,
        70,
        70
    );


    pdf.text(
        "Sistema Integrado de Registros Médicos",
        15,
        25
    );


    /*************************************************
                  TÍTULO RELATÓRIO
    *************************************************/

    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        14
    );


    pdf.setTextColor(
        25,
        25,
        25
    );


    pdf.text(
        titulo,
        15,
        36
    );


    /*************************************************
                    DATA EMISSÃO
    *************************************************/

    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.setFontSize(
        9
    );


    pdf.text(
        `Emitido em: ${new Date().toLocaleString("pt-BR")}`,
        15,
        43
    );


    /*************************************************
                    LINHA
    *************************************************/

    pdf.setDrawColor(
        120,
        120,
        120
    );


    pdf.line(
        15,
        47,
        195,
        47
    );


    return 56;

}


/*************************************************
                NOVA PÁGINA
*************************************************/

function verificarNovaPagina(
    pdf,
    y,
    alturaNecessaria = 12
) {

    if (
        y + alturaNecessaria >
        280
    ) {

        pdf.addPage();


        return 20;

    }


    return y;

}


/*************************************************
              ESCREVER CAMPO
*************************************************/

function escreverCampo(
    pdf,
    titulo,
    valor,
    y
) {

    y =
        verificarNovaPagina(
            pdf,
            y,
            12
        );


    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        10
    );


    pdf.setTextColor(
        30,
        30,
        30
    );


    pdf.text(
        `${titulo}:`,
        15,
        y
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    const texto =
        String(
            valor ?? "-"
        );


    const linhas =
        pdf.splitTextToSize(
            texto,
            135
        );


    pdf.text(
        linhas,
        55,
        y
    );


    y +=
        Math.max(
            6,
            linhas.length * 5
        );


    return y;

}


/*************************************************
              SEPARAR REGISTRO
*************************************************/

function separarRegistro(
    pdf,
    y
) {

    y =
        verificarNovaPagina(
            pdf,
            y,
            10
        );


    pdf.setDrawColor(
        190,
        190,
        190
    );


    pdf.line(
        15,
        y,
        195,
        y
    );


    return y + 7;

}


/*************************************************
            RELATÓRIO DE PACIENTES
*************************************************/

export function gerarRelatorioPacientes() {

    const jsPDF =
        obterJsPDF();


    if (!jsPDF) {

        return;

    }


    const pacientes =
        obterPacientes();


    const pdf =
        new jsPDF();


    let y =
        criarCabecalho(
            pdf,
            "Relatório de Pacientes"
        );


    /*************************************************
                    RESUMO
    *************************************************/

    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        11
    );


    pdf.text(
        `Total de pacientes: ${pacientes.length}`,
        15,
        y
    );


    y +=
        10;


    /*************************************************
                SEM PACIENTES
    *************************************************/

    if (
        pacientes.length === 0
    ) {

        pdf.setFont(
            "helvetica",
            "normal"
        );


        pdf.text(
            "Nenhum paciente cadastrado.",
            15,
            y
        );


        pdf.save(
            "Relatorio_Pacientes_SIRMED.pdf"
        );


        return;

    }


    /*************************************************
                    PACIENTES
    *************************************************/

    pacientes
        .slice()
        .sort(
            (a, b) =>

                String(
                    a.nome || ""
                )
                .localeCompare(
                    String(
                        b.nome || ""
                    ),
                    "pt-BR"
                )
        )
        .forEach(
            (paciente, indice) => {

                y =
                    verificarNovaPagina(
                        pdf,
                        y,
                        25
                    );


                pdf.setFont(
                    "helvetica",
                    "bold"
                );


                pdf.setFontSize(
                    11
                );


                pdf.text(
                    `${indice + 1}. ${paciente.nome || "Paciente"}`,
                    15,
                    y
                );


                y +=
                    8;


                y =
                    escreverCampo(
                        pdf,
                        "CPF",
                        paciente.cpf || "-",
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "Nascimento",
                        formatarData(
                            paciente.nascimento
                        ),
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "Sexo",
                        paciente.sexo || "-",
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "Telefone",
                        paciente.telefone || "-",
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "E-mail",
                        paciente.email || "-",
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "Cidade",
                        paciente.cidade || "-",
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "Convênio",
                        paciente.convenio || "-",
                        y
                    );


                y =
                    separarRegistro(
                        pdf,
                        y
                    );

            }
        );


    pdf.save(
        "Relatorio_Pacientes_SIRMED.pdf"
    );


    mostrarResultado(
        `Relatório de pacientes gerado com ${pacientes.length} registro(s).`
    );

}


/*************************************************
            RELATÓRIO DE CONSULTAS
*************************************************/

export function gerarRelatorioConsultas() {

    const jsPDF =
        obterJsPDF();


    if (!jsPDF) {

        return;

    }


    const consultas =
        obterConsultas();


    const pdf =
        new jsPDF();


    let y =
        criarCabecalho(
            pdf,
            "Relatório de Consultas"
        );


    /*************************************************
                    RESUMO
    *************************************************/

    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        11
    );


    pdf.text(
        `Total de consultas: ${consultas.length}`,
        15,
        y
    );


    y +=
        10;


    /*************************************************
                SEM CONSULTAS
    *************************************************/

    if (
        consultas.length === 0
    ) {

        pdf.setFont(
            "helvetica",
            "normal"
        );


        pdf.text(
            "Nenhuma consulta registrada.",
            15,
            y
        );


        pdf.save(
            "Relatorio_Consultas_SIRMED.pdf"
        );


        return;

    }


    /*************************************************
                    CONSULTAS
    *************************************************/

    consultas
        .slice()
        .sort(
            ordenarPorData
        )
        .forEach(
            (consulta, indice) => {

                y =
                    verificarNovaPagina(
                        pdf,
                        y,
                        30
                    );


                pdf.setFont(
                    "helvetica",
                    "bold"
                );


                pdf.setFontSize(
                    11
                );


                pdf.text(
                    `${indice + 1}. Consulta`,
                    15,
                    y
                );


                y +=
                    8;


                y =
                    escreverCampo(
                        pdf,
                        "Paciente",
                        consulta.paciente || "-",
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "Profissional",
                        consulta.profissional || "-",
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "Data",
                        formatarData(
                            consulta.data
                        ),
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "Queixa",
                        consulta.queixa || "-",
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "Pressão arterial",
                        consulta.pa || "-",
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "Frequência cardíaca",
                        consulta.fc
                            ? `${consulta.fc} bpm`
                            : "-",
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "Temperatura",
                        consulta.temperatura
                            ? `${consulta.temperatura} °C`
                            : "-",
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "Diagnóstico",
                        consulta.diagnostico || "-",
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "Prescrição",
                        consulta.prescricao || "-",
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "Valor",
                        formatarMoeda(
                            consulta.valor || 0
                        ),
                        y
                    );


                y =
                    separarRegistro(
                        pdf,
                        y
                    );

            }
        );


    pdf.save(
        "Relatorio_Consultas_SIRMED.pdf"
    );


    mostrarResultado(
        `Relatório de consultas gerado com ${consultas.length} registro(s).`
    );

}


/*************************************************
          RELATÓRIO FINANCEIRO
*************************************************/

export function gerarRelatorioFinanceiro() {

    const jsPDF =
        obterJsPDF();


    if (!jsPDF) {

        return;

    }


    const gastos =
        obterGastos();


    const pdf =
        new jsPDF();


    let y =
        criarCabecalho(
            pdf,
            "Relatório Financeiro"
        );


    /*************************************************
                    RESUMO
    *************************************************/

    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        12
    );


    pdf.text(
        `Total financeiro: ${formatarMoeda(totalFinanceiro())}`,
        15,
        y
    );


    y +=
        8;


    pdf.setFontSize(
        10
    );


    pdf.text(
        `Movimentações: ${gastos.length}`,
        15,
        y
    );


    y +=
        12;


    /*************************************************
                SEM MOVIMENTAÇÕES
    *************************************************/

    if (
        gastos.length === 0
    ) {

        pdf.setFont(
            "helvetica",
            "normal"
        );


        pdf.text(
            "Nenhuma movimentação financeira registrada.",
            15,
            y
        );


        pdf.save(
            "Relatorio_Financeiro_SIRMED.pdf"
        );


        return;

    }


    /*************************************************
                  MOVIMENTAÇÕES
    *************************************************/

    gastos
        .slice()
        .sort(
            ordenarPorData
        )
        .forEach(
            (gasto, indice) => {

                y =
                    verificarNovaPagina(
                        pdf,
                        y,
                        25
                    );


                pdf.setFont(
                    "helvetica",
                    "bold"
                );


                pdf.setFontSize(
                    11
                );


                pdf.text(
                    `${indice + 1}. ${gasto.tipo || "Movimentação"}`,
                    15,
                    y
                );


                y +=
                    8;


                y =
                    escreverCampo(
                        pdf,
                        "Paciente",
                        gasto.paciente || "-",
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "Data",
                        formatarData(
                            gasto.data
                        ),
                        y
                    );


                y =
                    escreverCampo(
                        pdf,
                        "Valor",
                        formatarMoeda(
                            gasto.valor || 0
                        ),
                        y
                    );


                y =
                    separarRegistro(
                        pdf,
                        y
                    );

            }
        );


    /*************************************************
                    TOTAL FINAL
    *************************************************/

    y =
        verificarNovaPagina(
            pdf,
            y,
            20
        );


    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        12
    );


    pdf.text(
        `TOTAL: ${formatarMoeda(totalFinanceiro())}`,
        15,
        y
    );


    pdf.save(
        "Relatorio_Financeiro_SIRMED.pdf"
    );


    mostrarResultado(
        `Relatório financeiro gerado com ${gastos.length} movimentação(ões).`
    );

}


/*************************************************
              ORDENAR POR DATA
*************************************************/

function ordenarPorData(
    a,
    b
) {

    const dataA =
        normalizarData(
            a
        );


    const dataB =
        normalizarData(
            b
        );


    return (
        dataB -
        dataA
    );

}


/*************************************************
              NORMALIZAR DATA
*************************************************/

function normalizarData(
    registro
) {

    /*************************************************
            TIMESTAMP DO FIREBASE
    *************************************************/

    if (
        registro?.criadoEm
        &&
        typeof registro.criadoEm.toDate
        ===
        "function"
    ) {

        return registro
            .criadoEm
            .toDate()
            .getTime();

    }


    const data =
        String(
            registro?.data || ""
        );


    /*************************************************
                    YYYY-MM-DD
    *************************************************/

    if (
        /^\d{4}-\d{2}-\d{2}$/
        .test(
            data
        )
    ) {

        return new Date(
            `${data}T00:00:00`
        )
        .getTime();

    }


    /*************************************************
                    DD/MM/YYYY
    *************************************************/

    const brasileiro =
        data.match(
            /^(\d{2})\/(\d{2})\/(\d{4})$/
        );


    if (
        brasileiro
    ) {

        return new Date(
            Number(
                brasileiro[3]
            ),
            Number(
                brasileiro[2]
            ) - 1,
            Number(
                brasileiro[1]
            )
        )
        .getTime();

    }


    return 0;

}


/*************************************************
          MOSTRAR RESULTADO NA TELA
*************************************************/

function mostrarResultado(
    texto
) {

    const area =
        document.getElementById(
            "areaRelatorio"
        );


    if (!area) {

        return;

    }


    area.innerHTML = `

        <div
            class="item-registro"
            style="
                margin-top:20px;
                border-left:4px solid #b8953d;
            "
        >

            <strong>
                ✅ Relatório gerado
            </strong>

            <br><br>

            ${escaparHTML(
                texto
            )}

        </div>

    `;

}


/*************************************************
        CONFIGURAR EVENTOS DOS RELATÓRIOS
*************************************************/

let eventosConfigurados =
    false;


export function configurarEventosRelatorios() {

    if (
        eventosConfigurados
    ) {

        return;

    }


    eventosConfigurados =
        true;


    /*************************************************
              RELATÓRIO PACIENTES
    *************************************************/

    document
        .getElementById(
            "btnRelatorioPacientes"
        )
        ?.addEventListener(

            "click",

            gerarRelatorioPacientes

        );


    /*************************************************
              RELATÓRIO CONSULTAS
    *************************************************/

    document
        .getElementById(
            "btnRelatorioConsultas"
        )
        ?.addEventListener(

            "click",

            gerarRelatorioConsultas

        );


    /*************************************************
              RELATÓRIO FINANCEIRO
    *************************************************/

    document
        .getElementById(
            "btnRelatorioFinanceiro"
        )
        ?.addEventListener(

            "click",

            gerarRelatorioFinanceiro

        );


    console.log(
        "📊 Eventos dos relatórios configurados."
    );

}


/*************************************************
            EXPORTAÇÕES GLOBAIS
*************************************************/

window.gerarRelatorioPacientes =
    gerarRelatorioPacientes;


window.gerarRelatorioConsultas =
    gerarRelatorioConsultas;


window.gerarRelatorioFinanceiro =
    gerarRelatorioFinanceiro;


/*************************************************
                    LOG
*************************************************/

console.log(
    "✅ relatorios.js V4.7 carregado"
);
