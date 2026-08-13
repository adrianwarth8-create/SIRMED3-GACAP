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


    /*
        Colocamos o painel antes
        do formulário da consulta.
    */

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


    /*************************************************
                SEM PACIENTE
    *************************************************/

    if (!pacienteId) {

        limparPainelTriagem();

        return;

    }


    /*************************************************
            BUSCAR ÚLTIMA TRIAGEM
    *************************************************/

    let triagem =
        ultimaTriagemPaciente(
            pacienteId
        );


    /*
        Compatibilidade com triagens antigas
        que possam ter sido salvas somente
        com o nome do paciente.
    */

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


    /*************************************************
                SEM TRIAGEM
    *************************************************/

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


    /*************************************************
                EXIBIR TRIAGEM
    *************************************************/

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


    /*************************************************
        PREENCHER CAMPOS DA CONSULTA
    *************************************************/

    if (
        preencherCampos
    ) {

        /*
            PA
        */

        definirValor(
            "consultaPA",
            triagem.pa || ""
        );


        /*
            FC
        */

        definirValor(
            "consultaFC",
            triagem.fc ?? ""
        );


        /*
            TEMPERATURA
        */

        definirValor(
            "consultaTemperatura",
            triagem.temperatura ?? ""
        );


        /*
            QUEIXA

            Só preenche caso o médico
            ainda não tenha digitado algo.
        */

        const campoQueixa =
            document.getElementById(
                "consultaQueixa"
            );


        if (
            campoQueixa
            &&
            !campoQueixa.value.trim()
        ) {

            campoQueixa.value =
                triagem.queixa || "";

        }

    }


    console.log(
        "🩹 Triagem carregada para consulta:",
        triagem
    );

}


/*************************************************
          FORMATAR DATA DA TRIAGEM
*************************************************/

function formatarDataTriagem(
    data
) {

    if (!data) {

        return "-";

    }


    const texto =
        String(
            data
        );


    const partes =
        texto.split(
            "-"
        );


    if (
        partes.length === 3
    ) {

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


    return texto;

}


/*************************************************
        DISPENSAÇÃO - FUNÇÕES AUXILIARES
*************************************************/

function obterMedicamentoDispensacaoFormulario() {

    return {

        medicamento:
            obterValor(
                "dispensacaoMedicamento"
            ),

        quantidade:
            Number(
                document
                    .getElementById(
                        "dispensacaoQuantidade"
                    )
                    ?.value
                || 0
            ),

        unidade:
            obterValor(
                "dispensacaoUnidade"
            ),

        posologia:
            obterValor(
                "dispensacaoPosologia"
            ),

        observacao:
            obterValor(
                "dispensacaoObservacao"
            )

    };

}


/*************************************************
        ADICIONAR MEDICAMENTO À LISTA
*************************************************/

function adicionarMedicamentoDispensacao() {

    const item =
        obterMedicamentoDispensacaoFormulario();


    if (
        !item.medicamento
        ||
        item.quantidade <= 0
    ) {

        mensagem(
            "Informe o medicamento e uma quantidade válida para dispensação."
        );

        return;

    }


    medicamentosDispensacao.push({

        ...item,

        status:
            "pendente"

    });


    limparCamposDispensacao();

    renderMedicamentosDispensacao();

}


/*************************************************
        LIMPAR CAMPOS DE DISPENSAÇÃO
*************************************************/

function limparCamposDispensacao() {

    limparCampos([

        "dispensacaoMedicamento",

        "dispensacaoQuantidade",

        "dispensacaoUnidade",

        "dispensacaoPosologia",

        "dispensacaoObservacao"

    ]);

}


/*************************************************
        RENDER MEDICAMENTOS DA DISPENSAÇÃO
*************************************************/

function renderMedicamentosDispensacao() {

    const lista =
        document.getElementById(
            "listaMedicamentosDispensacao"
        );


    if (!lista) {

        return;

    }


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


    lista.innerHTML =
        medicamentosDispensacao
            .map(
                (item, indice) => {

                    const status =
                        item.status || "pendente";


                    const bloqueado =
                        status !== "pendente";


                    const statusTexto =
                        status === "dispensada"

                            ? "✅ Dispensada"

                            : status === "parcial"

                                ? "🟡 Parcialmente dispensada"

                                : "⏳ Pendente";


                    return `

                        <li class="item-registro">

                            <strong>
                                💊 ${escaparHTML(
                                    item.medicamento || "-"
                                )}
                            </strong>

                            <span>
                                <b>Quantidade:</b>
                                ${escaparHTML(
                                    item.quantidade ?? "-"
                                )}
                                ${escaparHTML(
                                    item.unidade || ""
                                )}
                            </span>

                            <span>
                                <b>Posologia:</b>
                                ${escaparHTML(
                                    item.posologia || "-"
                                )}
                            </span>

                            <span>
                                <b>Observação:</b>
                                ${escaparHTML(
                                    item.observacao || "-"
                                )}
                            </span>

                            <span>
                                <b>Status:</b>
                                ${statusTexto}
                            </span>


                            ${
                                bloqueado

                                    ? ""

                                    : `

                                        <div class="acoes-registro">

                                            <button
                                                type="button"
                                                class="btn-excluir"
                                                data-remover-dispensacao="${indice}"
                                            >
                                                🗑️ Remover
                                            </button>

                                        </div>

                                      `
                            }

                        </li>

                    `;

                }
            )
            .join("");


    lista
        .querySelectorAll(
            "[data-remover-dispensacao]"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    () => {

                        const indice =
                            Number(
                                botao.dataset
                                    .removerDispensacao
                            );


                        removerMedicamentoDispensacao(
                            indice
                        );

                    }
                );

            }
        );

}


