/*************************************************
              CONSULTAS.JS - SIRMED V4.1
*************************************************/

import {
    db,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    serverTimestamp
} from "./firebase.js";

import {
    obterPacientes
} from "./pacientes.js";

import {
    obterProfissionais
} from "./profissionais.js";

import {
    mensagem,
    confirmar,
    limparCampos,
    formatarMoeda,
    formatarData,
    dataAtual,
    escaparHTML
} from "./utils.js";


/*************************************************
                    VARIÁVEIS
*************************************************/

const consultas = [];

let consultaEmEdicao = null;


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

                id: docSnap.id,

                ...docSnap.data()

            });

        }
    );

}


/*************************************************
                REGISTRAR CONSULTA
*************************************************/

export async function registrarConsulta() {

    const pacienteSelect =
        document.getElementById(
            "consultaPaciente"
        );


    const profissionalSelect =
        document.getElementById(
            "consultaProfissional"
        );


    const pacienteId =
        pacienteSelect?.value || "";


    const profissionalId =
        profissionalSelect?.value || "";


    const paciente =
        pacienteSelect
            ?.selectedOptions[0]
            ?.textContent
            ?.trim()
        || "";


    const profissional =
        profissionalSelect
            ?.selectedOptions[0]
            ?.textContent
            ?.trim()
        || "";


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


    const valor =
        Number(

            document
                .getElementById(
                    "consultaValor"
                )
                ?.value
            || 0

        );


    /*************************************************
                    VALIDAÇÃO
    *************************************************/

    if (
        !pacienteId ||
        !profissionalId
    ) {

        mensagem(
            "Selecione o paciente e o profissional."
        );

        return;

    }


    try {

        /*************************************************
                    EDITAR CONSULTA
        *************************************************/

        if (
            consultaEmEdicao
        ) {

            await atualizarConsulta({

                pacienteId,
                paciente,

                profissionalId,
                profissional,

                queixa,
                pa,
                fc,
                temperatura,

                diagnostico,
                exameFisico,
                prescricao,
                observacoes,

                valor

            });


            mensagem(
                "Consulta atualizada com sucesso."
            );


            consultaEmEdicao =
                null;


            atualizarBotaoConsulta(
                false
            );

        }


        /*************************************************
                    NOVA CONSULTA
        *************************************************/

        else {

            const data =
                dataAtual();


            /*************************************************
                CRIAR CONSULTA PRINCIPAL
            *************************************************/

            const consultaRef =
                await addDoc(

                    collection(
                        db,
                        "consultas"
                    ),

                    {

                        pacienteId,
                        paciente,

                        profissionalId,
                        profissional,

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


            const consultaId =
                consultaRef.id;


            /*************************************************
                    CRIAR PRONTUÁRIO
            *************************************************/

            await addDoc(

                collection(
                    db,
                    "prontuarios"
                ),

                {

                    consultaId,

                    pacienteId,

                    pacienteNome:
                        paciente,

                    profissionalId,

                    profissional,

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
                    CRIAR FINANCEIRO
            *************************************************/

            await addDoc(

                collection(
                    db,
                    "gastos"
                ),

                {

                    consultaId,

                    tipo:
                        "Consulta Médica",

                    pacienteId,

                    paciente,

                    valor,

                    data,

                    criadoEm:
                        serverTimestamp()

                }

            );


            mensagem(
                "Consulta registrada com sucesso."
            );

        }


        limparFormularioConsulta();


        /*************************************************
                ATUALIZAR TODO O SISTEMA
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
                EDITAR CONSULTA
*************************************************/

export function editarConsulta(
    id
) {

    const consulta =
        consultas.find(
            (c) =>
                c.id === id
        );


    if (!consulta) {

        mensagem(
            "Consulta não encontrada."
        );

        return;

    }


    consultaEmEdicao =
        id;


    /*************************************************
                    SELECT PACIENTE
    *************************************************/

    const pacienteSelect =
        document.getElementById(
            "consultaPaciente"
        );


    if (
        pacienteSelect
    ) {

        if (
            consulta.pacienteId
        ) {

            pacienteSelect.value =
                consulta.pacienteId;

        } else {

            const option =
                [
                    ...pacienteSelect.options
                ]
                .find(
                    (op) =>
                        op.textContent.trim() ===
                        consulta.paciente
                );


            if (option) {

                pacienteSelect.value =
                    option.value;

            }

        }

    }


    /*************************************************
                SELECT PROFISSIONAL
    *************************************************/

    const profissionalSelect =
        document.getElementById(
            "consultaProfissional"
        );


    if (
        profissionalSelect
    ) {

        if (
            consulta.profissionalId
        ) {

            profissionalSelect.value =
                consulta.profissionalId;

        } else {

            const option =
                [
                    ...profissionalSelect.options
                ]
                .find(
                    (op) =>
                        op.textContent.trim() ===
                        consulta.profissional
                );


            if (option) {

                profissionalSelect.value =
                    option.value;

            }

        }

    }


    /*************************************************
                    CAMPOS
    *************************************************/

    definirValor(
        "consultaQueixa",
        consulta.queixa
    );


    definirValor(
        "consultaPA",
        consulta.pa
    );


    definirValor(
        "consultaFC",
        consulta.fc
    );


    definirValor(
        "consultaTemperatura",
        consulta.temperatura
    );


    definirValor(
        "consultaDiagnostico",
        consulta.diagnostico
    );


    definirValor(
        "consultaExameFisico",
        consulta.exameFisico
    );


    definirValor(
        "consultaPrescricao",
        consulta.prescricao
    );


    definirValor(
        "consultaObservacoes",
        consulta.observacoes
    );


    definirValor(
        "consultaValor",
        consulta.valor
    );


    atualizarBotaoConsulta(
        true
    );


    document
        .getElementById(
            "secaoConsultas"
        )
        ?.scrollIntoView({

            behavior:
                "smooth"

        });

}


/*************************************************
                ATUALIZAR CONSULTA
*************************************************/

async function atualizarConsulta(
    dados
) {

    const id =
        consultaEmEdicao;


    /*************************************************
                    CONSULTA
    *************************************************/

    await updateDoc(

        doc(
            db,
            "consultas",
            id
        ),

        {

            ...dados,

            atualizadoEm:
                serverTimestamp()

        }

    );


    /*************************************************
                    PRONTUÁRIO
    *************************************************/

    const prontuarioQuery =
        query(

            collection(
                db,
                "prontuarios"
            ),

            where(
                "consultaId",
                "==",
                id
            )

        );


    const prontuarioSnap =
        await getDocs(
            prontuarioQuery
        );


    for (
        const prontuarioDoc
        of prontuarioSnap.docs
    ) {

        await updateDoc(

            doc(
                db,
                "prontuarios",
                prontuarioDoc.id
            ),

            {

                pacienteId:
                    dados.pacienteId,

                pacienteNome:
                    dados.paciente,

                profissionalId:
                    dados.profissionalId,

                profissional:
                    dados.profissional,

                queixa:
                    dados.queixa,

                pa:
                    dados.pa,

                fc:
                    dados.fc,

                temperatura:
                    dados.temperatura,

                exameFisico:
                    dados.exameFisico,

                diagnostico:
                    dados.diagnostico,

                prescricao:
                    dados.prescricao,

                observacoes:
                    dados.observacoes,

                atualizadoEm:
                    serverTimestamp()

            }

        );

    }


    /*************************************************
                    FINANCEIRO
    *************************************************/

    const financeiroQuery =
        query(

            collection(
                db,
                "gastos"
            ),

            where(
                "consultaId",
                "==",
                id
            )

        );


    const financeiroSnap =
        await getDocs(
            financeiroQuery
        );


    for (
        const financeiroDoc
        of financeiroSnap.docs
    ) {

        await updateDoc(

            doc(
                db,
                "gastos",
                financeiroDoc.id
            ),

            {

                pacienteId:
                    dados.pacienteId,

                paciente:
                    dados.paciente,

                valor:
                    dados.valor,

                atualizadoEm:
                    serverTimestamp()

            }

        );

    }

}


/*************************************************
                EXCLUIR CONSULTA
*************************************************/

export async function excluirConsulta(
    id
) {

    const consulta =
        consultas.find(
            (c) =>
                c.id === id
        );


    if (!consulta) {

        mensagem(
            "Consulta não encontrada."
        );

        return;

    }


    const resposta =
        confirmar(

            `Deseja realmente excluir a consulta de "${consulta.paciente}"?`

        );


    if (!resposta) {

        return;

    }


    try {

        /*************************************************
                EXCLUIR PRONTUÁRIO VINCULADO
        *************************************************/

        const prontuarioQuery =
            query(

                collection(
                    db,
                    "prontuarios"
                ),

                where(
                    "consultaId",
                    "==",
                    id
                )

            );


        const prontuarioSnap =
            await getDocs(
                prontuarioQuery
            );


        for (
            const prontuarioDoc
            of prontuarioSnap.docs
        ) {

            await deleteDoc(

                doc(
                    db,
                    "prontuarios",
                    prontuarioDoc.id
                )

            );

        }


        /*************************************************
                EXCLUIR FINANCEIRO VINCULADO
        *************************************************/

        const financeiroQuery =
            query(

                collection(
                    db,
                    "gastos"
                ),

                where(
                    "consultaId",
                    "==",
                    id
                )

            );


        const financeiroSnap =
            await getDocs(
                financeiroQuery
            );


        for (
            const financeiroDoc
            of financeiroSnap.docs
        ) {

            await deleteDoc(

                doc(
                    db,
                    "gastos",
                    financeiroDoc.id
                )

            );

        }


        /*************************************************
                    EXCLUIR CONSULTA
        *************************************************/

        await deleteDoc(

            doc(
                db,
                "consultas",
                id
            )

        );


        if (
            consultaEmEdicao ===
            id
        ) {

            limparFormularioConsulta();

        }


        mensagem(
            "Consulta excluída com sucesso."
        );


        document.dispatchEvent(

            new CustomEvent(
                "sirmed:dados-alterados"
            )

        );

    } catch (erro) {

        console.error(
            "Erro ao excluir consulta:",
            erro
        );


        mensagem(
            "Não foi possível excluir a consulta."
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


    lista.innerHTML =

        consultas.map(
            (c) => `

                <li class="item-registro">

                    <strong>

                        🏥 Consulta

                    </strong>


                    <span>

                        <b>Paciente:</b>

                        ${escaparHTML(
                            c.paciente || "-"
                        )}

                    </span>


                    <span>

                        <b>Profissional:</b>

                        ${escaparHTML(
                            c.profissional || "-"
                        )}

                    </span>


                    <span>

                        <b>Data:</b>

                        ${escaparHTML(
                            formatarData(
                                c.data
                            )
                        )}

                    </span>


                    <span>

                        <b>Queixa:</b>

                        ${escaparHTML(
                            c.queixa || "-"
                        )}

                    </span>


                    <span>

                        <b>Diagnóstico:</b>

                        ${escaparHTML(
                            c.diagnostico || "-"
                        )}

                    </span>


                    <span>

                        <b>Prescrição:</b>

                        ${escaparHTML(
                            c.prescricao || "-"
                        )}

                    </span>


                    <span>

                        <b>Valor:</b>

                        ${escaparHTML(
                            formatarMoeda(
                                c.valor
                            )
                        )}

                    </span>


                    <div class="acoes-registro">

                        <button
                            type="button"
                            class="btn-editar"
                            data-editar-consulta="${c.id}"
                        >
                            ✏️ Editar
                        </button>


                        <button
                            type="button"
                            class="btn-excluir"
                            data-excluir-consulta="${c.id}"
                        >
                            🗑️ Excluir
                        </button>

                    </div>

                </li>

            `
        ).join("");


    ligarBotoesConsultas();

}


/*************************************************
            LIGAR BOTÕES CONSULTAS
*************************************************/

function ligarBotoesConsultas() {

    document
        .querySelectorAll(
            "[data-editar-consulta]"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    () => {

                        editarConsulta(
                            botao.dataset
                                .editarConsulta
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-excluir-consulta]"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    () => {

                        excluirConsulta(
                            botao.dataset
                                .excluirConsulta
                        );

                    }
                );

            }
        );

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
            PREENCHER SELECTS CONSULTA
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

    if (
        pacienteSelect
    ) {

        const valorAtual =
            pacienteSelect.value;


        pacienteSelect.innerHTML = `

            <option value="">
                Selecione o Paciente
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


                    pacienteSelect.appendChild(
                        option
                    );

                }
            );


        if (
            [
                ...pacienteSelect.options
            ]
            .some(
                (op) =>
                    op.value ===
                    valorAtual
            )
        ) {

            pacienteSelect.value =
                valorAtual;

        }

    }


    /*************************************************
                    PROFISSIONAIS
    *************************************************/

    if (
        profissionalSelect
    ) {

        const valorAtual =
            profissionalSelect.value;


        profissionalSelect.innerHTML = `

            <option value="">
                Selecione o Profissional
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
                        p.nome;


                    profissionalSelect.appendChild(
                        option
                    );

                }
            );


        if (
            [
                ...profissionalSelect.options
            ]
            .some(
                (op) =>
                    op.value ===
                    valorAtual
            )
        ) {

            profissionalSelect.value =
                valorAtual;

        }

    }

}


/*************************************************
            LIMPAR FORMULÁRIO CONSULTA
*************************************************/

function limparFormularioConsulta() {

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


    const paciente =
        document.getElementById(
            "consultaPaciente"
        );


    const profissional =
        document.getElementById(
            "consultaProfissional"
        );


    if (paciente) {

        paciente.selectedIndex =
            0;

    }


    if (profissional) {

        profissional.selectedIndex =
            0;

    }


    consultaEmEdicao =
        null;


    atualizarBotaoConsulta(
        false
    );

}


/*************************************************
                DEFINIR VALOR
*************************************************/

function definirValor(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.value =
            valor ?? "";

    }

}


/*************************************************
            ALTERAR TEXTO DO BOTÃO
*************************************************/

function atualizarBotaoConsulta(
    editando
) {

    const botao =
        document.getElementById(
            "btnRegistrarConsulta"
        );


    if (!botao) {

        return;

    }


    botao.textContent =

        editando

        ? "💾 Salvar alterações"

        : "Registrar consulta";

}


/*************************************************
                    LOG
*************************************************/

console.log(
    "✅ consultas.js V4.1 carregado"
);
