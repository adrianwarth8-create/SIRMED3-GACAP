/*************************************************
        TRIAGEM.JS - SIRMED V4.6
*************************************************/


/*************************************************
                    FIREBASE
*************************************************/

import {
    db,
    collection,
    addDoc,
    getDocs,
    serverTimestamp
} from "./firebase.js";


/*************************************************
                    PACIENTES
*************************************************/

import {
    obterPacientes
} from "./pacientes.js";


/*************************************************
                DADOS LOCAIS
*************************************************/

let triagens = [];


/*************************************************
            OBTER TRIAGENS
*************************************************/

export function obterTriagens() {

    return triagens;

}


/*************************************************
            CARREGAR TRIAGENS
*************************************************/

export async function carregarTriagens() {

    triagens = [];

    try {

        const snap =
            await getDocs(
                collection(
                    db,
                    "triagens"
                )
            );


        snap.forEach(
            (docSnap) => {

                triagens.push({

                    id:
                        docSnap.id,

                    ...docSnap.data()

                });

            }
        );


        /*************************************************
                    ORDENAR TRIAGENS
        *************************************************/

        triagens.sort(
            (a, b) => {

                const aData =
                    `${a.data || ""} ${a.hora || ""}`;

                const bData =
                    `${b.data || ""} ${b.hora || ""}`;

                return bData.localeCompare(
                    aData
                );

            }
        );


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
            Uma falha na triagem não deve
            impedir o restante do SIRMED
            de funcionar.
        */

        triagens = [];

    }

}


/*************************************************
        PREENCHER PACIENTES DA TRIAGEM
*************************************************/

export function preencherPacientesTriagem() {

    const select =
        document.getElementById(
            "triagemPaciente"
        );


    if (!select) {

        return;

    }


    const valorAtual =
        select.value;


    select.innerHTML = `

        <option value="">
            Selecione o paciente
        </option>

    `;


    /*************************************************
        BUSCAR PACIENTES DO MÓDULO PACIENTES.JS
    *************************************************/

    const lista =
        obterPacientes();


    if (
        !Array.isArray(lista)
    ) {

        console.warn(
            "⚠️ Lista de pacientes inválida."
        );

        return;

    }


    /*************************************************
                ORDENAR E ADICIONAR
    *************************************************/

    lista
        .slice()
        .sort(
            (a, b) =>

                String(
                    a.nome || ""
                )
                .localeCompare(
                    String(
                        b.nome || ""
                    ),
                    "pt-BR"
                )
        )
        .forEach(
            (paciente) => {

                const option =
                    document.createElement(
                        "option"
                    );


                /*
                    O nome continua sendo usado
                    como valor para manter
                    compatibilidade com o restante
                    do SIRMED.
                */

                option.value =
                    paciente.nome || "";


                option.textContent =
                    paciente.nome ||
                    "Paciente";


                /*
                    Guardamos também o ID real
                    do documento no Firestore.
                */

                option.dataset.id =
                    paciente.id || "";


                select.appendChild(
                    option
                );

            }
        );


    /*************************************************
                RESTAURAR SELEÇÃO
    *************************************************/

    if (
        valorAtual
        &&
        Array.from(
            select.options
        )
        .some(
            (option) =>
                option.value ===
                valorAtual
        )
    ) {

        select.value =
            valorAtual;

    }


    console.log(
        "👤 Pacientes carregados na triagem:",
        lista.length
    );

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


    /*************************************************
                        DATA
    *************************************************/

    if (
        data
        &&
        !data.value
    ) {

        const ano =
            agora.getFullYear();


        const mes =
            String(
                agora.getMonth() + 1
            )
            .padStart(
                2,
                "0"
            );


        const dia =
            String(
                agora.getDate()
            )
            .padStart(
                2,
                "0"
            );


        data.value =
            `${ano}-${mes}-${dia}`;

    }


    /*************************************************
                        HORA
    *************************************************/

    if (
        hora
        &&
        !hora.value
    ) {

        const h =
            String(
                agora.getHours()
            )
            .padStart(
                2,
                "0"
            );


        const m =
            String(
                agora.getMinutes()
            )
            .padStart(
                2,
                "0"
            );


        hora.value =
            `${h}:${m}`;

    }

}


/*************************************************
                CALCULAR IMC
*************************************************/

export function calcularIMC() {

    const peso =
        converterNumero(
            valor(
                "triagemPeso"
            )
        );


    const altura =
        converterNumero(
            valor(
                "triagemAltura"
            )
        );


    const campo =
        document.getElementById(
            "triagemIMC"
        );


    if (!campo) {

        return;

    }


    if (
        !peso
        ||
        !altura
        ||
        peso <= 0
        ||
        altura <= 0
    ) {

        campo.value = "";

        return;

    }


    /*
        Aceita altura informada como:

        1.65
        1,65
        165

        Se for maior que 3,
        consideramos centímetros.
    */

    const alturaMetros =
        altura > 3
            ? altura / 100
            : altura;


    const imc =
        peso /
        (
            alturaMetros *
            alturaMetros
        );


    campo.value =
        imc.toFixed(
            2
        );

}