/*************************************************
        REMOVER MEDICAMENTO DA LISTA
*************************************************/

function removerMedicamentoDispensacao(
    indice
) {

    const item =
        medicamentosDispensacao[
            indice
        ];


    if (!item) {

        return;

    }


    if (
        item.status
        &&
        item.status !== "pendente"
    ) {

        mensagem(
            "Este medicamento já foi processado pela farmácia e não pode ser removido."
        );

        return;

    }


    medicamentosDispensacao.splice(
        indice,
        1
    );


    renderMedicamentosDispensacao();

}


/*************************************************
        CONFIGURAR ÁREA DE DISPENSAÇÃO
*************************************************/

function configurarDispensacaoConsulta() {

    const botao =
        document.getElementById(
            "btnAdicionarMedicamento"
        );


    if (
        botao
        &&
        botao.dataset.configurado
            !== "true"
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
/*************************************************
        SALVAR PRESCRIÇÕES NA FARMÁCIA
*************************************************/

async function salvarPrescricoesFarmacia(
    consultaId,
    dadosConsulta
) {

    if (
        !consultaId
        ||
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

                pacienteId:
                    dadosConsulta.pacienteId || "",

                pacienteNome:
                    dadosConsulta.paciente || "",

                profissionalId:
                    dadosConsulta.profissionalId || "",

                profissionalNome:
                    dadosConsulta.profissional || "",

                medicamento:
                    item.medicamento || "",

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

                produtoSisfarId:
                    "",

                produtoSisfarNome:
                    "",

                loteSisfarId:
                    "",

                loteSisfar:
                    "",

                quantidadeDispensada:
                    0,

                dataConsulta:
                    dadosConsulta.data || "",

                criadoEm:
                    serverTimestamp(),

                atualizadoEm:
                    serverTimestamp(),

                dispensadoEm:
                    null,

                dispensadoPorUid:
                    "",

                dispensadoPorNome:
                    ""

            }

        );

    }

}


/*************************************************
        CARREGAR PRESCRIÇÕES DA CONSULTA
*************************************************/

