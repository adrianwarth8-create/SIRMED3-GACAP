/*************************************************
            PACIENTES.JS - SIRMED V4
*************************************************/

let pacientes = [];

/*************************************************
        CARREGAR PACIENTES
*************************************************/

export async function carregarPacientes(){

    pacientes = [];

    const snap = await getDocs(
        collection(db, "pacientes")
    );

    snap.forEach(docSnap=>{

        pacientes.push({
            id: docSnap.id,
            ...docSnap.data()
        });

    });

}

/*************************************************
        CADASTRAR PACIENTE
*************************************************/

export async function cadastrarPaciente(){

    const nome =
        document.getElementById("pacienteNome").value.trim();

    const cpf =
        document.getElementById("pacienteCpf").value.trim();

    const nascimento =
        document.getElementById("pacienteNascimento").value;

    const telefone =
        document.getElementById("pacienteTelefone").value.trim();

    const sexo =
        document.getElementById("pacienteSexo").value;

    const cidade =
        document.getElementById("pacienteCidade").value.trim();

    if(nome==""){

        alert("Informe o nome do paciente.");

        return;

    }

    await addDoc(

        collection(db,"pacientes"),

        {

            nome,
            cpf,
            nascimento,
            telefone,
            sexo,
            cidade,

            criadoEm:serverTimestamp()

        }

    );

    limparFormularioPaciente();

    await carregarPacientes();

    renderPacientes();

    preencherSelectsConsulta();

    preencherRelatorioPaciente();

    atualizarDashboard();

}

/*************************************************
        RENDER
*************************************************/

export function renderPacientes(){

    const lista =
        document.getElementById("listaPacientes");

    if(!lista) return;

    lista.innerHTML = "";

    pacientes.forEach(p=>{

        lista.innerHTML += `

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

/*************************************************
        PESQUISA
*************************************************/

export function filtrarPacientes(){

    const filtro =
        document
        .getElementById("pesquisaPaciente")
        .value
        .toLowerCase();

    document
        .querySelectorAll("#listaPacientes li")
        .forEach(li=>{

            li.style.display =

            li.textContent
            .toLowerCase()
            .includes(filtro)

            ? ""

            : "none";

        });

}

/*************************************************
        LIMPAR FORMULÁRIO
*************************************************/

export function limparFormularioPaciente(){

    document.getElementById("pacienteNome").value="";

    document.getElementById("pacienteCpf").value="";

    document.getElementById("pacienteNascimento").value="";

    document.getElementById("pacienteTelefone").value="";

    document.getElementById("pacienteSexo").value="";

    document.getElementById("pacienteCidade").value="";

}

/*************************************************
        EXPORTAÇÃO
*************************************************/

window.carregarPacientes = carregarPacientes;

window.cadastrarPaciente = cadastrarPaciente;

window.renderPacientes = renderPacientes;

window.filtrarPacientes = filtrarPacientes;

window.pacientes = pacientes;

console.log("✅ pacientes.js carregado");