/*************************************************
                OBTER VALOR
*************************************************/

function valor(id) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {

        return "";

    }


    return String(
        elemento.value || ""
    )
    .trim();

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


    /*************************************************
                    PACIENTE
    *************************************************/

    if (!paciente.nome) {

        alert(
            "Selecione o paciente."
        );

        return;

    }


    /*************************************************
                    DATA E HORA
    *************************************************/

    /*
        Caso os campos de data/hora ainda
        não existam no HTML, usamos a
        data/hora atual como segurança.
    */

    const agora =
        new Date();


    let data =
        valor(
            "triagemData"
        );


    let hora =
        valor(
            "triagemHora"
        );


    if (!data) {

        const ano =
            agora.getFullYear();


        const mes =
            String(
                agora.getMonth() + 1
            )
            .padStart(
                2,
                "0"
            );


        const dia =
            String(
                agora.getDate()
            )
            .padStart(
                2,
                "0"
            );


        data =
            `${ano}-${mes}-${dia}`;

    }


    if (!hora) {

        const h =
            String(
                agora.getHours()
            )
            .padStart(
                2,
                "0"
            );


        const m =
            String(
                agora.getMinutes()
            )
            .padStart(
                2,
                "0"
            );


        hora =
            `${h}:${m}`;

    }


    /*************************************************
                    CALCULAR IMC
    *************************************************/

    calcularIMC();


    /*************************************************
                MONTAR REGISTRO
    *************************************************/

    const registro = {

        pacienteId:
            paciente.id,

        pacienteNome:
            paciente.nome,

        data,

        hora,

        pa:
            valor(
                "triagemPA"
            ),

        fc:
            converterNumero(
                valor(
                    "triagemFC"
                )
            ),

        fr:
            converterNumero(
                valor(
                    "triagemFR"
                )
            ),

        saturacao:
            converterNumero(
                valor(
                    "triagemSaturacao"
                )
            ),

        temperatura:
            converterNumero(
                valor(
                    "triagemTemperatura"
                )
            ),

        glicemia:
            converterNumero(
                valor(
                    "triagemGlicemia"
                )
            ),

        peso:
            converterNumero(
                valor(
                    "triagemPeso"
                )
            ),

        altura:
            converterNumero(
                valor(
                    "triagemAltura"
                )
            ),

        imc:
            converterNumero(
                valor(
                    "triagemIMC"
                )
            ),

        dor:
            converterNumero(
                valor(
                    "triagemDor"
                )
            ),

        queixa:
            valor(
                "triagemQueixa"
            ),

        alergias:
            valor(
                "triagemAlergias"
            ),

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


    /*************************************************
                SALVAR NO FIRESTORE
    *************************************************/

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


        /*************************************************
                    ATUALIZAR TELA
        *************************************************/

        limparFormularioTriagem();


        await carregarTriagens();


        renderTriagens();


        preencherPacientesTriagem();


        console.log(
            "✅ Triagem registrada com sucesso."
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

function converterNumero(
    valorRecebido
) {

    if (
        valorRecebido === ""
        ||
        valorRecebido === null
        ||
        valorRecebido === undefined
    ) {

        return null;

    }


    const numero =
        Number(

            String(
                valorRecebido
            )
            .replace(
                ",",
                "."
            )

        );


    return Number.isFinite(
        numero
    )
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


    campos.forEach(
        (id) => {

            const elemento =
                document.getElementById(
                    id
                );


            if (elemento) {

                elemento.value = "";

            }

        }
    );


    preencherDataHoraTriagem();


    preencherPacientesTriagem();

}


/*************************************************
                ESCAPAR HTML
*************************************************/

function escaparHTML(texto) {

    return String(
        texto ?? ""
    )

    .replace(
        /&/g,
        "&amp;"
    )

    .replace(
        /</g,
        "&lt;"
    )

    .replace(
        />/g,
        "&gt;"
    )

    .replace(
        /"/g,
        "&quot;"
    )

    .replace(
        /'/g,
        "&#039;"
    );

}


/*************************************************
                FORMATAR DATA
*************************************************/

function formatarData(data) {

    if (!data) {

        return "-";

    }


    const partes =
        String(
            data
        )
        .split(
            "-"
        );


    if (
        partes.length !== 3
    ) {

        return data;

    }


    return (
        partes[2]
        +
        "/"
        +
        partes[1]
        +
        "/"
        +
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


    if (!lista) {

        return;

    }


    lista.innerHTML = "";


    /*************************************************
                    LISTA VAZIA
    *************************************************/

    if (
        triagens.length === 0
    ) {

        lista.innerHTML = `

            <li class="lista-vazia">

                Nenhuma triagem registrada.

            </li>

        `;


        return;

    }


    /*************************************************
                EXIBIR TRIAGENS
    *************************************************/

    triagens.forEach(
        (t) => {

            const li =
                document.createElement(
                    "li"
                );


            li.className =
                "item-registro";


            li.innerHTML = `

                <strong>
                    👤 ${
                        escaparHTML(
                            t.pacienteNome || "-"
                        )
                    }
                </strong>

                <br><br>

                📅
                ${
                    escaparHTML(
                        formatarData(
                            t.data
                        )
                    )
                }

                &nbsp;

                🕐
                ${
                    escaparHTML(
                        t.hora || "-"
                    )
                }

                <br><br>

                🩸 <strong>PA:</strong>
                ${
                    escaparHTML(
                        t.pa || "-"
                    )
                }

                <br>

                ❤️ <strong>FC:</strong>
                ${
                    escaparHTML(
                        t.fc ?? "-"
                    )
                } bpm

                <br>

                🫁 <strong>FR:</strong>
                ${
                    escaparHTML(
                        t.fr ?? "-"
                    )
                } irpm

                <br>

                🫁 <strong>SpO₂:</strong>
                ${
                    escaparHTML(
                        t.saturacao ?? "-"
                    )
                } %

                <br>

                🌡️ <strong>Temperatura:</strong>
                ${
                    escaparHTML(
                        t.temperatura ?? "-"
                    )
                } °C

                <br>

                🩸 <strong>Glicemia:</strong>
                ${
                    escaparHTML(
                        t.glicemia ?? "-"
                    )
                } mg/dL

                <br>

                ⚖️ <strong>Peso:</strong>
                ${
                    escaparHTML(
                        t.peso ?? "-"
                    )
                } kg

                <br>

                📏 <strong>Altura:</strong>
                ${
                    escaparHTML(
                        t.altura ?? "-"
                    )
                } m

                <br>

                📊 <strong>IMC:</strong>
                ${
                    escaparHTML(
                        t.imc ?? "-"
                    )
                }

                <br>

                😣 <strong>Dor:</strong>
                ${
                    escaparHTML(
                        t.dor ?? "-"
                    )
                }/10

                <br><br>

                🩺 <strong>Queixa:</strong>
                ${
                    escaparHTML(
                        t.queixa || "-"
                    )
                }

                <br><br>

                ⚠️ <strong>Alergias:</strong>
                ${
                    escaparHTML(
                        t.alergias || "-"
                    )
                }

                <br><br>

                💊 <strong>Medicamentos:</strong>
                ${
                    escaparHTML(
                        t.medicamentos || "-"
                    )
                }

                <br><br>

                📝 <strong>Observações:</strong>
                ${
                    escaparHTML(
                        t.observacoes || "-"
                    )
                }

            `;


            lista.appendChild(
                li
            );

        }
    );

}


/*************************************************
            FILTRAR TRIAGENS
*************************************************/

export function filtrarTriagens() {

    const pesquisa =
        document.getElementById(
            "pesquisaTriagem"
        );


    if (!pesquisa) {

        return;

    }


    const filtro =
        pesquisa.value
            .toLowerCase()
            .trim();


    document
        .querySelectorAll(
            "#listaTriagens li"
        )
        .forEach(
            (li) => {

                li.style.display =

                    li.textContent
                        .toLowerCase()
                        .includes(
                            filtro
                        )

                        ? ""

                        : "none";

            }
        );

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


    return triagens.filter(
        (t) => {

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
                ===
                String(
                    paciente || ""
                )

            );

        }
    );

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
        Evita registrar os mesmos
        eventos mais de uma vez.
    */

    if (
        eventosConfigurados
    ) {

        return;

    }


    eventosConfigurados =
        true;


    /*************************************************
                    PESO
    *************************************************/

    document
        .getElementById(
            "triagemPeso"
        )
        ?.addEventListener(
            "input",
            calcularIMC
        );


    /*************************************************
                    ALTURA
    *************************************************/

    document
        .getElementById(
            "triagemAltura"
        )
        ?.addEventListener(
            "input",
            calcularIMC
        );


    /*************************************************
                REGISTRAR TRIAGEM
    *************************************************/

    document
        .getElementById(
            "btnRegistrarTriagem"
        )
        ?.addEventListener(
            "click",
            registrarTriagem
        );


    /*************************************************
                    PESQUISA
    *************************************************/

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
        "🩹 Eventos da triagem configurados."
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
    "✅ triagem.js V4.6 carregado"
);
