/*************************************************
            CONSULTAS.JS - SIRMED V4
*************************************************/

let consultas = [];

/*************************************************
        CARREGAR CONSULTAS
*************************************************/

async function carregarConsultas(){

    consultas = [];

    const snap = await getDocs(
        collection(db,"consultas")
    );

    snap.forEach(docSnap=>{

        consultas.push({

            id:docSnap.id,

            ...docSnap.data()

        });

    });

}

/*************************************************
        REGISTRAR CONSULTA
*************************************************/

async function registrarConsulta(){

    const paciente =
        document.getElementById("consultaPaciente").value;

    const profissional =
        document.getElementById("consultaProfissional").value;

    const queixa =
        document.getElementById("consultaQueixa").value;

    const pa =
        document.getElementById("consultaPA").value;

    const fc =
        document.getElementById("consultaFC").value;

    const temperatura =
        document.getElementById("consultaTemperatura").value;

    const diagnostico =
        document.getElementById("consultaDiagnostico").value;

    const exameFisico =
        document.getElementById("consultaExameFisico").value;

    const prescricao =
        document.getElementById("consultaPrescricao").value;

    const observacoes =
        document.getElementById("consultaObservacoes").value;

    const valor =
        Number(
            document.getElementById("consultaValor").value
        );

    if(!paciente || !profissional){

        alert("Selecione o paciente e o profissional.");

        return;

    }

    const consulta = {

        paciente,

        profissional,

        queixa,

        pa,

        fc,

        temperatura,

        exameFisico,

        diagnostico,

        prescricao,

        observacoes,

        valor,

        data:new Date().toLocaleDateString("pt-BR"),

        criadoEm:serverTimestamp()

    };

    await addDoc(

        collection(db,"consultas"),

        consulta

    );

    await registrarFinanceiro(consulta);

    await registrarProntuario(consulta);

    limparFormularioConsulta();

    await carregarConsultas();

    renderConsultas();

    atualizarDashboard();

    alert("Consulta registrada com sucesso.");

}
/*************************************************
        REGISTRAR FINANCEIRO
*************************************************/

async function registrarFinanceiro(consulta){

    await addDoc(

        collection(db,"gastos"),

        {

            tipo:"Consulta Médica",

            paciente:consulta.paciente,

            profissional:consulta.profissional,

            valor:consulta.valor,

            data:consulta.data,

            criadoEm:serverTimestamp()

        }

    );

}

/*************************************************
        REGISTRAR PRONTUÁRIO
*************************************************/

async function registrarProntuario(consulta){

    await addDoc(

        collection(db,"prontuarios"),

        {

            pacienteNome:consulta.paciente,

            profissional:consulta.profissional,

            data:consulta.data,

            queixa:consulta.queixa,

            pa:consulta.pa,

            fc:consulta.fc,

            temperatura:consulta.temperatura,

            exameFisico:consulta.exameFisico,

            diagnostico:consulta.diagnostico,

            prescricao:consulta.prescricao,

            observacoes:consulta.observacoes,

            criadoEm:serverTimestamp()

        }

    );

}

/*************************************************
        LIMPAR FORMULÁRIO
*************************************************/

function limparFormularioConsulta(){

    document.getElementById("consultaPaciente").value="";

    document.getElementById("consultaProfissional").value="";

    document.getElementById("consultaQueixa").value="";

    document.getElementById("consultaPA").value="";

    document.getElementById("consultaFC").value="";

    document.getElementById("consultaTemperatura").value="";

    document.getElementById("consultaDiagnostico").value="";

    document.getElementById("consultaExameFisico").value="";

    document.getElementById("consultaPrescricao").value="";

    document.getElementById("consultaObservacoes").value="";

    document.getElementById("consultaValor").value="";

}
/*************************
 * SIRMED V4 - CONSULTAS JS
 * PARTE 3
 *************************/

/* =========================
   ATUALIZAR CONSULTA
========================= */

function atualizarConsulta(id, novosDados) {
    const index = consultas.findIndex(c => c.id === id);

    if (index !== -1) {
        consultas[index] = {
            ...consultas[index],
            ...novosDados
        };

        salvarLocal();
        return consultas[index];
    }

    return null;
}

/* =========================
   REAGENDAR CONSULTA
========================= */

function reagendarConsulta(id, novaData, novaHora) {
    const index = consultas.findIndex(c => c.id === id);

    if (index !== -1) {
        consultas[index].data = novaData;
        consultas[index].hora = novaHora;
        consultas[index].status = "reagendada";

        salvarLocal();
        return consultas[index];
    }

    return null;
}

/* =========================
   FILTRAR CONSULTAS
========================= */

function filtrarConsultasPorStatus(status) {
    return consultas.filter(c => c.status === status);
}

function filtrarConsultasPorPaciente(pacienteId) {
    return consultas.filter(c => c.pacienteId === pacienteId);
}

