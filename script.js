alert("Bem-Vindo ao SIRMED - BY CB WARTH");

/*************************
 * SIRMED V2
 *************************/

let consultas = [];
let gastos = [];
let prontuarios = [];

let perfilUsuario = "";

/*************************
 * CARREGAMENTO GERAL
 *************************/

async function carregarTudo() {

    await Promise.all([
    carregarConsultas(),
    carregarGastos(),
    carregarProntuarios()
]);

}

/*************************
 * CONSULTAS
 *************************/

async function carregarConsultas() {

    consultas = [];

    const snap =
        await getDocs(
            collection(
                db,
                "consultas"
            )
        );
    
    snap.forEach(docSnap => {

        consultas.push({
            id: docSnap.id,
            ...docSnap.data()
        });

    });

}

async function registrarConsulta() {

    const paciente =
        document.getElementById(
            "consultaPaciente"
        ).value;

    const profissional =
        document.getElementById(
            "consultaProfissional"
        ).value;

    const queixa =
        document.getElementById(
            "consultaQueixa"
        ).value;

    const pa =
        document.getElementById(
            "consultaPA"
        ).value;

    const fc =
        document.getElementById(
            "consultaFC"
        ).value;

    const temperatura =
        document.getElementById(
            "consultaTemperatura"
        ).value;

    const diagnostico =
        document.getElementById(
            "consultaDiagnostico"
        ).value;

    const exameFisico =
document.getElementById(
"consultaExameFisico"
).value;

    const prescricao =
        document.getElementById(
            "consultaPrescricao"
        ).value;

    const observacoes =
        document.getElementById(
            "consultaObservacoes"
        ).value;

    const valor =
    Number(
        document.getElementById(
            "consultaValor"
        ).value
    );
    
    if (
        !paciente ||
        !profissional
    ) {

        alert(
            "Selecione paciente e profissional"
        );

        return;

    }

    await addDoc(
        collection(
            db,
            "consultas"
        ),
        {
            paciente,
            profissional,
            queixa,
            pa,
            fc,
            exameFisico,
            temperatura,
            diagnostico,
            prescricao,
            observacoes,
            valor,
            data:
                new Date()
                .toLocaleDateString(
                    "pt-BR"
                ),
            criadoEm:
                serverTimestamp()
        }
    );

    await addDoc(
        collection(
            db,
            "gastos"
        ),
        {
            tipo:
                "Consulta Médica",
            paciente,
            valor,
            data:
                new Date()
                .toLocaleDateString(
                    "pt-BR"
                ),
            criadoEm:
                serverTimestamp()
        }
    );

    mensagem(
        "Consulta registrada com sucesso"
    );

    await addDoc(
    collection(db, "prontuarios"),
    {
        pacienteNome: paciente,
        profissional,
        data: new Date().toLocaleDateString("pt-BR"),
        queixa,
        exameFisico,
        diagnostico,
        prescricao,
        observacoes,
        criadoEm: serverTimestamp()
    }
);
    
    await carregarConsultas();
    await carregarGastos();
    await carregarProntuarios();

    renderConsultas();
    renderGastos();
    renderProntuarios();

    atualizarDashboard();

}

/*************************
 * GASTOS
 *************************/

async function carregarGastos() {

    gastos = [];

    const snap =
        await getDocs(
            collection(
                db,
                "gastos"
            )
        );

    snap.forEach(docSnap => {

        gastos.push({
            id: docSnap.id,
            ...docSnap.data()
        });

    });

}

/*************************
 * RENDER CONSULTAS
 *************************/

function renderConsultas() {

    const el =
        document.getElementById(
            "listaConsultas"
        );

    if (!el) return;

    el.innerHTML = "";

    consultas.forEach(c => {

        el.innerHTML += `

<li>

<b>👤 ${c.paciente}</b><br>

👨‍⚕️ ${c.profissional}<br>

📅 ${c.data}<br>

🩺 ${c.queixa}<br>

📋 ${c.diagnostico}<br>

💊 ${c.prescricao}<br>

💰 R$ ${Number(c.valor || 0).toFixed(2)}

</li>

`;

    });

}

/*************************
 * RENDER GASTOS
 *************************/

function renderGastos() {

    const el =
        document.getElementById(
            "listaGastos"
        );

    if (!el) return;

    el.innerHTML = "";

    gastos.forEach(g => {

        el.innerHTML += `

<li>

<b>${g.tipo}</b><br>

👤 ${g.paciente}<br>

📅 ${g.data}<br>

<span class="valor-financeiro">

R$ ${Number(g.valor || 0).toFixed(2)}

</span>

</li>

`;

    });

}

/*************************
 * SELECTS CONSULTA
 *************************/

