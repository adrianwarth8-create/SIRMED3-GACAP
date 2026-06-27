/*************************************************
        PROFISSIONAIS.JS - SIRMED V4
*************************************************/

let profissionais = [];

/*************************************************
        CARREGAR
*************************************************/

 export async function carregarProfissionais(){

    profissionais = [];

    const snap = await getDocs(
        collection(db,"profissionais")
    );

    snap.forEach(docSnap=>{

        profissionais.push({
            id:docSnap.id,
            ...docSnap.data()
        });

    });

}

/*************************************************
        CADASTRAR
*************************************************/

export async function cadastrarProfissional(){

    const nome =
        document.getElementById("profissionalNome").value.trim();

    const funcao =
        document.getElementById("profissionalFuncao").value;

    const registro =
        document.getElementById("profissionalRegistro").value.trim();

    if(nome=="" || funcao==""){

        alert("Preencha os campos obrigatórios.");

        return;

    }

    await addDoc(

        collection(db,"profissionais"),

        {

            nome,
            funcao,
            registro,

            criadoEm:serverTimestamp()

        }

    );

    limparFormularioProfissional();

    await carregarProfissionais();

    renderProfissionais();

    preencherSelectsConsulta();

    atualizarDashboard();

}

/*************************************************
        RENDER
*************************************************/

export function renderProfissionais(){

    const lista =
        document.getElementById("listaProfissionais");

    if(!lista) return;

    lista.innerHTML = "";

    profissionais.forEach(p=>{

        lista.innerHTML += `

<li>

<b>👨‍⚕️ ${p.nome}</b><br>

Função: ${p.funcao}<br>

Registro: ${p.registro || "-"}

</li>

`;

    });

}

/*************************************************
        PESQUISA
*************************************************/

export function filtrarProfissionais(){

    const filtro =
        document.getElementById("pesquisaProfissional")
        .value
        .toLowerCase();

    document
    .querySelectorAll("#listaProfissionais li")
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

export function limparFormularioProfissional(){

    document.getElementById("profissionalNome").value="";

    document.getElementById("profissionalFuncao").value="";

    document.getElementById("profissionalRegistro").value="";

}

/*************************************************
        EXPORTAÇÃO
*************************************************/

window.carregarProfissionais =
carregarProfissionais;

window.cadastrarProfissional =
cadastrarProfissional;

window.renderProfissionais =
renderProfissionais;

window.filtrarProfissionais =
filtrarProfissionais;

console.log("✅ profissionais.js carregado");
