/*************************************************
          CONSULTAS.JS - SIRMED V4.8
     TRIAGEM + DISPENSAÇÃO SISFAR
*************************************************/


/*************************************************
                    FIREBASE
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


/*************************************************
                    PACIENTES
*************************************************/

import {
    obterPacientes
} from "./pacientes.js";


/*************************************************
                  PROFISSIONAIS
*************************************************/

import {
    obterProfissionais
} from "./profissionais.js";


/*************************************************
                    TRIAGEM
*************************************************/

import {
    ultimaTriagemPaciente
} from "./triagem.js";


/*************************************************
                    UTILS
*************************************************/

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


/*
    Medicamentos estruturados que serão
    encaminhados para dispensação na farmácia.
*/

let medicamentosDispensacao = [];


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

    try {

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


        console.log(
            "🩺 Consultas carregadas:",
            consultas.length
        );

    }

    catch (erro) {

        console.error(
            "Erro ao carregar consultas:",
            erro
        );

    }

}


/*************************************************
        CRIAR PAINEL DA TRIAGEM NA CONSULTA
*************************************************/

function criarPainelTriagemConsulta() {

    let painel =
        document.getElementById(
            "painelTriagemConsulta"
        );


    if (painel) {

        return painel;

    }


    const secao =
        document.getElementById(
            "secaoConsultas"
        );


    if (!secao) {

        return null;

    }


    painel =
        document.createElement(
            "div"
        );


    painel.id =
        "painelTriagemConsulta";


    painel.style.display =
        "none";


    painel.style.margin =
        "15px 0 25px";


    painel.style.padding =
        "18px";


    painel.style.background =
        "rgba(35, 48, 25, 0.95)";


    painel.style.border =
        "1px solid #b8953d";


    painel.style.borderLeft =
        "5px solid #b8953d";


    painel.style.borderRadius =
        "4px";


    const formulario =
        secao.querySelector(
            ".grid-form"
        );


    if (formulario) {

        secao.insertBefore(
            painel,
            formulario
        );

    }

    else {

        secao.appendChild(
            painel
        );

    }


    return painel;

}


/*************************************************
          LIMPAR PAINEL DA TRIAGEM
*************************************************/

function limparPainelTriagem() {

    const painel =
        criarPainelTriagemConsulta();


    if (!painel) {

        return;

    }


    painel.innerHTML = "";

    painel.style.display =
        "none";

}


/*************************************************
          MOSTRAR ÚLTIMA TRIAGEM
*************************************************/