function filtrarConsultasPorProfissional(profissionalId) {
    return consultas.filter(c => c.profissionalId === profissionalId);
}

/* =========================
   CONSULTAS DO DIA
========================= */

function consultasDoDia(data) {
    return consultas.filter(c => c.data === data);
}

/* =========================
   BUSCA AVANÇADA
========================= */

function buscarConsultas(termo) {
    const termoLower = termo.toLowerCase();

    return consultas.filter(c => {
        const paciente = pacientes.find(p => p.id === c.pacienteId);
        const profissional = profissionais.find(p => p.id === c.profissionalId);

        return (
            c.data.includes(termoLower) ||
            c.hora.includes(termoLower) ||
            (paciente?.nome.toLowerCase().includes(termoLower)) ||
            (profissional?.nome.toLowerCase().includes(termoLower)) ||
            c.status.toLowerCase().includes(termoLower)
        );
    });
}

/* =========================
   STATUS INTELIGENTE
========================= */

function atualizarStatusAutomatico() {
    const hoje = new Date().toISOString().split("T")[0];

    consultas.forEach(c => {
        if (c.status === "agendada" && c.data < hoje) {
            c.status = "atrasada";
        }
    });

    salvarLocal();
}

/* =========================
   ESTATÍSTICAS DE CONSULTAS
========================= */

function estatisticasConsultas() {
    return {
        total: consultas.length,
        agendadas: consultas.filter(c => c.status === "agendada").length,
        concluidas: consultas.filter(c => c.status === "concluída").length,
        canceladas: consultas.filter(c => c.status === "cancelada").length,
        atrasadas: consultas.filter(c => c.status === "atrasada").length
    };
}
/*************************
 * SIRMED V4 - CONSULTAS JS
 * PARTE 4
 * Calendário + Alertas + Firebase Ready
 *************************/

/* =========================
   OBTER SEMANA DE CONSULTAS
========================= */

function obterSemana(dataBase) {
    const base = new Date(dataBase);
    const semana = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);

        semana.push(d.toISOString().split("T")[0]);
    }

    return semana;
}

/* =========================
   CONSULTAS DA SEMANA
========================= */

function consultasDaSemana(dataBase) {
    const semana = obterSemana(dataBase);

    return consultas.filter(c => semana.includes(c.data));
}

/* =========================
   AGRUPAR POR DIA (CALENDÁRIO SIMPLES)
========================= */

function calendarioSemanal(dataBase) {
    const semana = obterSemana(dataBase);

    const calendario = {};

    semana.forEach(dia => {
        calendario[dia] = consultas.filter(c => c.data === dia);
    });

    return calendario;
}

/* =========================
   ALERTA DE CONSULTAS PRÓXIMAS
========================= */

function consultasProximas(minutos = 60) {
    const agora = new Date();

    return consultas.filter(c => {
        if (!c.data || !c.hora) return false;

        const dataHoraConsulta = new Date(`${c.data}T${c.hora}:00`);
        const diferencaMin = (dataHoraConsulta - agora) / (1000 * 60);

        return diferencaMin >= 0 && diferencaMin <= minutos;
    });
}

/* =========================
   NOTIFICAÇÃO (BASE PARA UI)
========================= */

function gerarNotificacoesConsultas() {
    const proximas = consultasProximas(60);

    return proximas.map(c => {
        const paciente = pacientes.find(p => p.id === c.pacienteId);
        const profissional = profissionais.find(p => p.id === c.profissionalId);

        return {
            titulo: "Consulta próxima",
            mensagem: `${paciente?.nome || "Paciente"} com ${profissional?.nome || "Profissional"} às ${c.hora}`,
            data: c.data,
            hora: c.hora,
            idConsulta: c.id
        };
    });
}

/* =========================
   RESUMO DIÁRIO
========================= */

function resumoDoDia(data) {
    const doDia = consultas.filter(c => c.data === data);

    return {
        data,
        total: doDia.length,
        agendadas: doDia.filter(c => c.status === "agendada").length,
        concluidas: doDia.filter(c => c.status === "concluída").length,
        canceladas: doDia.filter(c => c.status === "cancelada").length
    };
}

/* =========================
   PREPARAÇÃO FIREBASE (ESTRUTURA)
   (caso você migre do localStorage)
========================= */

function mapearConsultaFirebase(consulta) {
    return {
        pacienteId: consulta.pacienteId,
        profissionalId: consulta.profissionalId,
        data: consulta.data,
        hora: consulta.hora,
        status: consulta.status,
        createdAt: consulta.createdAt || new Date().toISOString()
    };
}

function desmapearConsultaFirebase(doc) {
    return {
        id: doc.id,
        ...doc.data()
    };
}

/* =========================
   FILTRO INTELIGENTE AVANÇADO
========================= */

