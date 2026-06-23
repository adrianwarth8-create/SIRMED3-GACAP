/*************************
 * SIRMED V1
 *************************/

let pacientes = [];

/*************************
 * LOGIN
 *************************/

async function entrar() {

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    if (!email || !senha) {

        alert("Preencha e-mail e senha");

        return;
    }

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

        await carregarPacientes();

        renderPacientes();

        atualizarDashboard();

    }

    catch (erro) {

        console.error(erro);

        alert(
            "Usuário ou senha inválidos"
        );

    }

}

/*************************
 * SAIR
 *************************/

async function sair() {

    try {

        await signOut(auth);

        document.getElementById("login")
            .style.display = "block";

        document.getElementById("sistema")
            .style.display = "none";

        document.getElementById("email")
            .value = "";

        document.getElementById("senha")
            .value = "";

    }

    catch (erro) {

        console.error(erro);

    }

}

/*************************
 * PACIENTES
 *************************/

async function cadastrarPaciente() {

    const nome =
        document.getElementById(
            "pacienteNome"
        ).value.trim();

    const cpf =
        document.getElementById(
            "pacienteCpf"
        ).value.trim();

    const nascimento =
        document.getElementById(
            "pacienteNascimento"
        ).value;

    const telefone =
        document.getElementById(
            "pacienteTelefone"
        ).value.trim();

    const sexo =
        document.getElementById(
            "pacienteSexo"
        ).value;

    const cidade =
        document.getElementById(
            "pacienteCidade"
        ).value.trim();

    if (!nome) {

        alert(
            "Informe o nome do paciente"
        );

        return;
    }

    try {

        await addDoc(
            collection(db, "pacientes"),
            {
                nome,
                cpf,
                nascimento,
                telefone,
                sexo,
                cidade,
                criadoEm:
                    serverTimestamp()
            }
        );

        limparFormularioPaciente();

        await carregarPacientes();

        renderPacientes();

        atualizarDashboard();

        alert(
            "Paciente cadastrado com sucesso"
        );

    }

    catch (erro) {

        console.error(erro);

        alert(
            "Erro ao cadastrar paciente"
        );

    }

}

/*************************
 * LIMPAR FORMULÁRIO
 *************************/

function limparFormularioPaciente() {

    document.getElementById(
        "pacienteNome"
    ).value = "";

    document.getElementById(
        "pacienteCpf"
    ).value = "";

    document.getElementById(
        "pacienteNascimento"
    ).value = "";

    document.getElementById(
        "pacienteTelefone"
    ).value = "";

    document.getElementById(
        "pacienteSexo"
    ).value = "";

    document.getElementById(
        "pacienteCidade"
    ).value = "";

}

/*************************
 * CARREGAR PACIENTES
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

/*************************
 * RENDER PACIENTES
 *************************/

function renderPacientes() {

    const lista =
        document.getElementById(
            "listaPacientes"
        );

    if (!lista) return;

    lista.innerHTML = "";

    pacientes.forEach(paciente => {

        lista.innerHTML += `

<li>

<b>👤 ${paciente.nome}</b><br>

CPF: ${paciente.cpf || "-"}<br>

📞 ${paciente.telefone || "-"}<br>

⚧️ ${paciente.sexo || "-"}<br>

🏙️ ${paciente.cidade || "-"}<br>

<button
onclick="excluirPaciente('${paciente.id}')">

🗑️ Excluir

</button>

</li>

`;

    });

}

/*************************
 * EXCLUIR PACIENTE
 *************************/

async function excluirPaciente(id) {

    const confirmar =
        confirm(
            "Deseja excluir este paciente?"
        );

    if (!confirmar) {

        return;
    }

    try {

        await deleteDoc(
            doc(
                db,
                "pacientes",
                id
            )
        );

        await carregarPacientes();

        renderPacientes();

        atualizarDashboard();

    }

    catch (erro) {

        console.error(erro);

        alert(
            "Erro ao excluir paciente"
        );

    }

}

/*************************
 * FILTRO
 *************************/

function filtrarPacientes() {

    const filtro =
        document.getElementById(
            "pesquisaPaciente"
        )
        .value
        .toLowerCase();

    document
        .querySelectorAll(
            "#listaPacientes li"
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
 * DASHBOARD
 *************************/

function atualizarDashboard() {

    const totalPacientes =
        document.getElementById(
            "totalPacientes"
        );

    if (totalPacientes) {

        totalPacientes.innerText =
            pacientes.length;

    }

    const mesAtual =
        document.getElementById(
            "mesAtual"
        );

    if (mesAtual) {

        mesAtual.innerText =
            new Date()
                .toLocaleDateString(
                    "pt-BR",
                    {
                        month: "short",
                        year: "numeric"
                    }
                );

    }

}

/*************************
 * AUTO LOGIN
 *************************/

onAuthStateChanged(
    auth,
    async (user) => {

        if (user) {

            document
                .getElementById("login")
                .style.display = "none";

            document
                .getElementById("sistema")
                .style.display = "block";

            document
                .getElementById("usuarioLogado")
                .innerHTML =
                "👤 " + user.email;

            await carregarPacientes();

            renderPacientes();

            atualizarDashboard();

        }

    }
);

/*************************
 * EXPORTAÇÃO GLOBAL
 *************************/

window.entrar =
    entrar;

window.sair =
    sair;

window.cadastrarPaciente =
    cadastrarPaciente;

window.excluirPaciente =
    excluirPaciente;

window.filtrarPacientes =
    filtrarPacientes;

console.log(
    "🏥 SIRMED carregado"
);