export function mostrarTriagemPaciente(
    preencherCampos = true
) {

    const pacienteSelect =
        document.getElementById(
            "consultaPaciente"
        );


    if (!pacienteSelect) {

        return;

    }


    const pacienteId =
        pacienteSelect.value;


    const pacienteNome =
        pacienteSelect
            .selectedOptions[0]
            ?.textContent
            ?.trim()
        || "";


    if (!pacienteId) {

        limparPainelTriagem();

        return;

    }


    let triagem =
        ultimaTriagemPaciente(
            pacienteId
        );


    if (!triagem) {

        triagem =
            ultimaTriagemPaciente(
                pacienteNome
            );

    }


    const painel =
        criarPainelTriagemConsulta();


    if (!painel) {

        return;

    }


    if (!triagem) {

        painel.style.display =
            "block";


        painel.innerHTML = `

            <h3 style="
                margin-top:0;
                color:#d7b85c;
            ">
                🩹 Última Triagem
            </h3>

            <p>
                Nenhuma triagem encontrada
                para este paciente.
            </p>

        `;


        return;

    }


    painel.style.display =
        "block";


    painel.innerHTML = `

        <h3 style="
            margin-top:0;
            color:#d7b85c;
        ">
            🩹 Última Triagem do Paciente
        </h3>


        <div style="
            display:grid;
            grid-template-columns:
                repeat(auto-fit,minmax(150px,1fr));
            gap:10px;
            margin-bottom:15px;
        ">

            <div>
                <strong>📅 Data</strong><br>
                ${escaparHTML(
                    formatarDataTriagem(
                        triagem.data
                    )
                )}
            </div>

            <div>
                <strong>🕐 Hora</strong><br>
                ${escaparHTML(
                    triagem.hora || "-"
                )}
            </div>

            <div>
                <strong>🩸 PA</strong><br>
                ${escaparHTML(
                    triagem.pa || "-"
                )}
            </div>

            <div>
                <strong>❤️ FC</strong><br>
                ${escaparHTML(
                    triagem.fc ?? "-"
                )} bpm
            </div>

            <div>
                <strong>🫁 FR</strong><br>
                ${escaparHTML(
                    triagem.fr ?? "-"
                )} irpm
            </div>

            <div>
                <strong>🫁 SpO₂</strong><br>
                ${escaparHTML(
                    triagem.saturacao ?? "-"
                )} %
            </div>

            <div>
                <strong>🌡️ Temperatura</strong><br>
                ${escaparHTML(
                    triagem.temperatura ?? "-"
                )} °C
            </div>

            <div>
                <strong>🩸 Glicemia</strong><br>
                ${escaparHTML(
                    triagem.glicemia ?? "-"
                )} mg/dL
            </div>

            <div>
                <strong>⚖️ Peso</strong><br>
                ${escaparHTML(
                    triagem.peso ?? "-"
                )} kg
            </div>

            <div>
                <strong>📏 Altura</strong><br>
                ${escaparHTML(
                    triagem.altura ?? "-"
                )}
            </div>

            <div>
                <strong>📊 IMC</strong><br>
                ${escaparHTML(
                    triagem.imc ?? "-"
                )}
            </div>

            <div>
                <strong>😣 Dor</strong><br>
                ${escaparHTML(
                    triagem.dor ?? "-"
                )}/10
            </div>

        </div>


        <hr style="
            border:0;
            border-top:1px solid #56633a;
            margin:15px 0;
        ">


        <p>
            <strong>
                🩺 Queixa principal:
            </strong>
            <br>
            ${escaparHTML(
                triagem.queixa || "-"
            )}
        </p>


        <p>
            <strong>
                ⚠️ Alergias:
            </strong>
            <br>
            ${escaparHTML(
                triagem.alergias || "-"
            )}
        </p>


        <p>
            <strong>
                💊 Medicamentos em uso:
            </strong>
            <br>
            ${escaparHTML(
                triagem.medicamentos || "-"
            )}
        </p>


        <p>
            <strong>
                📝 Observações:
            </strong>
            <br>
            ${escaparHTML(
                triagem.observacoes || "-"
            )}
        </p>

    `;


    if (
        preencherCampos
    ) {

        preencherConsultaComTriagem(
            triagem
        );

    }

}


/*************************************************
        PREENCHER CONSULTA COM TRIAGEM
*************************************************/

function preencherConsultaComTriagem(
    triagem
) {

    const campoQueixa =
        document.getElementById(
            "consultaQueixa"
        );


    const campoPA =
        document.getElementById(
            "consultaPA"
        );


    const campoFC =
        document.getElementById(
            "consultaFC"
        );


    const campoTemperatura =
        document.getElementById(
            "consultaTemperatura"
        );


    if (
        campoQueixa
        &&
        !campoQueixa.value
    ) {

        campoQueixa.value =
            triagem.queixa || "";

    }


    if (
        campoPA
        &&
        !campoPA.value
    ) {

        campoPA.value =
            triagem.pa || "";

    }


    if (
        campoFC
        &&
        !campoFC.value
    ) {

        campoFC.value =
            triagem.fc || "";

    }


    if (
        campoTemperatura
        &&
        !campoTemperatura.value
    ) {

        campoTemperatura.value =
            triagem.temperatura || "";

    }

}


/*************************************************
            FORMATAR DATA TRIAGEM
*************************************************/

function formatarDataTriagem(
    data
) {

    if (!data) {

        return "-";

    }


    if (
        typeof data === "string"
        &&
        /^\d{4}-\d{2}-\d{2}$/.test(
            data
        )
    ) {

        const [
            ano,
            mes,
            dia
        ] =
            data.split("-");


        return `${dia}/${mes}/${ano}`;

    }


    return String(
        data
    );

}


/*************************************************
        CONFIGURAR SELECT DE PACIENTE
*************************************************/

function configurarPacienteConsulta() {

    const select =
        document.getElementById(
            "consultaPaciente"
        );


    if (
        !select
        ||
        select.dataset.triagemConfigurada
            === "true"
    ) {

        return;

    }


    select.addEventListener(
        "change",
        () => {

            mostrarTriagemPaciente(
                true
            );

        }
    );


    select.dataset.triagemConfigurada =
        "true";

}


