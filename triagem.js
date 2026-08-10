/*************************************************
            TRIAGEM.JS - SIRMED V4.4
*************************************************/

import {
    db,
    collection,
    addDoc,
    getDocs,
    serverTimestamp
} from "./firebase.js";


import {
    dataAtual,
    mensagem,
    limparCampos
} from "./utils.js";


/*************************************************
                BANCO LOCAL
*************************************************/

let triagens = [];


/*************************************************
            CARREGAR TRIAGENS
*************************************************/

export async function carregarTriagens() {

    try {

        triagens = [];

        const snap = await getDocs(
            collection(
                db,
                "triagens"
            )
        );


        snap.forEach(
            (docSnap) => {

                triagens.push({

                    id: docSnap.id,

                    ...docSnap.data()

                });

            }
        );


        /*
            Mais recentes primeiro.
        */

        triagens.sort(
            (a, b) => {

                const dataA =
                    `${a.data || ""} ${a.hora || ""}`;

                const dataB =
                    `${b.data || ""} ${b.hora || ""}`;


                return dataB.localeCompare(
                    dataA
                );

            }
        );


        console.log(
            `🩹 ${triagens.length} triagens carregadas`
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar triagens:",
            erro
        );


        throw erro;

    }

}


/*************************************************
        PREENCHER SELECT DE PACIENTES
*************************************************/

export function preencherPacientesTriagem() {

    const select =
        document.getElementById(
            "triagemPaciente"
        );


    if (!select) {

        return;

    }


    /*
        Mantém o paciente selecionado
        caso a lista seja atualizada.
    */

    const selecionado =
        select.value;


    select.innerHTML = `
        <option value="">
            Selecione o paciente
        </option>
    `;


    const listaPacientes =
        window.pacientes || [];


    listaPacientes
        .slice()
        .sort(
            (a, b) =>
                String(a.nome || "")
                    .localeCompare(
                        String(b.nome || ""),
                        "pt-BR"
                    )
        )
        .forEach(
            (paciente) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    paciente.nome || "";


                option.textContent =
                    paciente.nome || "Paciente";


                /*
                    Guardamos também o ID
                    do paciente.
                */

                option.dataset.id =
                    paciente.id || "";


                select.appendChild(
                    option
                );

            }
        );


    if (
        selecionado
        &&
        [...select.options]
            .some(
                option =>
                    option.value ===
                    selecionado
            )
    ) {

        select.value =
            selecionado;

    }

}


/*************************************************
            DATA E HORA AUTOMÁTICAS
*************************************************/

export function preencherDataHoraTriagem() {

    const agora =
        new Date();


    const campoData =
        document.getElementById(
            "triagemData"
        );


    const campoHora =
        document.getElementById(
            "triagemHora"
        );


    if (
        campoData
        &&
        !campoData.value
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


        campoData.value =
            `${ano}-${mes}-${dia}`;

    }


    if (
        campoHora
        &&
        !campoHora.value
    ) {

        const horas =
            String(
                agora.getHours()
            )
            .padStart(
                2,
                "0"
            );


        const minutos =
            String(
                agora.getMinutes()
            )
            .padStart(
                2,
                "0"
            );


        campoHora.value =
            `${horas}:${minutos}`;

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
            )
            ?.value || 0
        );


    const altura =
        Number(
            document.getElementById(
                "triagemAltura"
            )
            ?.value || 0
        );


    const campoIMC =
        document.getElementById(
            "triagemIMC"
        );


    if (!campoIMC) {

        return;

    }


    if (
        peso <= 0
        ||
        altura <= 0
    ) {

        campoIMC.value = "";

        return;

    }


    const imc =
        peso /
        (
            altura *
            altura
        );


    campoIMC.value =
        imc.toFixed(2);

}


/*************************************************
            CLASSIFICAÇÃO DO IMC
*************************************************/

export function classificarIMC(
    valor
) {

    const imc =
        Number(valor);


    if (
        !imc
        ||
        imc <= 0
    ) {

        return "-";

    }


    if (imc < 18.5) {

        return "Baixo peso";

    }


    if (imc < 25) {

        return "Peso adequado";

    }


    if (imc < 30) {

        return "Sobrepeso";

    }


    if (imc < 35) {

        return "Obesidade grau I";

    }


    if (imc < 40) {

        return "Obesidade grau II";

    }


    return "Obesidade grau III";

}


/*************************************************
        OBTER ID DO PACIENTE
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
            option?.dataset?.id
            ||
            "",

        nome:
            select.value
            ||
            ""

    };

}


/*************************************************
            REGISTRAR TRIAGEM
*************************************************/