async function carregarPrescricoesFarmacia(
    consultaId
) {

    medicamentosDispensacao = [];


    if (
        !consultaId
    ) {

        renderMedicamentosDispensacao();

        return;

    }


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
    dadosConsulta
) {

    if (
        !consultaId
    ) {

        return;

    }


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


    const documentosExistentes =
        snap.docs.map(
            (documento) => ({

                id:
                    documento.id,

                ...documento.data()

            })
        );


    /*************************************************
        APAGAR SOMENTE ITENS AINDA PENDENTES
    *************************************************/

    for (
        const itemExistente
        of documentosExistentes
    ) {

        const status =
            String(
                itemExistente.status
                || "pendente"
            )
            .toLowerCase();


        if (
            status === "pendente"
        ) {

            await deleteDoc(

                doc(
                    db,
                    "prescricoesFarmacia",
                    itemExistente.id
                )

            );

        }

    }


    /*************************************************
        RECRIAR SOMENTE ITENS PENDENTES ATUAIS
    *************************************************/

    for (
        const item
        of medicamentosDispensacao
    ) {

        const status =
            String(
                item.status || "pendente"
            )
            .toLowerCase();


        /*
            Itens já dispensados ou parcialmente
            dispensados permanecem no banco e
            não são recriados.
        */

        if (
            status !== "pendente"
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
                    dadosConsulta.pacienteId || "",

                pacienteNome:
                    dadosConsulta.paciente || "",

                profissionalId:
                    dadosConsulta.profissionalId || "",

                profissionalNome:
                    dadosConsulta.profissional || "",

                medicamento:
                    item.medicamento || "",

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

                produtoSisfarId:
                    "",

                produtoSisfarNome:
                    "",

                loteSisfarId:
                    "",

                loteSisfar:
                    "",

                quantidadeDispensada:
                    0,

                dataConsulta:
                    dadosConsulta.data || "",

                criadoEm:
                    serverTimestamp(),

                atualizadoEm:
                    serverTimestamp(),

                dispensadoEm:
                    null,

                dispensadoPorUid:
                    "",

                dispensadoPorNome:
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

    if (
        !consultaId
    ) {

        return;

    }


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


        const status =
            String(
                dados.status
                || "pendente"
            )
            .toLowerCase();


        /*
            Se a farmácia ainda não processou,
            podemos remover a solicitação.
        */

        if (
            status === "pendente"
        ) {

            await deleteDoc(

                doc(
                    db,
                    "prescricoesFarmacia",
                    documento.id
                )

            );

        }


        /*
            Se já foi dispensado, preservamos
            o histórico da farmácia.
        */

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

                    consultaExcluidaEm:
                        serverTimestamp(),

                    atualizadoEm:
                        serverTimestamp()

                }

            );

        }

    }

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


    const exameFisico =
        obterValor(
            "consultaExameFisico"
        );


    const diagnostico =
        obterValor(
            "consultaDiagnostico"
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
    ) {

        mensagem(
            "Selecione o paciente."
        );

        return;

    }


    if (
        !profissionalId
    ) {

        mensagem(
            "Selecione o profissional."
        );

        return;

    }


    if (
        !paciente
        ||
        paciente ===
            "Selecione o paciente"
    ) {

        mensagem(
            "Paciente inválido."
        );

        return;

    }


    if (
        !profissional
        ||
        profissional ===
            "Selecione o profissional"
    ) {

        mensagem(
            "Profissional inválido."
        );

        return;

    }


    try {

        /*************************************************
                CONSULTA EM EDIÇÃO
        *************************************************/

        if (
            consultaEmEdicao
        ) {

            const consultaAtual =
                consultas.find(
                    (consulta) =>
                        consulta.id
                        ===
                        consultaEmEdicao
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

                exameFisico,

                diagnostico,

                prescricao,

                observacoes,

                valor,

                data:
                    consultaAtual?.data
                    || dataAtual(),

                atualizadoEm:
                    serverTimestamp()

            };


            await updateDoc(

                doc(
                    db,
                    "consultas",
                    consultaEmEdicao
                ),

                dadosAtualizados

            );


            /*************************************************
                ATUALIZAR PRONTUÁRIO VINCULADO
            *************************************************/

            const prontuariosQuery =
                query(

                    collection(
                        db,
                        "prontuarios"
                    ),

                    where(
                        "consultaId",
                        "==",
                        consultaEmEdicao
                    )

                );


            const prontuariosSnap =
                await getDocs(
                    prontuariosQuery
                );


            for (
                const prontuarioDoc
                of prontuariosSnap.docs
            ) {

                await updateDoc(

                    doc(
                        db,
                        "prontuarios",
                        prontuarioDoc.id
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

                        exameFisico,

                        diagnostico,

                        prescricao,

                        observacoes,

                        atualizadoEm:
                            serverTimestamp()

                    }

                );

            }


            /*************************************************
                ATUALIZAR FINANCEIRO VINCULADO
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
                        consultaEmEdicao
                    )

                );


            const financeiroSnap =
                await getDocs(
                    financeiroQuery
                );


            if (
                financeiroSnap.empty
                &&
                valor > 0
            ) {

                await addDoc(

                    collection(
                        db,
                        "gastos"
                    ),

                    {

                        consultaId:
                            consultaEmEdicao,

                        pacienteId,

                        paciente,

                        profissionalId,

                        profissional,

                        descricao:
                            "Consulta médica",

                        valor,

                        tipo:
                            "consulta",

                        data:
                            dadosAtualizados.data,

                        criadoEm:
                            serverTimestamp()

                    }

                );

            }


            else {

                for (
                    const gastoDoc
                    of financeiroSnap.docs
                ) {

                    await updateDoc(

                        doc(
                            db,
                            "gastos",
                            gastoDoc.id
                        ),

                        {

                            pacienteId,

                            paciente,

                            profissionalId,

                            profissional,

                            valor,

                            atualizadoEm:
                                serverTimestamp()

                        }

                    );

                }

            }


            /*************************************************
                SINCRONIZAR FARMÁCIA
            *************************************************/

            await sincronizarPrescricoesFarmacia(

                consultaEmEdicao,

                dadosAtualizados

            );


            mensagem(
                "Consulta atualizada com sucesso."
            );


            consultaEmEdicao =
                null;


            limparFormularioConsulta();


            await carregarConsultas();


            return;

        }


        /*************************************************
                    NOVA CONSULTA
        *************************************************/

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


        const dadosConsulta = {

            pacienteId,

            paciente,

            profissionalId,

            profissional,

            queixa,

            pa,

            fc,

            temperatura,

            exameFisico,

            diagnostico,

            prescricao,

            observacoes,

            valor,

            data,

            triagemId:
                triagem?.id || "",

            triagemData:
                triagem?.data || "",

            triagemHora:
                triagem?.hora || "",

            criadoEm:
                serverTimestamp(),

            atualizadoEm:
                serverTimestamp()

        };


        /*************************************************
                CRIAR CONSULTA
        *************************************************/

        const consultaRef =
            await addDoc(

                collection(
                    db,
                    "consultas"
                ),

                dadosConsulta

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

                paciente,

                profissionalId,

                profissional,

                queixa,

                pa,

                fc,

                temperatura,

                exameFisico,

                diagnostico,

                prescricao,

                observacoes,

                data,

                triagemId:
                    triagem?.id || "",

                criadoEm:
                    serverTimestamp(),

                atualizadoEm:
                    serverTimestamp()

            }

        );


        /*************************************************
                CRIAR FINANCEIRO
        *************************************************/

        if (
            valor > 0
        ) {

            await addDoc(

                collection(
                    db,
                    "gastos"
                ),

                {

                    consultaId,

                    pacienteId,

                    paciente,

                    profissionalId,

                    profissional,

                    descricao:
                        "Consulta médica",

                    valor,

                    tipo:
                        "consulta",

                    data,

                    criadoEm:
                        serverTimestamp(),

                    atualizadoEm:
                        serverTimestamp()

                }

            );

        }


        /*************************************************
            ENCAMINHAR MEDICAMENTOS À FARMÁCIA
        *************************************************/

        await salvarPrescricoesFarmacia(

            consultaId,

            dadosConsulta

        );


        /*************************************************
                    FINALIZAR
        *************************************************/

        mensagem(

            medicamentosDispensacao.length > 0

                ? "Consulta registrada e medicamentos encaminhados para a farmácia."

                : "Consulta registrada com sucesso."

        );


        limparFormularioConsulta();


        await carregarConsultas();

    }


    catch (erro) {

        console.error(
            "Erro ao registrar consulta:",
            erro
        );


        mensagem(
            "Erro ao registrar consulta."
        );

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

        "consultaExameFisico",

        "consultaDiagnostico",

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


    if (
        paciente
    ) {

        paciente.value =
            "";

    }


    if (
        profissional
    ) {

        profissional.value =
            "";

    }


    medicamentosDispensacao =
        [];


    renderMedicamentosDispensacao();


    limparPainelTriagem();


    consultaEmEdicao =
        null;


    atualizarBotaoConsulta(
        false
    );

}
/*************************************************
              LISTAR CONSULTAS
*************************************************/