/*************************************************
        PREENCHER SELECTS DA CONSULTA
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


    if (
        !pacienteSelect
        ||
        !profissionalSelect
    ) {

        return;

    }


    const pacienteSelecionado =
        pacienteSelect.value;


    const profissionalSelecionado =
        profissionalSelect.value;


    pacienteSelect.innerHTML =
        `
            <option value="">
                Selecione o paciente
            </option>
        `;


    profissionalSelect.innerHTML =
        `
            <option value="">
                Selecione o profissional
            </option>
        `;


    obterPacientes()
        .forEach(
            (paciente) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    paciente.id;


                option.textContent =
                    paciente.nome;


                pacienteSelect.appendChild(
                    option
                );

            }
        );


    obterProfissionais()
        .forEach(
            (profissional) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    profissional.id;


                option.textContent =
                    profissional.nome;


                profissionalSelect.appendChild(
                    option
                );

            }
        );


    if (
        pacienteSelecionado
    ) {

        pacienteSelect.value =
            pacienteSelecionado;

    }


    if (
        profissionalSelecionado
    ) {

        profissionalSelect.value =
            profissionalSelecionado;

    }


    configurarPacienteConsulta();

}


/*************************************************
            OBTER VALOR DE CAMPO
*************************************************/

function obterValor(
    id
) {

    return (
        document
            .getElementById(
                id
            )
            ?.value
            ?.trim()
        || ""
    );

}


/*************************************************
        LIMPAR CAMPOS DE DISPENSAÇÃO
*************************************************/

function limparCamposDispensacao() {

    const ids = [

        "dispensacaoMedicamento",

        "dispensacaoQuantidade",

        "dispensacaoUnidade",

        "dispensacaoPosologia",

        "dispensacaoObservacao"

    ];


    ids.forEach(
        (id) => {

            const campo =
                document.getElementById(
                    id
                );


            if (campo) {

                campo.value = "";

            }

        }
    );

}


/*************************************************
      RENDERIZAR MEDICAMENTOS DISPENSAÇÃO
*************************************************/

function renderMedicamentosDispensacao() {

    const lista =
        document.getElementById(
            "listaMedicamentosDispensacao"
        );


    if (!lista) {

        return;

    }


    lista.innerHTML = "";


    if (
        medicamentosDispensacao.length === 0
    ) {

        lista.innerHTML = `

            <li class="lista-vazia">
                Nenhum medicamento adicionado.
            </li>

        `;


        return;

    }


    medicamentosDispensacao.forEach(
        (
            item,
            indice
        ) => {

            const li =
                document.createElement(
                    "li"
                );


            li.className =
                "item-lista";


            const status =
                String(
                    item.status || "pendente"
                )
                .toLowerCase();


            const bloqueado =
                status !== "pendente";


            li.innerHTML = `

                <div class="item-lista-conteudo">

                    <strong>
                        💊 ${escaparHTML(
                            item.medicamento
                        )}
                    </strong>

                    <span>
                        Quantidade:
                        ${escaparHTML(
                            item.quantidade
                        )}
                        ${escaparHTML(
                            item.unidade || ""
                        )}
                    </span>

                    ${
                        item.posologia
                        ? `
                            <span>
                                Posologia:
                                ${escaparHTML(
                                    item.posologia
                                )}
                            </span>
                        `
                        : ""
                    }

                    ${
                        item.observacao
                        ? `
                            <span>
                                Observação:
                                ${escaparHTML(
                                    item.observacao
                                )}
                            </span>
                        `
                        : ""
                    }

                    ${
                        bloqueado
                        ? `
                            <span>
                                Status:
                                ${escaparHTML(
                                    status
                                )}
                            </span>
                        `
                        : ""
                    }

                </div>


                <div class="acoes-lista">

                    ${
                        bloqueado
                        ? `
                            <button
                                type="button"
                                disabled
                            >
                                🔒 Já processado
                            </button>
                        `
                        : `
                            <button
                                type="button"
                                class="btn-excluir btn-remover-medicamento"
                                data-indice="${indice}"
                            >
                                🗑️ Remover
                            </button>
                        `
                    }

                </div>

            `;


            lista.appendChild(
                li
            );

        }
    );


    lista
        .querySelectorAll(
            ".btn-remover-medicamento"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    () => {

                        const indice =
                            Number(
                                botao.dataset.indice
                            );


                        medicamentosDispensacao.splice(
                            indice,
                            1
                        );


                        renderMedicamentosDispensacao();

                    }
                );

            }
        );

}


/*************************************************
          ADICIONAR MEDICAMENTO
*************************************************/

