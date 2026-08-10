/*************************************************
        TRIAGEM.JS - SIRMED V4.5
*************************************************/

import {
    db,
    collection,
    addDoc,
    getDocs,
    serverTimestamp
} from "./firebase.js";


/*************************************************
                DADOS LOCAIS
*************************************************/

let triagens = [];


/*************************************************
            CARREGAR TRIAGENS
*************************************************/

export async function carregarTriagens() {

    triagens = [];

    try {

        const snap = await getDocs(
            collection(db, "triagens")
        );

        snap.forEach(docSnap => {

            triagens.push({
                id: docSnap.id,
                ...docSnap.data()
            });

        });

        triagens.sort((a, b) => {

            const aData =
                `${a.data || ""} ${a.hora || ""}`;

            const bData =
                `${b.data || ""} ${b.hora || ""}`;

            return bData.localeCompare(aData);

        });

        console.log(
            "🩹 Triagens carregadas:",
            triagens.length
        );

    }

    catch (erro) {

        console.error(
            "❌ Erro ao carregar triagens:",
            erro
        );

        /*
            Não derrubamos o restante
            do SIRMED se a triagem falhar.
        */

        triagens = [];

    }

}


/*************************************************
        PREENCHER PACIENTES
*************************************************/

export function preencherPacientesTriagem() {

    const select =
        document.getElementById(
            "triagemPaciente"
        );

    if (!select) return;


    const valorAtual =
        select.value;


    select.innerHTML = `
        <option value="">
            Selecione o paciente
        </option>
    `;


    /*
        Compatível com pacientes.js atual.
    */

    const lista =
        Array.isArray(window.pacientes)
            ? window.pacientes
            : [];


    lista
        .slice()
        .sort((a, b) =>

            String(a.nome || "")
                .localeCompare(
                    String(b.nome || ""),
                    "pt-BR"
                )

        )
        .forEach(paciente => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                paciente.nome || "";

            option.textContent =
                paciente.nome || "Paciente";

            option.dataset.id =
                paciente.id || "";

            select.appendChild(option);

        });


    /*
        Mantém a seleção caso
        a lista seja recarregada.
    */

    if (
        valorAtual &&
        Array.from(select.options)
            .some(
                option =>
                    option.value === valorAtual
            )
    ) {

        select.value =
            valorAtual;

    }

}


/*************************************************
            DATA E HORA
*************************************************/

export function preencherDataHoraTriagem() {

    const agora =
        new Date();


    const data =
        document.getElementById(
            "triagemData"
        );


    const hora =
        document.getElementById(
            "triagemHora"
        );


    if (data && !data.value) {

        const ano =
            agora.getFullYear();

        const mes =
            String(
                agora.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                agora.getDate()
            ).padStart(2, "0");


        data.value =
            `${ano}-${mes}-${dia}`;

    }


    if (hora && !hora.value) {

        const h =
            String(
                agora.getHours()
            ).padStart(2, "0");

        const m =
            String(
                agora.getMinutes()
            ).padStart(2, "0");


        hora.value =
            `${h}:${m}`;

    }

}


/*************************************************
                CALCULAR IMC
*************************************************/

export function calcularIMC() {

    const peso =
        Number(
            document.getElementById(
                "triagemPeso"
            )?.value || 0
        );


    const altura =
        Number(
            document.getElementById(
                "triagemAltura"
            )?.value || 0
        );


    const campo =
        document.getElementById(
            "triagemIMC"
        );


    if (!campo) return;


    if (
        peso <= 0 ||
        altura <= 0
    ) {

        campo.value = "";

        return;

    }


    const imc =
        peso / (altura * altura);


    campo.value =
        imc.toFixed(2);

}


/*************************************************
            OBTER VALOR
*************************************************/

function valor(id) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {

        return "";

    }

    return String(
        elemento.value || ""
    ).trim();

}


/*************************************************
        OBTER PACIENTE SELECIONADO
*************************************************/

function obterPacienteSelecionado() {

    const select =
        document.getElementById(
            "triagemPaciente"
        );


    if (!select) {

        return {
            id: "",
            nome: ""
        };

    }


    const option =
        select.options[
            select.selectedIndex
        ];


    return {

        id:
            option?.dataset?.id || "",

        nome:
            select.value || ""

    };

}


/*************************************************
            REGISTRAR TRIAGEM
*************************************************/

