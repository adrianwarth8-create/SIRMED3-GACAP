/*************************************************
              CONSULTAS.JS - SIRMED V4
*************************************************/

import {
    db,
    collection,
    getDocs,
    doc,
    serverTimestamp,
    writeBatch
} from "./firebase.js";

import {
    mensagem,
    limparCampos,
    formatarMoeda,
    formatarData,
    dataAtualISO,
    escaparHTML
} from "./utils.js";

import {
    obterPacientes
} from "./pacientes.js";

import {
    obterProfissionais
} from "./profissionais.js";


/*************************************************
                VARIÁVEL PRINCIPAL
*************************************************/

const consultas = [];


/*************************************************
                OBTER CONSULTAS
*************************************************/

export function obterConsultas() {

    return consultas;

}


/*************************************************
                TOTAL CONSULTAS
*************************************************/

export function totalConsultas() {

    return consultas.length;

}


/*************************************************
                CARREGAR CONSULTAS
*************************************************/

export async function carregarConsultas() {

    const snap =
        await getDocs(
            collection(
                db,
                "consultas"
            )
        );


    consultas.length = 0;


    snap.forEach(
        (docSnap) => {

            consultas.push({

                id:
                    docSnap.id,

                ...docSnap.data()

            });

        }
    );


    /*************************************************
                ORDENAR POR DATA
    *************************************************/

    consultas.sort(
        (a, b) =>

            String(
                b.data || ""
            ).localeCompare(

                String(
                    a.data || ""
                )

            )
    );

}


/*************************************************
                REGISTRAR CONSULTA
*************************************************/

export async function registrarConsulta() {

    const pacienteId =
        document
            .getElementById(
                "consultaPaciente"
            )
            ?.value
        || "";


    const profissionalId =
        document
            .getElementById(
                "consultaProfissional"
            )
            ?.value
        || "";


    /*************************************************
            LOCALIZAR PACIENTE
    *************************************************/

    const paciente =
        obterPacientes()
            .find(
                (p) =>
                    p.id === pacienteId
            );


    /*************************************************
            LOCALIZAR PROFISSIONAL
    *************************************************/

    const profissional =
        obterProfissionais()
            .find(
                (p) =>
                    p.id === profissionalId
            );


    /*************************************************
                    CAMPOS
    *************************************************/

    const queixa =
        document
            .getElementById(
                "consultaQueixa"
            )
            ?.value
            .trim()
        || "";


    const pa =
        document
            .getElementById(
                "consultaPA"
            )
            ?.value
            .trim()
        || "";


    const fc =
        document
            .getElementById(
                "consultaFC"
            )
            ?.value
            .trim()
        || "";


    const temperatura =
        document
            .getElementById(
                "consultaTemperatura"
            )
            ?.value
            .trim()
        || "";


    const diagnostico =
        document
            .getElementById(
                "consultaDiagnostico"
            )
            ?.value
            .trim()
        || "";


    const exameFisico =
        document
            .getElementById(
                "consultaExameFisico"
            )
            ?.value
            .trim()
        || "";


    const prescricao =
        document
            .getElementById(
                "consultaPrescricao"
            )
            ?.value
            .trim()
        || "";


    const observacoes =
        document
            .getElementById(
                "consultaObservacoes"
            )
            ?.value
            .trim()
        || "";


    /*************************************************
                    VALOR
    *************************************************/

    const valorTexto =
        document
            .getElementById(
                "consultaValor"
            )
            ?.value
        || "0";


    const valor =
        Number(
            String(
                valorTexto
            ).replace(
                ",",
                "."
            )
        );


    /*************************************************
                    VALIDAÇÃO
    *************************************************/

    if (
        !paciente ||
        !profissional
    ) {

        mensagem(
            "Selecione o paciente e o profissional."
        );

        return;

    }


    if (
        !Number.isFinite(valor) ||
        valor < 0
    ) {

        mensagem(
            "Informe um valor válido para a consulta."
        );

        return;

    }


    const data =
        dataAtualISO();


    /*************************************************
            GRAVAÇÃO EM LOTE
    *************************************************/

    try {

        const batch =
            writeBatch(db);


        /*************************************************
                    CONSULTA
        *************************************************/

        const consultaRef =
            doc(
                collection(
                    db,
                    "consultas"
                )
            );


        batch.set(

            consultaRef,

            {

                pacienteId:
                    paciente.id,

                paciente:
                    paciente.nome,

                profissionalId:
                    profissional.id,

                profissional:
                    profissional.nome,

                queixa,

                pa,

                fc,

                temperatura,

                diagnostico,

                exameFisico,

                prescricao,

                observacoes,

                valor,

                data,

                criadoEm:
                    serverTimestamp()

            }

        );


        /*************************************************
                    FINANCEIRO
        *************************************************/

        const gastoRef =
            doc(
                collection(
                    db,
                    "gastos"
                )
            );


        batch.set(

            gastoRef,

            {

                consultaId:
                    consultaRef.id,

                tipo:
                    "Consulta Médica",

                pacienteId:
                    paciente.id,

                paciente:
                    paciente.nome,

                valor,

                data,

                criadoEm:
                    serverTimestamp()

            }

        );


        /*************************************************
                    PRONTUÁRIO
        *************************************************/

        const prontuarioRef =
            doc(
                collection(
                    db,
                    "prontuarios"
                )
            );


        batch.set(

            prontuarioRef,

            {

                consultaId:
                    consultaRef.id,

                pacienteId:
                    paciente.id,

                pacienteNome:
                    paciente.nome,

                profissionalId:
                    profissional.id,

                profissional:
                    profissional.nome,

                profissionalNome:
                    profissional.nome,

                data,

                queixa,

                pa,

                fc,

                temperatura,

                exameFisico,

                diagnostico,

                prescricao,

                observacoes,

                criadoEm:
                    serverTimestamp()

            }

        );


        /*************************************************
                CONFIRMAR GRAVAÇÃO
        *************************************************/

        await batch.commit();


        /*************************************************
                LIMPAR FORMULÁRIO
        *************************************************/

        limparCampos([

            "consultaQueixa",

            "consultaPA",

            "consultaFC",

            "consultaTemperatura",

            "consultaDiagnostico",

            "consultaExameFisico",

            "consultaPrescricao",

            "consultaObservacoes",

            "consultaValor"

        ]);


        mensagem(
            "Consulta registrada com sucesso."
        );


        /*************************************************
                ATUALIZAR SISTEMA
        *************************************************/

        document.dispatchEvent(

            new CustomEvent(
                "sirmed:dados-alterados"
            )

        );

    } catch (erro) {

        console.error(
            "Erro ao registrar consulta:",
            erro
        );


        mensagem(
            "Não foi possível registrar a consulta."
        );

    }

}