function preencherSelectsConsulta() {

    const pacientesSelect =
        document.getElementById(
            "consultaPaciente"
        );

    const profissionaisSelect =
        document.getElementById(
            "consultaProfissional"
        );

    if (pacientesSelect) {

        pacientesSelect.innerHTML =
            "<option value=''>Selecione o Paciente</option>";

        pacientes.forEach(p => {

            pacientesSelect.innerHTML +=
                `<option>${p.nome}</option>`;

        });

    }

    if (profissionaisSelect) {

        profissionaisSelect.innerHTML =
            "<option value=''>Selecione o Profissional</option>";

        profissionais.forEach(p => {

            profissionaisSelect.innerHTML +=
                `<option>${p.nome}</option>`;

        });

    }

}

function preencherRelatorioPaciente(){

    const select =
    document.getElementById("relatorioPaciente");

    if(!select) return;

    select.innerHTML =
    "<option value=''>Todos os pacientes</option>";

    pacientes.forEach(p=>{

        select.innerHTML +=
        `<option value="${p.nome}">
            ${p.nome}
        </option>`;

    });

}

function filtrarPacientes() {

    const filtro =
        document.getElementById("pesquisaPaciente")
        .value
        .toLowerCase();

    document
        .querySelectorAll("#listaPacientes li")
        .forEach(li => {

            li.style.display =
                li.textContent
                .toLowerCase()
                .includes(filtro)
                ? ""
                : "none";

        });

}

function filtrarConsultas(){

    const filtro =
        document.getElementById(
            "pesquisaConsulta"
        ).value.toLowerCase();

    document
        .querySelectorAll(
            "#listaConsultas li"
        )
        .forEach(li => {

            li.style.display =
                li.textContent
                .toLowerCase()
                .includes(filtro)
                ? ""
                : "none";

        });

}

async function carregarProntuarios(){

 prontuarios = [];

 const snap =
 await getDocs(
 collection(
 db,
 "prontuarios"
 )
 );

 snap.forEach(docSnap=>{

 prontuarios.push({
 id: docSnap.id,
 ...docSnap.data()
 });

 });

}

async function gerarPDF(){

    const paciente =
        document.getElementById("relatorioPaciente").value;

    alert("Paciente escolhido: " + paciente);

}

function renderProntuarios(){

 const el =
 document.getElementById(
 "listaProntuarios"
 );

 if(!el) return;

 el.innerHTML = "";

 prontuarios.forEach(p=>{

 el.innerHTML += `

<li>

<b>👤 ${p.pacienteNome}</b><br>

👨‍⚕️ ${p.profissional}<br>

📅 ${p.data}<br>

🩺 ${p.queixa}<br>

📋 ${p.diagnostico}<br>

💊 ${p.prescricao}

</li>

`;

 });

}

/*************************
 * RENDER GERAL
 *************************/

function renderizarTudo(){


 renderConsultas();

 renderGastos();

 renderProntuarios();

 preencherSelectsConsulta();

    preencherRelatorioPaciente();

 atualizarDashboard();

}

/*************************
 * EXPORTAÇÃO GLOBAL
 *************************/

window.cadastrarProfissional =
    cadastrarProfissional;

window.registrarConsulta =
    registrarConsulta;

window.filtrarProfissionais =
    filtrarProfissionais;

window.filtrarConsultas =
    filtrarConsultas;

    if (user) {

        document.getElementById("login").style.display = "none";
        document.getElementById("sistema").style.display = "block";

        document.getElementById("usuarioLogado").innerHTML =
            "👤 " + user.email;

        await carregarTudo();

        renderizarTudo();

    } else {

        document.getElementById("login").style.display = "block";
        document.getElementById("sistema").style.display = "none";

    }

});

/*************************
 * INICIALIZAÇÃO
 *************************/

console.log(
    "🏥 SIRMED V2 carregado"
);
window.entrar = entrar;
window.sair = sair;
window.registrarConsulta = registrarConsulta;
onAuthStateChanged(auth, async (user) => {

    if(user){

        document.getElementById("login")
            .style.display = "none";

        document.getElementById("sistema")
            .style.display = "block";

        document.getElementById("usuarioLogado")
            .innerHTML =
            "👤 " + user.email;

        await carregarTudo();

        renderizarTudo();
    }

});
window.onAuthStateChanged(window.auth, (user) => {

    if(user){
        entrarAutomatico(user);
    }

});
    if (usuario) {

        document.getElementById("login").style.display = "none";
        document.getElementById("sistema").style.display = "block";

        document.getElementById("usuarioLogado").innerHTML =
            "👤 " + usuario.email;

        await carregarTudo();
        renderizarTudo();

    } else {

        document.getElementById("login").style.display = "block";
        document.getElementById("sistema").style.display = "none";

    }

});
