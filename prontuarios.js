/*************************************************
            PRONTUARIOS.JS - SIRMED V4
*************************************************/

let prontuarios = [];

/*************************************************
            CARREGAR PRONTUÁRIOS
*************************************************/

export async function carregarProntuarios() {

    prontuarios = [];

    const snap = await getDocs(
        collection(db, "prontuarios")
    );

    snap.forEach(docSnap => {

        prontuarios.push({
            id: docSnap.id,
            ...docSnap.data()
        });

    });

}

/*************************************************
            RENDER PRONTUÁRIOS
*************************************************/

export function renderProntuarios() {

    const lista =
        document.getElementById("listaProntuarios");

    if (!lista) return;

    lista.innerHTML = "";

    if (prontuarios.length === 0) {

        lista.innerHTML =
            "<li>Nenhum prontuário encontrado.</li>";

        return;

    }

    prontuarios.forEach(p => {

        lista.innerHTML += `

<li>

<b>👤 ${p.pacienteNome}</b><br>

👨‍⚕️ ${p.profissional}<br>

📅 ${p.data}<br><br>

<b>🩺 Queixa:</b><br>
${p.queixa || "-"}<br><br>

<b>🔎 Exame Físico:</b><br>
${p.exameFisico || "-"}<br><br>

<b>📋 Diagnóstico:</b><br>
${p.diagnostico || "-"}<br><br>

<b>💊 Prescrição:</b><br>
${p.prescricao || "-"}<br><br>

<b>📝 Observações:</b><br>
${p.observacoes || "-"}

</li>

`;

    });

}

/*************************************************
        PRONTUÁRIO POR PACIENTE
*************************************************/

export function buscarProntuariosPaciente(nomePaciente) {

    return prontuarios.filter(prontuario =>

        prontuario.pacienteNome === nomePaciente

    );

}

/*************************************************
        QUANTIDADE DE PRONTUÁRIOS
*************************************************/

export function totalProntuarios() {

    return prontuarios.length;

}

/*************************************************
            EXPORTAÇÃO
*************************************************/

window.carregarProntuarios =
carregarProntuarios;

window.renderProntuarios =
renderProntuarios;

window.buscarProntuariosPaciente =
buscarProntuariosPaciente;

window.totalProntuarios =
totalProntuarios;

console.log("✅ prontuarios.js carregado");
