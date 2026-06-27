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