export async function registrarTriagem() {

    const paciente =
        obterPacienteSelecionado();


    if (!paciente.nome) {

        alert(
            "Selecione o paciente."
        );

        return;

    }


    const data =
        valor("triagemData");


    const hora =
        valor("triagemHora");


    if (!data || !hora) {

        alert(
            "Informe a data e a hora da triagem."
        );

        return;

    }


    const registro = {

        pacienteId:
            paciente.id,

        pacienteNome:
            paciente.nome,

        data,

        hora,

        pa:
            valor("triagemPA"),

        fc:
            converterNumero(
                valor("triagemFC")
            ),

        fr:
            converterNumero(
                valor("triagemFR")
            ),

        saturacao:
            converterNumero(
                valor("triagemSaturacao")
            ),

        temperatura:
            converterNumero(
                valor("triagemTemperatura")
            ),

        glicemia:
            converterNumero(
                valor("triagemGlicemia")
            ),

        peso:
            converterNumero(
                valor("triagemPeso")
            ),

        altura:
            converterNumero(
                valor("triagemAltura")
            ),

        imc:
            converterNumero(
                valor("triagemIMC")
            ),

        dor:
            converterNumero(
                valor("triagemDor")
            ),

        queixa:
            valor("triagemQueixa"),

        alergias:
            valor("triagemAlergias"),

        medicamentos:
            valor(
                "triagemMedicamentos"
            ),

        observacoes:
            valor(
                "triagemObservacoes"
            ),

        criadoEm:
            serverTimestamp()

    };


    try {

        await addDoc(
            collection(
                db,
                "triagens"
            ),
            registro
        );


        alert(
            "Triagem registrada com sucesso."
        );


        limparFormularioTriagem();


        await carregarTriagens();


        renderTriagens();


        console.log(
            "✅ Triagem registrada"
        );

    }

    catch (erro) {

        console.error(
            "❌ Erro ao registrar triagem:",
            erro
        );


        alert(
            "Não foi possível registrar a triagem."
        );

    }

}


/*************************************************
            CONVERTER NÚMERO
*************************************************/

function converterNumero(valorRecebido) {

    if (
        valorRecebido === "" ||
        valorRecebido === null ||
        valorRecebido === undefined
    ) {

        return null;

    }


    const numero =
        Number(
            String(valorRecebido)
                .replace(",", ".")
        );


    return Number.isFinite(numero)
        ? numero
        : null;

}


/*************************************************
            LIMPAR FORMULÁRIO
*************************************************/

export function limparFormularioTriagem() {

    const campos = [

        "triagemPaciente",

        "triagemData",

        "triagemHora",

        "triagemPA",

        "triagemFC",

        "triagemFR",

        "triagemSaturacao",

        "triagemTemperatura",

        "triagemGlicemia",

        "triagemPeso",

        "triagemAltura",

        "triagemIMC",

        "triagemDor",

        "triagemQueixa",

        "triagemAlergias",

        "triagemMedicamentos",

        "triagemObservacoes"

    ];


    campos.forEach(id => {

        const elemento =
            document.getElementById(id);

        if (elemento) {

            elemento.value = "";

        }

    });


    preencherDataHoraTriagem();

}


/*************************************************
            ESCAPAR HTML
*************************************************/