export async function registrarTriagem() {

    const paciente =
        obterPacienteSelecionado();


    const data =
        document.getElementById(
            "triagemData"
        )
        ?.value || "";


    const hora =
        document.getElementById(
            "triagemHora"
        )
        ?.value || "";


    const pa =
        document.getElementById(
            "triagemPA"
        )
        ?.value
        .trim() || "";


    const fc =
        document.getElementById(
            "triagemFC"
        )
        ?.value || "";


    const fr =
        document.getElementById(
            "triagemFR"
        )
        ?.value || "";


    const saturacao =
        document.getElementById(
            "triagemSaturacao"
        )
        ?.value || "";


    const temperatura =
        document.getElementById(
            "triagemTemperatura"
        )
        ?.value || "";


    const glicemia =
        document.getElementById(
            "triagemGlicemia"
        )
        ?.value || "";


    const peso =
        document.getElementById(
            "triagemPeso"
        )
        ?.value || "";


    const altura =
        document.getElementById(
            "triagemAltura"
        )
        ?.value || "";


    const imc =
        document.getElementById(
            "triagemIMC"
        )
        ?.value || "";


    const dor =
        document.getElementById(
            "triagemDor"
        )
        ?.value || "";


    const queixa =
        document.getElementById(
            "triagemQueixa"
        )
        ?.value
        .trim() || "";


    const alergias =
        document.getElementById(
            "triagemAlergias"
        )
        ?.value
        .trim() || "";


    const medicamentos =
        document.getElementById(
            "triagemMedicamentos"
        )
        ?.value
        .trim() || "";


    const observacoes =
        document.getElementById(
            "triagemObservacoes"
        )
        ?.value
        .trim() || "";


    /*************************************************
                    VALIDAÇÕES
    *************************************************/

    if (!paciente.nome) {

        mensagem(
            "Selecione o paciente."
        );

        return;

    }


    if (!data) {

        mensagem(
            "Informe a data da triagem."
        );

        return;

    }


    if (!hora) {

        mensagem(
            "Informe a hora da triagem."
        );

        return;

    }


    try {

        /*************************************************
                SALVAR NO FIRESTORE
        *************************************************/

        await addDoc(

            collection(
                db,
                "triagens"
            ),

            {

                pacienteId:
                    paciente.id,

                pacienteNome:
                    paciente.nome,

                data,

                hora,

                pa,

                fc:
                    fc
                        ? Number(fc)
                        : null,

                fr:
                    fr
                        ? Number(fr)
                        : null,

                saturacao:
                    saturacao
                        ? Number(saturacao)
                        : null,

                temperatura:
                    temperatura
                        ? Number(temperatura)
                        : null,

                glicemia:
                    glicemia
                        ? Number(glicemia)
                        : null,

                peso:
                    peso
                        ? Number(peso)
                        : null,

                altura:
                    altura
                        ? Number(altura)
                        : null,

                imc:
                    imc
                        ? Number(imc)
                        : null,

                dor:
                    dor !== ""
                        ? Number(dor)
                        : null,

                queixa,

                alergias,

                medicamentos,

                observacoes,

                criadoEm:
                    serverTimestamp()

            }

        );


        mensagem(
            "Triagem registrada com sucesso."
        );


        /*************************************************
                LIMPAR FORMULÁRIO
        *************************************************/

        limparFormularioTriagem();


        /*************************************************
                ATUALIZAR LISTA
        *************************************************/

        await carregarTriagens();


        renderTriagens();


        /*
            Avisa o restante do SIRMED
            que os dados mudaram.
        */

        document.dispatchEvent(

            new CustomEvent(
                "sirmed:dados-alterados"
            )

        );


    } catch (erro) {

        console.error(
            "Erro ao registrar triagem:",
            erro
        );


        mensagem(
            "Não foi possível registrar a triagem."
        );

    }

}


/*************************************************
            LIMPAR FORMULÁRIO
*************************************************/

export function limparFormularioTriagem() {

    limparCampos([

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

    ]);


    /*
        Após limpar, coloca novamente
        data e hora atuais.
    */

    preencherDataHoraTriagem();

}


/*************************************************
            FORMATAR DATA
*************************************************/

function formatarDataTriagem(
    data
) {

    if (!data) {

        return "-";

    }


    const partes =
        data.split("-");


    if (
        partes.length !== 3
    ) {

        return data;

    }


    return (
        `${partes[2]}/${partes[1]}/${partes[0]}`
    );

}


/*************************************************
        EVITAR HTML INJETADO
*************************************************/