function adicionarMedicamentoDispensacao() {

    const medicamento =
        obterValor(
            "dispensacaoMedicamento"
        );


    const quantidade =
        Number(
            document
                .getElementById(
                    "dispensacaoQuantidade"
                )
                ?.value
            || 0
        );


    const unidade =
        obterValor(
            "dispensacaoUnidade"
        );


    const posologia =
        obterValor(
            "dispensacaoPosologia"
        );


    const observacao =
        obterValor(
            "dispensacaoObservacao"
        );


    if (!medicamento) {

        mensagem(
            "Informe o medicamento para dispensação."
        );

        return;

    }


    if (
        !Number.isFinite(
            quantidade
        )
        ||
        quantidade <= 0
    ) {

        mensagem(
            "Informe uma quantidade válida para dispensação."
        );

        return;

    }


    medicamentosDispensacao.push({

        id: null,

        medicamento,

        quantidade,

        unidade,

        posologia,

        observacao,

        status:
            "pendente"

    });


    limparCamposDispensacao();


    renderMedicamentosDispensacao();


    mensagem(
        "Medicamento adicionado à dispensação."
    );

}


/*************************************************
        SALVAR PRESCRIÇÕES DA FARMÁCIA
*************************************************/

async function salvarPrescricoesFarmacia(
    consultaId,
    {
        pacienteId,
        paciente,
        profissionalId,
        profissional,
        data
    }
) {

    if (
        medicamentosDispensacao.length === 0
    ) {

        return;

    }


    for (
        const item
        of medicamentosDispensacao
    ) {

        await addDoc(

            collection(
                db,
                "prescricoesFarmacia"
            ),

            {

                consultaId,

                pacienteId,

                pacienteNome:
                    paciente,

                profissionalId,

                profissionalNome:
                    profissional,

                medicamento:
                    item.medicamento,

                quantidadePrescrita:
                    Number(
                        item.quantidade || 0
                    ),

                unidade:
                    item.unidade || "",

                posologia:
                    item.posologia || "",

                observacao:
                    item.observacao || "",

                status:
                    "pendente",

                dataConsulta:
                    data || "",

                criadoEm:
                    serverTimestamp(),

                dispensadoEm:
                    null,

                dispensadoPor:
                    ""

            }

        );

    }

}


/*************************************************
        CARREGAR DISPENSAÇÃO DA CONSULTA
*************************************************/

async function carregarDispensacaoConsulta(
    consultaId
) {

    medicamentosDispensacao = [];


    try {

        const consultaPrescricoes =
            query(

                collection(
                    db,
                    "prescricoesFarmacia"
                ),

                where(
                    "consultaId",
                    "==",
                    consultaId
                )

            );


        const snap =
            await getDocs(
                consultaPrescricoes
            );


        snap.forEach(
            (documento) => {

                const dados =
                    documento.data();


                medicamentosDispensacao.push({

                    id:
                        documento.id,

                    medicamento:
                        dados.medicamento || "",

                    quantidade:
                        Number(
                            dados.quantidadePrescrita
                            || 0
                        ),

                    unidade:
                        dados.unidade || "",

                    posologia:
                        dados.posologia || "",

                    observacao:
                        dados.observacao || "",

                    status:
                        dados.status || "pendente"

                });

            }
        );


        renderMedicamentosDispensacao();

    }

    catch (erro) {

        console.error(
            "Erro ao carregar prescrições da farmácia:",
            erro
        );


        mensagem(
            "Não foi possível carregar os medicamentos vinculados à farmácia."
        );

    }

}
/*************************************************
        SINCRONIZAR PRESCRIÇÕES NA EDIÇÃO
*************************************************/

async function sincronizarPrescricoesFarmacia(
    consultaId,
    dados
) {

    const consultaPrescricoes =
        query(

            collection(
                db,
                "prescricoesFarmacia"
            ),

            where(
                "consultaId",
                "==",
                consultaId
            )

        );


    const snap =
        await getDocs(
            consultaPrescricoes
        );


    const existentes =
        new Map();


    for (
        const documento
        of snap.docs
    ) {

        existentes.set(
            documento.id,
            documento.data()
        );


        if (
            (documento.data().status || "pendente")
            ===
            "pendente"
        ) {

            await deleteDoc(

                doc(
                    db,
                    "prescricoesFarmacia",
                    documento.id
                )

            );

        }

    }


    for (
        const item
        of medicamentosDispensacao
    ) {

        const existente =
            item.id
                ? existentes.get(
                    item.id
                )
                : null;


        if (
            existente
            &&
            (existente.status || "pendente")
            !==
            "pendente"
        ) {

            continue;

        }


        await addDoc(

            collection(
                db,
                "prescricoesFarmacia"
            ),

            {

                consultaId,

                pacienteId:
                    dados.pacienteId,

                pacienteNome:
                    dados.paciente,

                profissionalId:
                    dados.profissionalId,

                profissionalNome:
                    dados.profissional,

                medicamento:
                    item.medicamento,

                quantidadePrescrita:
                    Number(
                        item.quantidade || 0
                    ),

                unidade:
                    item.unidade || "",

                posologia:
                    item.posologia || "",

                observacao:
                    item.observacao || "",

                status:
                    "pendente",

                dataConsulta:
                    dados.data || "",

                criadoEm:
                    serverTimestamp(),

                dispensadoEm:
                    null,

                dispensadoPor:
                    ""

            }

        );

    }

}