function escaparHTML(texto) {

    return String(
        texto ?? ""
    )

    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/*************************************************
            FORMATAR DATA
*************************************************/

function formatarData(data) {

    if (!data) {

        return "-";

    }


    const partes =
        data.split("-");


    if (partes.length !== 3) {

        return data;

    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


/*************************************************
            RENDER TRIAGENS
*************************************************/

export function renderTriagens() {

    const lista =
        document.getElementById(
            "listaTriagens"
        );


    if (!lista) return;


    lista.innerHTML = "";


    if (triagens.length === 0) {

        lista.innerHTML = `
            <li>
                Nenhuma triagem registrada.
            </li>
        `;

        return;

    }


    triagens.forEach(t => {

        const li =
            document.createElement("li");


        li.innerHTML = `

            <strong>
                👤 ${escaparHTML(
                    t.pacienteNome || "-"
                )}
            </strong>

            <br><br>

            📅
            ${escaparHTML(
                formatarData(t.data)
            )}

            &nbsp;

            🕐
            ${escaparHTML(
                t.hora || "-"
            )}

            <br><br>

            🩸 <strong>PA:</strong>
            ${escaparHTML(
                t.pa || "-"
            )}

            <br>

            ❤️ <strong>FC:</strong>
            ${escaparHTML(
                t.fc ?? "-"
            )} bpm

            <br>

            🫁 <strong>FR:</strong>
            ${escaparHTML(
                t.fr ?? "-"
            )} irpm

            <br>

            🫁 <strong>SpO₂:</strong>
            ${escaparHTML(
                t.saturacao ?? "-"
            )} %

            <br>

            🌡️ <strong>Temperatura:</strong>
            ${escaparHTML(
                t.temperatura ?? "-"
            )} °C

            <br>

            🩸 <strong>Glicemia:</strong>
            ${escaparHTML(
                t.glicemia ?? "-"
            )} mg/dL

            <br>

            ⚖️ <strong>Peso:</strong>
            ${escaparHTML(
                t.peso ?? "-"
            )} kg

            <br>

            📏 <strong>Altura:</strong>
            ${escaparHTML(
                t.altura ?? "-"
            )} m

            <br>

            📊 <strong>IMC:</strong>
            ${escaparHTML(
                t.imc ?? "-"
            )}

            <br>

            😣 <strong>Dor:</strong>
            ${escaparHTML(
                t.dor ?? "-"
            )}/10

            <br><br>

            🩺 <strong>Queixa:</strong>
            ${escaparHTML(
                t.queixa || "-"
            )}

            <br><br>

            ⚠️ <strong>Alergias:</strong>
            ${escaparHTML(
                t.alergias || "-"
            )}

            <br><br>

            💊 <strong>Medicamentos:</strong>
            ${escaparHTML(
                t.medicamentos || "-"
            )}

            <br><br>

            📝 <strong>Observações:</strong>
            ${escaparHTML(
                t.observacoes || "-"
            )}

        `;


        lista.appendChild(li);

    });

}


/*************************************************
            FILTRAR TRIAGENS
*************************************************/

export function filtrarTriagens() {

    const pesquisa =
        document.getElementById(
            "pesquisaTriagem"
        );


    if (!pesquisa) return;


    const filtro =
        pesquisa.value
            .toLowerCase()
            .trim();


    document
        .querySelectorAll(
            "#listaTriagens li"
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


/*************************************************
        BUSCAR TRIAGENS DO PACIENTE
*************************************************/

export function buscarTriagensPaciente(
    paciente
) {

    const termo =
        String(
            paciente || ""
        )
        .trim()
        .toLowerCase();


    return triagens.filter(t => {

        return (

            String(
                t.pacienteNome || ""
            )
            .trim()
            .toLowerCase()
            === termo

            ||

            String(
                t.pacienteId || ""
            )
            === String(
                paciente || ""
            )

        );

    });

}


/*************************************************
        ÚLTIMA TRIAGEM
*************************************************/

export function ultimaTriagemPaciente(
    paciente
) {

    const resultado =
        buscarTriagensPaciente(
            paciente
        );


    return resultado.length
        ? resultado[0]
        : null;

}


/*************************************************
        CONFIGURAR EVENTOS
*************************************************/

let eventosConfigurados =
    false;


export function configurarEventosTriagem() {

    /*
        Evita adicionar os mesmos
        eventos duas vezes.
    */

    if (eventosConfigurados) {

        return;

    }


    eventosConfigurados =
        true;


    document
        .getElementById(
            "triagemPeso"
        )
        ?.addEventListener(
            "input",
            calcularIMC
        );


    document
        .getElementById(
            "triagemAltura"
        )
        ?.addEventListener(
            "input",
            calcularIMC
        );


    document
        .getElementById(
            "btnRegistrarTriagem"
        )
        ?.addEventListener(
            "click",
            registrarTriagem
        );


    document
        .getElementById(
            "pesquisaTriagem"
        )
        ?.addEventListener(
            "input",
            filtrarTriagens
        );


    preencherDataHoraTriagem();


    console.log(
        "🩹 Eventos da triagem configurados"
    );

}


/*************************************************
            EXPORTAÇÕES GLOBAIS
*************************************************/

window.carregarTriagens =
    carregarTriagens;


window.renderTriagens =
    renderTriagens;


window.preencherPacientesTriagem =
    preencherPacientesTriagem;


window.registrarTriagem =
    registrarTriagem;


window.calcularIMC =
    calcularIMC;


window.filtrarTriagens =
    filtrarTriagens;


window.buscarTriagensPaciente =
    buscarTriagensPaciente;


window.ultimaTriagemPaciente =
    ultimaTriagemPaciente;


/*************************************************
                    LOG
*************************************************/

console.log(
    "✅ triagem.js V4.5 carregado"
);