function escaparHTML(
    valor
) {

    return String(
        valor ?? ""
    )
    .replaceAll(
        "&",
        "&amp;"
    )
    .replaceAll(
        "<",
        "&lt;"
    )
    .replaceAll(
        ">",
        "&gt;"
    )
    .replaceAll(
        '"',
        "&quot;"
    )
    .replaceAll(
        "'",
        "&#039;"
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


    if (
        triagens.length === 0
    ) {

        lista.innerHTML = `
            <li class="item-vazio">
                Nenhuma triagem registrada.
            </li>
        `;

        return;

    }


    triagens.forEach(
        (triagem) => {

            const li =
                document.createElement(
                    "li"
                );


            li.className =
                "item-registro item-triagem";


            const classificacaoIMC =
                classificarIMC(
                    triagem.imc
                );


            li.innerHTML = `

                <div class="registro-cabecalho">

                    <strong>
                        👤 ${escaparHTML(
                            triagem.pacienteNome
                        )}
                    </strong>

                    <span>
                        📅 ${escaparHTML(
                            formatarDataTriagem(
                                triagem.data
                            )
                        )}

                        🕐 ${escaparHTML(
                            triagem.hora || "-"
                        )}
                    </span>

                </div>


                <div class="registro-dados">

                    <p>
                        <strong>🩸 PA:</strong>
                        ${escaparHTML(
                            triagem.pa || "-"
                        )}
                    </p>


                    <p>
                        <strong>❤️ FC:</strong>
                        ${escaparHTML(
                            triagem.fc ?? "-"
                        )} bpm
                    </p>


                    <p>
                        <strong>🫁 FR:</strong>
                        ${escaparHTML(
                            triagem.fr ?? "-"
                        )} irpm
                    </p>


                    <p>
                        <strong>🫁 SpO₂:</strong>
                        ${escaparHTML(
                            triagem.saturacao ?? "-"
                        )}%
                    </p>


                    <p>
                        <strong>🌡️ Temperatura:</strong>
                        ${escaparHTML(
                            triagem.temperatura ?? "-"
                        )} °C
                    </p>


                    <p>
                        <strong>🩸 Glicemia:</strong>
                        ${escaparHTML(
                            triagem.glicemia ?? "-"
                        )} mg/dL
                    </p>


                    <p>
                        <strong>⚖️ Peso:</strong>
                        ${escaparHTML(
                            triagem.peso ?? "-"
                        )} kg
                    </p>


                    <p>
                        <strong>📏 Altura:</strong>
                        ${escaparHTML(
                            triagem.altura ?? "-"
                        )} m
                    </p>


                    <p>
                        <strong>📊 IMC:</strong>
                        ${escaparHTML(
                            triagem.imc ?? "-"
                        )}

                        ${
                            triagem.imc
                                ? `(${escaparHTML(
                                    classificacaoIMC
                                )})`
                                : ""
                        }
                    </p>


                    <p>
                        <strong>😣 Dor:</strong>
                        ${escaparHTML(
                            triagem.dor ?? "-"
                        )}/10
                    </p>

                </div>


                <div class="registro-textos">

                    <p>
                        <strong>🩺 Queixa principal:</strong><br>
                        ${escaparHTML(
                            triagem.queixa || "-"
                        )}
                    </p>


                    <p>
                        <strong>⚠️ Alergias:</strong><br>
                        ${escaparHTML(
                            triagem.alergias || "-"
                        )}
                    </p>


                    <p>
                        <strong>💊 Medicamentos em uso:</strong><br>
                        ${escaparHTML(
                            triagem.medicamentos || "-"
                        )}
                    </p>


                    <p>
                        <strong>📝 Observações:</strong><br>
                        ${escaparHTML(
                            triagem.observacoes || "-"
                        )}
                    </p>

                </div>

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

    const campo =
        document.getElementById(
            "pesquisaTriagem"
        );


    if (!campo) {

        return;

    }


    const filtro =
        campo.value
            .trim()
            .toLowerCase();


    document
        .querySelectorAll(
            "#listaTriagens li"
        )
        .forEach(
            (li) => {

                const texto =
                    li.textContent
                        .toLowerCase();


                li.style.display =
                    texto.includes(
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
        (triagem) => {

            return (

                String(
                    triagem.pacienteNome || ""
                )
                .trim()
                .toLowerCase()
                ===
                termo

                ||

                String(
                    triagem.pacienteId || ""
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
        ÚLTIMA TRIAGEM DO PACIENTE
*************************************************/

export function ultimaTriagemPaciente(
    paciente
) {

    const resultado =
        buscarTriagensPaciente(
            paciente
        );


    return (
        resultado[0]
        ||
        null
    );

}


/*************************************************
        CONFIGURAR EVENTOS DA TRIAGEM
*************************************************/

export function configurarEventosTriagem() {

    const peso =
        document.getElementById(
            "triagemPeso"
        );


    const altura =
        document.getElementById(
            "triagemAltura"
        );


    peso?.addEventListener(
        "input",
        calcularIMC
    );


    altura?.addEventListener(
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

}


/*************************************************
            EXPORTAÇÃO GLOBAL
*************************************************/

window.carregarTriagens =
    carregarTriagens;


window.renderTriagens =
    renderTriagens;


window.registrarTriagem =
    registrarTriagem;


window.filtrarTriagens =
    filtrarTriagens;


window.calcularIMC =
    calcularIMC;


window.preencherPacientesTriagem =
    preencherPacientesTriagem;


window.ultimaTriagemPaciente =
    ultimaTriagemPaciente;


/*************************************************
                    LOG
*************************************************/

console.log(
    "✅ triagem.js V4.4 carregado"
);