/*************************************************
    TRATAR PRESCRIÇÕES AO EXCLUIR CONSULTA
*************************************************/

async function tratarPrescricoesAoExcluirConsulta(
    consultaId
) {

    const consultaPrescricoes =
        query(

            collection(
                db,
                "prescricoesFarmacia"
            ),

            where(
                "consultaId",
                "==",
                consultaId
            )

        );


    const snap =
        await getDocs(
            consultaPrescricoes
        );


    for (
        const documento
        of snap.docs
    ) {

        const dados =
            documento.data();


        if (
            (dados.status || "pendente")
            ===
            "pendente"
        ) {

            await deleteDoc(

                doc(
                    db,
                    "prescricoesFarmacia",
                    documento.id
                )

            );

        }

        else {

            await updateDoc(

                doc(
                    db,
                    "prescricoesFarmacia",
                    documento.id
                ),

                {

                    consultaExcluida:
                        true,

                    atualizadoEm:
                        serverTimestamp()

                }

            );

        }

    }

}


/*************************************************
        CONFIGURAR BOTÃO DE DISPENSAÇÃO
*************************************************/

function configurarDispensacao() {

    const botao =
        document.getElementById(
            "btnAdicionarMedicamento"
        );


    if (
        botao
        &&
        botao.dataset.configurado !== "true"
    ) {

        botao.addEventListener(
            "click",
            adicionarMedicamentoDispensacao
        );


        botao.dataset.configurado =
            "true";

    }


    renderMedicamentosDispensacao();

}


configurarDispensacao();


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
        obterValor(
            "consultaQueixa"
        );


    const pa =
        obterValor(
            "consultaPA"
        );


    const fc =
        obterValor(
            "consultaFC"
        );


    const temperatura =
        obterValor(
            "consultaTemperatura"
        );


    const diagnostico =
        obterValor(
            "consultaDiagnostico"
        );


    const exameFisico =
        obterValor(
            "consultaExameFisico"
        );


    const prescricao =
        obterValor(
            "consultaPrescricao"
        );


    const observacoes =
        obterValor(
            "consultaObservacoes"
        );


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
        !pacienteId
        ||
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

            const consultaAtual =
                consultas.find(
                    (c) =>
                        c.id === consultaEmEdicao
                );


            const dadosAtualizados = {

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

                data:
                    consultaAtual?.data
                    || dataAtual()

            };


            await atualizarConsulta(
                dadosAtualizados
            );


            await sincronizarPrescricoesFarmacia(
                consultaEmEdicao,
                dadosAtualizados
            );


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
                CAPTURAR TRIAGEM UTILIZADA
            *************************************************/

            let triagem =
                ultimaTriagemPaciente(
                    pacienteId
                );


            if (!triagem) {

                triagem =
                    ultimaTriagemPaciente(
                        paciente
                    );

            }
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


        /*************************************************
              EVENTO SELECIONAR PACIENTE
        *************************************************/

        if (
            pacienteSelect.dataset
                .triagemConfigurada
            !== "true"
        ) {

            pacienteSelect
                .addEventListener(

                    "change",

                    () => {

                        mostrarTriagemPaciente(
                            true
                        );

                    }

                );


            pacienteSelect.dataset
                .triagemConfigurada =
                "true";

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

        "consultaValor",

        "dispensacaoMedicamento",

        "dispensacaoQuantidade",

        "dispensacaoUnidade",

        "dispensacaoPosologia",

        "dispensacaoObservacao"

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


    limparPainelTriagem();


    medicamentosDispensacao = [];


    renderMedicamentosDispensacao();


    consultaEmEdicao =
        null;


    atualizarBotaoConsulta(
        false
    );

}


/*************************************************
                OBTER VALOR
*************************************************/

function obterValor(
    id
) {

    return document
        .getElementById(
            id
        )
        ?.value
        ?.trim()
        || "";

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
              EXPORTAÇÃO GLOBAL
*************************************************/

window.mostrarTriagemPaciente =
    mostrarTriagemPaciente;


/*************************************************
                    LOG
*************************************************/

console.log(
    "✅ consultas.js V4.8 + Triagem + Dispensação SISFAR carregado"
);
