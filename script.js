alert("SCRIPT CARREGOU");

/*************************
 * SIRMED V2
 *************************/

let pacientes = [];
let profissionais = [];
let consultas = [];
let gastos = [];
let prontuarios = [];

/*************************
 * LOGIN
 *************************/

async function entrar() {

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    try {

        const usuario =
            await signInWithEmailAndPassword(
                auth,
                email,
                senha
            );

        document.getElementById("login")
            .style.display = "none";

        document.getElementById("sistema")
            .style.display = "block";

        document.getElementById("usuarioLogado")
            .innerHTML =
            "👤 " + usuario.user.email;

        await carregarTudo();

        renderizarTudo();

    }

    catch (erro) {

        console.error(erro);

        alert(
            "Usuário ou senha inválidos"
        );

    }

}

async function sair() {

    await signOut(auth);

    document.getElementById("login")
        .style.display = "block";

    document.getElementById("sistema")
        .style.display = "none";

}

/*************************
 * CARREGAMENTO GERAL
 *************************/

async function carregarTudo() {

    await Promise.all([
    carregarPacientes(),
    carregarProfissionais(),
    carregarConsultas(),
    carregarGastos(),
    carregarProntuarios()
]);

}

/*************************
 * PACIENTES
 *************************/

async function carregarPacientes() {

    pacientes = [];

    const snap =
        await getDocs(
            collection(
                db,
                "pacientes"
            )
        );

    snap.forEach(docSnap => {

        pacientes.push({
            id: docSnap.id,
            ...docSnap.data()
        });

    });

}

async function cadastrarPaciente() {

    const nome =
        document
        .getElementById(
            "pacienteNome"
        )
        .value
        .trim();

    const cpf =
        document
        .getElementById(
            "pacienteCpf"
        )
        .value
        .trim();

    const nascimento =
        document
        .getElementById(
            "pacienteNascimento"
        )
        .value;

    const telefone =
        document
        .getElementById(
            "pacienteTelefone"
        )
        .value
        .trim();

    const sexo =
        document
        .getElementById(
            "pacienteSexo"
        )
        .value;

    const cidade =
        document
        .getElementById(
            "pacienteCidade"
        )
        .value
        .trim();

    if (!nome) {

        alert(
            "Informe o nome"
        );

        return;

    }

  await addDoc(
    collection(db, "pacientes"),
    {
        nome,
        cpf,
        nascimento,
        telefone,
        sexo,
        cidade,
        criadoEm: serverTimestamp()
    }
);
      
// Limpar formulário
document.getElementById("pacienteNome").value = "";
document.getElementById("pacienteCpf").value = "";
document.getElementById("pacienteNascimento").value = "";
document.getElementById("pacienteTelefone").value = "";
document.getElementById("pacienteSexo").value = "";
document.getElementById("pacienteCidade").value = "";

    await carregarPacientes();

    renderPacientes();

    atualizarDashboard();

}

/*************************
 * PROFISSIONAIS
 *************************/

async function carregarProfissionais() {

    profissionais = [];

    const snap =
        await getDocs(
            collection(
                db,
                "profissionais"
            )
        );

    snap.forEach(docSnap => {

        profissionais.push({
            id: docSnap.id,
            ...docSnap.data()
        });

    });

}

async function cadastrarProfissional() {

    const nome =
        document.getElementById(
            "profissionalNome"
        ).value.trim();

    const funcao =
        document.getElementById(
            "profissionalFuncao"
        ).value;

    const registro =
        document.getElementById(
            "profissionalRegistro"
        ).value.trim();

    if (!nome || !funcao) {

        alert(
            "Preencha os campos obrigatórios"
        );

        return;

    }

    await addDoc(
        collection(
            db,
            "profissionais"
        ),
        {
            nome,
            funcao,
            registro,
            criadoEm:
                serverTimestamp()
        }
    );

    document.getElementById(
        "profissionalNome"
    ).value = "";

    document.getElementById(
        "profissionalFuncao"
    ).value = "";

    document.getElementById(
        "profissionalRegistro"
    ).value = "";

    await carregarProfissionais();

    renderProfissionais();

    preencherSelectsConsulta();

    atualizarDashboard();

}

/*************************
 * RENDER PACIENTES
 *************************/

function renderPacientes() {

    const el = document.getElementById("listaPacientes");

    if (!el) return;

    el.innerHTML = "";

    pacientes.forEach(p => {

        el.innerHTML += `
        <li>
            <b>👤 ${p.nome}</b><br>
            CPF: ${p.cpf || "-"}<br>
            Nascimento: ${p.nascimento || "-"}<br>
            Telefone: ${p.telefone || "-"}<br>
            Sexo: ${p.sexo || "-"}<br>
            Cidade: ${p.cidade || "-"}
        </li>
        `;

    });

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

    alert(
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
 * RENDER PROFISSIONAIS
 *************************/

function renderProfissionais() {

    const el =
        document.getElementById(
            "listaProfissionais"
        );

    if (!el) return;

    el.innerHTML = "";

    profissionais.forEach(p => {

        el.innerHTML += `

<li>

<b>👨‍⚕️ ${p.nome}</b><br>

Função: ${p.funcao}<br>

Registro: ${p.registro || "-"}

</li>

`;

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

/*************************
 * DASHBOARD
 *************************/

function atualizarDashboard() {

    const totalPacientes =
        document.getElementById(
            "totalPacientes"
        );

    const totalProfissionais =
        document.getElementById(
            "totalProfissionais"
        );

    const totalConsultas =
        document.getElementById(
            "totalConsultas"
        );

    const totalGastos =
        document.getElementById(
            "totalGastos"
        );

    if (totalPacientes)
        totalPacientes.innerText =
            pacientes.length;

    if (totalProfissionais)
        totalProfissionais.innerText =
            profissionais.length;

    if (totalConsultas)
        totalConsultas.innerText =
            consultas.length;

    let soma = 0;

    gastos.forEach(g => {

        soma +=
            Number(g.valor || 0);

    });

    if (totalGastos)
        totalGastos.innerText =
            "R$ " +
            soma.toFixed(2);

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

window.filtrarPacientes = filtrarPacientes;
/*************************
 * RENDER GERAL
 *************************/

function renderizarTudo(){

 renderPacientes();

 renderProfissionais();

 renderConsultas();

 renderGastos();

 renderProntuarios();

 preencherSelectsConsulta();

 atualizarDashboard();

}

/*************************
 * FILTRO PROFISSIONAIS
 *************************/

function filtrarProfissionais() {

    const filtro =
        document.getElementById(
            "pesquisaProfissional"
        )
        .value
        .toLowerCase();

    document
        .querySelectorAll(
            "#listaProfissionais li"
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

/*************************
 * EXPORTAÇÃO GLOBAL
 *************************/

window.cadastrarProfissional =
    cadastrarProfissional;

window.registrarConsulta =
    registrarConsulta;

window.filtrarProfissionais =
    filtrarProfissionais;
/*************************
 * INICIALIZAÇÃO
 *************************/

console.log(
    "🏥 SIRMED V2 carregado"
);
window.entrar = entrar;
window.sair = sair;
window.cadastrarPaciente = cadastrarPaciente;
window.cadastrarProfissional = cadastrarProfissional;
window.registrarConsulta = registrarConsulta;
window.filtrarProfissionais = filtrarProfissionais;