function filtrarConsultasAvancado({ data, status, profissionalId, pacienteId }) {
    return consultas.filter(c => {
        return (
            (!data || c.data === data) &&
            (!status || c.status === status) &&
            (!profissionalId || c.profissionalId === profissionalId) &&
            (!pacienteId || c.pacienteId === pacienteId)
        );
    });
}

/* =========================
   VERIFICAR CONFLITO DE HORÁRIO
========================= */

function verificarConflito(profissionalId, data, hora) {
    return consultas.some(c =>
        c.profissionalId === profissionalId &&
        c.data === data &&
        c.hora === hora &&
        c.status !== "cancelada"
    );
}

/* =========================
   AGENDAR COM VALIDAÇÃO
========================= */

function agendarConsultaSegura(pacienteId, profissionalId, data, hora) {
    if (verificarConflito(profissionalId, data, hora)) {
        return {
            erro: true,
            mensagem: "Conflito de horário para este profissional"
        };
    }

    const consulta = {
        id: Date.now(),
        pacienteId,
        profissionalId,
        data,
        hora,
        status: "agendada",
        createdAt: new Date().toISOString()
    };

    consultas.push(consulta);
    salvarLocal();

    return consulta;
}
/*************************
 * SIRMED V4 - CONSULTAS JS
 * PARTE 5
 * Tempo real + Sync + Finalização do módulo
 *************************/

/* =========================
   SINCRONIZAÇÃO (BASE FIRESTORE)
========================= */

async function sincronizarConsultasFirebase(db) {
    try {
        const snapshot = await db.collection("consultas").get();

        consultas = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        salvarLocal();
        return consultas;

    } catch (error) {
        console.error("Erro ao sincronizar consultas:", error);
        return [];
    }
}

/* =========================
   LISTENER TEMPO REAL (FIREBASE)
========================= */

function listenerConsultasTempoReal(db, callback) {
    return db.collection("consultas")
        .onSnapshot(snapshot => {
            consultas = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            salvarLocal();

            if (callback) callback(consultas);
        });
}

/* =========================
   ATUALIZAÇÃO AUTOMÁTICA DE STATUS (INTERVALO)
========================= */

function iniciarAtualizacaoAutomaticaStatus(intervaloMs = 60000) {
    setInterval(() => {
        const agora = new Date();

        consultas.forEach(c => {
            if (c.status === "agendada") {
                const dataHora = new Date(`${c.data}T${c.hora}:00`);

                if (dataHora < agora) {
                    c.status = "atrasada";
                }
            }
        });

        salvarLocal();

    }, intervaloMs);
}

/* =========================
   LIMPEZA DE CONSULTAS ANTIGAS (OPCIONAL)
========================= */

function limparConsultasAntigas(dias = 365) {
    const limite = new Date();
    limite.setDate(limite.getDate() - dias);

    consultas = consultas.filter(c => {
        const dataConsulta = new Date(c.data);
        return dataConsulta >= limite;
    });

    salvarLocal();
}

/* =========================
   EXPORTAR CONSULTAS (RELATÓRIO JSON)
========================= */

function exportarConsultas() {
    const exportacao = {
        total: consultas.length,
        geradoEm: new Date().toISOString(),
        dados: consultas
    };

    const blob = new Blob(
        [JSON.stringify(exportacao, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "consultas_sirmed_v4.json";
    a.click();

    URL.revokeObjectURL(url);
}

/* =========================
   EXPORTAR RESUMO CSV
========================= */

function exportarConsultasCSV() {
    const header = "id,pacienteId,profissionalId,data,hora,status\n";

    const rows = consultas.map(c =>
        `${c.id},${c.pacienteId},${c.profissionalId},${c.data},${c.hora},${c.status}`
    ).join("\n");

    const csv = header + rows;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "consultas_sirmed_v4.csv";
    a.click();

    URL.revokeObjectURL(url);
}

/* =========================
   RESET DO MÓDULO (DEBUG / ADMIN)
========================= */

function resetarConsultas() {
    consultas = [];
    salvarLocal();
}

/* =========================
   ESTADO COMPLETO DO MÓDULO
========================= */

function estadoConsultas() {
    return {
        total: consultas.length,
        status: {
            agendadas: consultas.filter(c => c.status === "agendada").length,
            concluidas: consultas.filter(c => c.status === "concluída").length,
            canceladas: consultas.filter(c => c.status === "cancelada").length,
            atrasadas: consultas.filter(c => c.status === "atrasada").length,
            reagendadas: consultas.filter(c => c.status === "reagendada").length
        },
        ultimaAtualizacao: new Date().toISOString()
    };
}

/* =========================
   INICIALIZAÇÃO DO MÓDULO
========================= */

function iniciarModuloConsultas(db = null) {
    carregarLocal();

    iniciarAtualizacaoAutomaticaStatus(60000);

    if (db) {
        listenerConsultasTempoReal(db, (dados) => {
            console.log("Consultas atualizadas em tempo real:", dados.length);
        });
    }

    console.log("Módulo de consultas iniciado com sucesso");
}
