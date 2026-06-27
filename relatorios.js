/*************************************************
            RELATORIOS.JS - SIRMED V4
*************************************************/

/*************************************************
        PREENCHER PACIENTES
*************************************************/

export function preencherRelatorioPaciente() {

    const select =
        document.getElementById("relatorioPaciente");

    if (!select) return;

    select.innerHTML =
        "<option value=''>Todos os pacientes</option>";

    pacientes.forEach(p => {

        select.innerHTML +=
            `<option value="${p.nome}">${p.nome}</option>`;

    });

}

/*************************************************
        PREENCHER PROFISSIONAIS
*************************************************/

export function preencherRelatorioProfissional() {

    const select =
        document.getElementById("relatorioProfissional");

    if (!select) return;

    select.innerHTML =
        "<option value=''>Todos os profissionais</option>";

    profissionais.forEach(p => {

        select.innerHTML +=
            `<option value="${p.nome}">${p.nome}</option>`;

    });

}

/*************************************************
            FILTRAR CONSULTAS
*************************************************/

export function consultasFiltradas() {

    const paciente =
        document.getElementById("relatorioPaciente").value;

    const profissional =
        document.getElementById("relatorioProfissional").value;

    const dataInicial =
        document.getElementById("dataInicial").value;

    const dataFinal =
        document.getElementById("dataFinal").value;

    return consultas.filter(c => {

        const pacienteOK =
            !paciente || c.paciente === paciente;

        const profissionalOK =
            !profissional || c.profissional === profissional;

        let dataOK = true;

        if (dataInicial)
            dataOK = c.data >= dataInicial;

        if (dataFinal)
            dataOK = dataOK && c.data <= dataFinal;

        return pacienteOK && profissionalOK && dataOK;

    });

}

/*************************************************
                PDF
*************************************************/

export async function gerarPDF() {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    const lista = consultasFiltradas();

    pdf.setFontSize(18);

    pdf.text("SIRMED", 15, 20);

    pdf.setFontSize(12);

    pdf.text(
        "Relatório de Consultas",
        15,
        30
    );

    let y = 45;

    lista.forEach(c => {

        pdf.text(
            `Paciente: ${c.paciente}`,
            15,
            y
        );

        y += 7;

        pdf.text(
            `Profissional: ${c.profissional}`,
            15,
            y
        );

        y += 7;

        pdf.text(
            `Data: ${c.data}`,
            15,
            y
        );

        y += 7;

        pdf.text(
            `Diagnóstico: ${c.diagnostico || "-"}`,
            15,
            y
        );

        y += 10;

        if (y > 270) {

            pdf.addPage();

            y = 20;

        }

    });

    pdf.save("Relatorio_SIRMED.pdf");

}

/*************************************************
                WORD
*************************************************/

export function gerarWord() {

    const lista = consultasFiltradas();

    let texto = `
SIRMED

RELATÓRIO DE CONSULTAS

`;

    lista.forEach(c => {

        texto += `

Paciente: ${c.paciente}

Profissional: ${c.profissional}

Data: ${c.data}

Diagnóstico: ${c.diagnostico || "-"}

Prescrição: ${c.prescricao || "-"}

-----------------------------------

`;

    });

    const blob = new Blob(
        [texto],
        {
            type:
            "application/msword"
        }
    );

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "Relatorio_SIRMED.doc";

    link.click();

}

/*************************************************
            EXPORTAÇÃO
*************************************************/

window.preencherRelatorioPaciente =
preencherRelatorioPaciente;

window.preencherRelatorioProfissional =
preencherRelatorioProfissional;

window.gerarPDF =
gerarPDF;

window.gerarWord =
gerarWord;

console.log("✅ relatorios.js carregado");