/*************************************************
                RENDER CONSULTAS
*************************************************/

export function renderConsultas() {

    const lista =
        document.getElementById(
            "listaConsultas"
        );


    if (!lista) {

        return;

    }


    /*************************************************
                LISTA VAZIA
    *************************************************/

    if (
        consultas.length === 0
    ) {

        lista.innerHTML = `

            <li class="lista-vazia">

                Nenhuma consulta encontrada.

            </li>

        `;


        return;

    }


    /*************************************************
                RENDERIZAR
    *************************************************/

    lista.innerHTML =

        consultas.map(
            (c) => `

                <li class="item-registro">

                    <strong>

                        🏥 ${
                            escaparHTML(
                                c.paciente || "-"
                            )
                        }

                    </strong>


                    <span>

                        <b>Profissional:</b>

                        ${
                            escaparHTML(
                                c.profissional || "-"
                            )
                        }

                    </span>


                    <span>

                        <b>Data:</b>

                        ${
                            escaparHTML(
                                formatarData(
                                    c.data
                                )
                            )
                        }

                    </span>


                    <span>

                        <b>Queixa:</b>

                        ${
                            escaparHTML(
                                c.queixa || "-"
                            )
                        }

                    </span>


                    <span>

                        <b>Diagnóstico:</b>

                        ${
                            escaparHTML(
                                c.diagnostico || "-"
                            )
                        }

                    </span>


                    <span>

                        <b>Prescrição:</b>

                        ${
                            escaparHTML(
                                c.prescricao || "-"
                            )
                        }

                    </span>


                    <span>

                        <b>Valor:</b>

                        ${
                            escaparHTML(
                                formatarMoeda(
                                    c.valor
                                )
                            )
                        }

                    </span>

                </li>

            `
        ).join("");

}


/*************************************************
                FILTRAR CONSULTAS
*************************************************/

export function filtrarConsultas() {

    const filtro =
        (
            document
                .getElementById(
                    "pesquisaConsulta"
                )
                ?.value
            || ""
        )
        .toLowerCase();


    document
        .querySelectorAll(
            "#listaConsultas li"
        )
        .forEach(
            (li) => {

                li.style.display =

                    li
                        .textContent
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
            PREENCHER SELECTS
*************************************************/

export function preencherSelectsConsulta() {

    const pacienteSelect =
        document.getElementById(
            "consultaPaciente"
        );


    const profissionalSelect =
        document.getElementById(
            "consultaProfissional"
        );


    /*************************************************
                    PACIENTES
    *************************************************/

    if (pacienteSelect) {

        const valorAtual =
            pacienteSelect.value;


        pacienteSelect.innerHTML =
            `
                <option value="">
                    Selecione o paciente
                </option>
            `;


        obterPacientes()
            .forEach(
                (p) => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        p.id;


                    option.textContent =
                        p.nome;


                    pacienteSelect
                        .appendChild(
                            option
                        );

                }
            );


        if (
            [
                ...pacienteSelect.options
            ]
            .some(
                (option) =>
                    option.value === valorAtual
            )
        ) {

            pacienteSelect.value =
                valorAtual;

        }

    }


    /*************************************************
                PROFISSIONAIS
    *************************************************/

    if (profissionalSelect) {

        const valorAtual =
            profissionalSelect.value;


        profissionalSelect.innerHTML =
            `
                <option value="">
                    Selecione o profissional
                </option>
            `;


        obterProfissionais()
            .forEach(
                (p) => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        p.id;


                    option.textContent =

                        p.funcao

                        ? `${p.nome} — ${p.funcao}`

                        : p.nome;


                    profissionalSelect
                        .appendChild(
                            option
                        );

                }
            );


        if (
            [
                ...profissionalSelect.options
            ]
            .some(
                (option) =>
                    option.value === valorAtual
            )
        ) {

            profissionalSelect.value =
                valorAtual;

        }

    }

}


/*************************************************
                LOG DO SISTEMA
*************************************************/

console.log(
    "✅ consultas.js carregado"
);