export function listarConsultas() {

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
                Nenhuma consulta registrada.
            </li>

        `;

        return;

    }


    lista.innerHTML =
        consultas
            .map(
                (consulta) => {

                    return `

                        <li class="item-registro">

                            <strong>
                                🩺 ${escaparHTML(
                                    consulta.paciente
                                    || "-"
                                )}
                            </strong>


                            <span>

                                <b>Profissional:</b>

                                ${escaparHTML(
                                    consulta.profissional
                                    || "-"
                                )}

                            </span>


                            <span>

                                <b>Data:</b>

                                ${escaparHTML(
                                    formatarData(
                                        consulta.data
                                    )
                                )}

                            </span>


                            <span>

                                <b>Queixa:</b>

                                ${escaparHTML(
                                    consulta.queixa
                                    || "-"
                                )}

                            </span>


                            <span>

                                <b>Diagnóstico:</b>

                                ${escaparHTML(
                                    consulta.diagnostico
                                    || "-"
                                )}

                            </span>


                            <span>

                                <b>Prescrição:</b>

                                ${escaparHTML(
                                    consulta.prescricao
                                    || "-"
                                )}

                            </span>


                            <span>

                                <b>Valor:</b>

                                ${escaparHTML(
                                    formatarMoeda(
                                        consulta.valor
                                        || 0
                                    )
                                )}

                            </span>


                            <div class="acoes-registro">

                                <button
                                    type="button"
                                    class="btn-editar"
                                    data-editar-consulta="${consulta.id}"
                                >
                                    ✏️ Editar
                                </button>


                                <button
                                    type="button"
                                    class="btn-excluir"
                                    data-excluir-consulta="${consulta.id}"
                                >
                                    🗑️ Excluir
                                </button>

                            </div>

                        </li>

                    `;

                }
            )
            .join("");


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
                  EDITAR CONSULTA
*************************************************/

export async function editarConsulta(
    id
) {

    const consulta =
        consultas.find(
            (item) =>
                item.id === id
        );


    if (
        !consulta
    ) {

        mensagem(
            "Consulta não encontrada."
        );

        return;

    }


    consultaEmEdicao =
        consulta.id;


    /*************************************************
              PREENCHER PACIENTE
    *************************************************/

    const pacienteSelect =
        document.getElementById(
            "consultaPaciente"
        );


    if (
        pacienteSelect
    ) {

        pacienteSelect.value =
            consulta.pacienteId || "";

    }


    /*************************************************
            PREENCHER PROFISSIONAL
    *************************************************/

    const profissionalSelect =
        document.getElementById(
            "consultaProfissional"
        );


    if (
        profissionalSelect
    ) {

        profissionalSelect.value =
            consulta.profissionalId || "";

    }


    /*************************************************
                PREENCHER CAMPOS
    *************************************************/

    definirValor(
        "consultaQueixa",
        consulta.queixa || ""
    );


    definirValor(
        "consultaPA",
        consulta.pa || ""
    );


    definirValor(
        "consultaFC",
        consulta.fc || ""
    );


    definirValor(
        "consultaTemperatura",
        consulta.temperatura || ""
    );


    definirValor(
        "consultaExameFisico",
        consulta.exameFisico || ""
    );


    definirValor(
        "consultaDiagnostico",
        consulta.diagnostico || ""
    );


    definirValor(
        "consultaPrescricao",
        consulta.prescricao || ""
    );


    definirValor(
        "consultaObservacoes",
        consulta.observacoes || ""
    );


    definirValor(
        "consultaValor",
        consulta.valor || ""
    );


    /*************************************************
          CARREGAR MEDICAMENTOS DA FARMÁCIA
    *************************************************/

    await carregarPrescricoesFarmacia(
        consulta.id
    );


    /*************************************************
              MOSTRAR TRIAGEM
    *************************************************/

    mostrarTriagemPaciente(
        false
    );


    /*************************************************
            ALTERAR TEXTO DO BOTÃO
    *************************************************/

    atualizarBotaoConsulta(
        true
    );


    /*************************************************
              IR PARA CONSULTA
    *************************************************/

    const secao =
        document.getElementById(
            "secaoConsultas"
        );


    if (
        secao
    ) {

        secao.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }


    mensagem(
        "Consulta carregada para edição."
    );

}


/*************************************************
                EXCLUIR CONSULTA
*************************************************/

export async function excluirConsulta(
    id
) {

    const consulta =
        consultas.find(
            (item) =>
                item.id === id
        );


    if (
        !consulta
    ) {

        mensagem(
            "Consulta não encontrada."
        );

        return;

    }


    const resposta =
        await confirmar(
            `Deseja excluir a consulta de ${consulta.paciente || "este paciente"}?`
        );


    if (
        !resposta
    ) {

        return;

    }


    try {

        /*************************************************
            TRATAR PRESCRIÇÕES DA FARMÁCIA
        *************************************************/

        await tratarPrescricoesAoExcluirConsulta(
            id
        );


        /*************************************************
                EXCLUIR PRONTUÁRIOS
        *************************************************/

        const prontuariosQuery =
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


        const prontuariosSnap =
            await getDocs(
                prontuariosQuery
            );


        for (
            const prontuarioDoc
            of prontuariosSnap.docs
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
                EXCLUIR FINANCEIRO
        *************************************************/

        const gastosQuery =
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


        const gastosSnap =
            await getDocs(
                gastosQuery
            );


        for (
            const gastoDoc
            of gastosSnap.docs
        ) {

            await deleteDoc(

                doc(
                    db,
                    "gastos",
                    gastoDoc.id
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


        /*************************************************
                    ATUALIZAR TELA
        *************************************************/

        if (
            consultaEmEdicao === id
        ) {

            limparFormularioConsulta();

        }


        await carregarConsultas();


        mensagem(
            "Consulta excluída com sucesso."
        );

    }


    catch (erro) {

        console.error(
            "Erro ao excluir consulta:",
            erro
        );


        mensagem(
            "Erro ao excluir consulta."
        );

    }

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
            (item) => {

                item.style.display =

                    item.textContent
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
                Selecione o paciente
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
                        paciente.nome || "Paciente";


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

    if (
        profissionalSelect
    ) {

        const valorAtual =
            profissionalSelect.value;


        profissionalSelect.innerHTML = `

            <option value="">
                Selecione o profissional
            </option>

        `;


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
                        profissional.nome || "Profissional";


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
                (option) =>
                    option.value === valorAtual
            )
        ) {

            profissionalSelect.value =
                valorAtual;

        }

    }


    /*************************************************
            CONFIGURAR EVENTO TRIAGEM
    *************************************************/

    configurarPacienteConsulta();

}


/*************************************************
        CONFIGURAR PACIENTE DA CONSULTA
*************************************************/

function configurarPacienteConsulta() {

    const pacienteSelect =
        document.getElementById(
            "consultaPaciente"
        );


    if (
        !pacienteSelect
        ||
        pacienteSelect.dataset
            .triagemConfigurada
            === "true"
    ) {

        return;

    }


    pacienteSelect.addEventListener(

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
            DEFINIR VALOR DE CAMPO
*************************************************/

function definirValor(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (
        elemento
    ) {

        elemento.value =
            valor ?? "";

    }

}


/*************************************************
          ATUALIZAR BOTÃO CONSULTA
*************************************************/

function atualizarBotaoConsulta(
    editando
) {

    const botao =
        document.getElementById(
            "btnRegistrarConsulta"
        );


    if (
        !botao
    ) {

        return;

    }


    botao.textContent =

        editando

            ? "💾 Salvar alterações"

            : "Registrar consulta";

}
/*************************************************
        INICIALIZAR ÁREA DE DISPENSAÇÃO
*************************************************/

configurarDispensacaoConsulta();


/*************************************************
        EXPOR TRIAGEM GLOBALMENTE
*************************************************/

window.mostrarTriagemPaciente =
    mostrarTriagemPaciente;


/*************************************************
                    LOG
*************************************************/

console.log(
    "✅ consultas.js V4.8 + Triagem + Dispensação SISFAR carregado"
);
