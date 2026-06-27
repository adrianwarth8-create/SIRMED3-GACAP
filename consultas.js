/*************************************************
            CONSULTAS.JS - SIRMED V4
*************************************************/

let consultas = [];

/*************************************************
            CARREGAR CONSULTAS
*************************************************/

export async function carregarConsultas() {

    consultas = [];

    const snap = await getDocs(
        collection(db, "consultas")
    );

    snap.forEach(docSnap => {

        consultas.push({
            id: docSnap.id,
            ...docSnap.data()
        });

    });

}

/*************************************************
            REGISTRAR CONSULTA
*************************************************/

export async function registrarConsulta() {

    const paciente =
        document.getElementById("consultaPaciente").value;

    const profissional =
        document.getElementById("consultaProfissional").value;

    const queixa =
        document.getElementById("consultaQueixa").value.trim();

    const pa =
        document.getElementById("consultaPA").value.trim();

    const fc =
        document.getElementById("consultaFC").value.trim();

    const temperatura =
        document.getElementById("consultaTemperatura").value.trim();

    const diagnostico =
        document.getElementById("consultaDiagnostico").value.trim();

    const exameFisico =
        document.getElementById("consultaExameFisico").value.trim();

    const prescricao =
        document.getElementById("consultaPrescricao").value.trim();

    const observacoes =
        document.getElementById("consultaObservacoes").value.trim();

    const valor =
        Number(
            document.getElementById("consultaValor").value || 0
        );

    if (!paciente || !profissional) {

        mensagem("Selecione o paciente e o profissional.");

        return;

    }

    await addDoc(

        collection(db, "consultas"),

        {

            paciente,
            profissional,
            queixa,
            pa,
            fc,
            temperatura,
            diagnostico,
            exameFisico,
            prescricao,
            observacoes,
            valor,

            data: dataAtual(),

            criadoEm: serverTimestamp()

        }

    );

    await addDoc(

        collection(db, "gastos"),

        {

            tipo: "Consulta Médica",

            paciente,

            valor,

            data: dataAtual(),

            criadoEm: serverTimestamp()

        }

    );

    await addDoc(

        collection(db, "prontuarios"),

        {

            pacienteNome: paciente,

            profissional,

            data: dataAtual(),

            queixa,

            exameFisico,

            diagnostico,

            prescricao,

            observacoes,

            criadoEm: serverTimestamp()

        }

    );

    limparCampos([

        "consultaQueixa",

        "consultaPA",

        "consultaFC",

        "consultaTemperatura",

        "consultaDiagnostico",

        "consultaExameFisico",

        "consultaPrescricao",

        "consultaObservacoes",

        "consultaValor"

    ]);

    mensagem("Consulta registrada com sucesso.");

    await carregarConsultas();

    await carregarGastos();

    await carregarProntuarios();

    renderConsultas();

    renderGastos();

    renderProntuarios();

    atualizarDashboard();

}

/*************************************************
            RENDER CONSULTAS
*************************************************/

export function renderConsultas() {

    const lista =
        document.getElementById("listaConsultas");

    if (!lista) return;

    lista.innerHTML = "";

    consultas.forEach(c => {

        lista.innerHTML += `

<li>

<b>👤 ${c.paciente}</b><br>

👨‍⚕️ ${c.profissional}<br>

📅 ${c.data}<br>

🩺 ${c.queixa || "-"}<br>

📋 ${c.diagnostico || "-"}<br>

💊 ${c.prescricao || "-"}<br>

💰 ${formatarMoeda(c.valor)}

</li>

`;

    });

}

/*************************************************
            FILTRAR CONSULTAS
*************************************************/

export function filtrarConsultas() {

    const filtro =
        document.getElementById("pesquisaConsulta")
        .value
        .toLowerCase();

    document
        .querySelectorAll("#listaConsultas li")
        .forEach(li => {

            li.style.display =

                li.textContent
                .toLowerCase()
                .includes(filtro)

                ? ""

                : "none";

        });

}

/*************************************************
        PREENCHER SELECTS
*************************************************/

export function preencherSelectsConsulta() {

    const pacienteSelect =
        document.getElementById("consultaPaciente");

    const profissionalSelect =
        document.getElementById("consultaProfissional");

    if (pacienteSelect) {

        pacienteSelect.innerHTML =
            "<option value=''>Selecione o Paciente</option>";

        pacientes.forEach(p => {

            pacienteSelect.innerHTML +=
                `<option>${p.nome}</option>`;

        });

    }

    if (profissionalSelect) {

        profissionalSelect.innerHTML =
            "<option value=''>Selecione o Profissional</option>";

        profissionais.forEach(p => {

            profissionalSelect.innerHTML +=
                `<option>${p.nome}</option>`;

        });

    }

}

/*************************************************
                EXPORTAÇÃO
*************************************************/

window.carregarConsultas = carregarConsultas;
window.registrarConsulta = registrarConsulta;
window.renderConsultas = renderConsultas;
window.filtrarConsultas = filtrarConsultas;
window.preencherSelectsConsulta = preencherSelectsConsulta;

console.log("✅ consultas.js carregado");
