/*************************************************
        TRIAGEM.JS - SIRMED V4.7
        EDITAR + EXCLUIR
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

let triagemEmEdicao = null;


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


    const lista =
        obterPacientes();


    if (
        !Array.isArray(
            lista
        )
    ) {

        console.warn(
            "⚠️ Lista de pacientes inválida."
        );

        return;

    }


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


                option.value =
                    paciente.nome || "";


                option.textContent =
                    paciente.nome ||
                    "Paciente";


                option.dataset.id =
                    paciente.id || "";


                select.appendChild(
                    option
                );

            }
        );


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
            MONTAR REGISTRO
*************************************************/

function montarRegistroTriagem() {

    const paciente =
        obterPacienteSelecionado();


    if (!paciente.nome) {

        alert(
            "Selecione o paciente."
        );

        return null;

    }


    /*************************************************
                    DATA E HORA
    *************************************************/

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


    calcularIMC();


    return {

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
            )

    };

}


/*************************************************
            REGISTRAR / SALVAR TRIAGEM
*************************************************/

export async function registrarTriagem() {

    const registro =
        montarRegistroTriagem();


    if (!registro) {

        return;

    }


    try {

        /*************************************************
                    EDITANDO TRIAGEM
        *************************************************/

        if (
            triagemEmEdicao
        ) {

            await updateDoc(

                doc(
                    db,
                    "triagens",
                    triagemEmEdicao
                ),

                {

                    ...registro,

                    atualizadoEm:
                        serverTimestamp()

                }

            );


            alert(
                "Triagem atualizada com sucesso."
            );


            console.log(
                "✅ Triagem atualizada:",
                triagemEmEdicao
            );

        }


        /*************************************************
                    NOVA TRIAGEM
        *************************************************/

        else {

            await addDoc(

                collection(
                    db,
                    "triagens"
                ),

                {

                    ...registro,

                    criadoEm:
                        serverTimestamp()

                }

            );


            alert(
                "Triagem registrada com sucesso."
            );


            console.log(
                "✅ Nova triagem registrada."
            );

        }


        /*************************************************
                    FINALIZAR
        *************************************************/

        triagemEmEdicao =
            null;


        limparFormularioTriagem();


        atualizarBotaoTriagem(
            false
        );


        removerBotaoCancelarEdicao();


        await carregarTriagens();


        renderTriagens();


        preencherPacientesTriagem();


        /*************************************************
            AVISAR O RESTANTE DO SIRMED
        *************************************************/

        document.dispatchEvent(

            new CustomEvent(
                "sirmed:dados-alterados"
            )

        );

    }

    catch (erro) {

        console.error(
            "❌ Erro ao salvar triagem:",
            erro
        );


        alert(
            "Não foi possível salvar a triagem."
        );

    }

}


/*************************************************
                EDITAR TRIAGEM
*************************************************/

export function editarTriagem(
    id
) {

    const triagem =
        triagens.find(
            (item) =>
                item.id === id
        );


    if (!triagem) {

        alert(
            "Triagem não encontrada."
        );

        return;

    }


    triagemEmEdicao =
        id;


    /*************************************************
                PACIENTE
    *************************************************/

    preencherPacientesTriagem();


    selecionarPacienteTriagem(
        triagem
    );


    /*************************************************
                CAMPOS
    *************************************************/

    definirValor(
        "triagemData",
        triagem.data
    );


    definirValor(
        "triagemHora",
        triagem.hora
    );


    definirValor(
        "triagemPA",
        triagem.pa
    );


    definirValor(
        "triagemFC",
        triagem.fc
    );


    definirValor(
        "triagemFR",
        triagem.fr
    );


    definirValor(
        "triagemSaturacao",
        triagem.saturacao
    );


    definirValor(
        "triagemTemperatura",
        triagem.temperatura
    );


    definirValor(
        "triagemGlicemia",
        triagem.glicemia
    );


    definirValor(
        "triagemPeso",
        triagem.peso
    );


    definirValor(
        "triagemAltura",
        triagem.altura
    );


    definirValor(
        "triagemIMC",
        triagem.imc
    );


    definirValor(
        "triagemDor",
        triagem.dor
    );


    definirValor(
        "triagemQueixa",
        triagem.queixa
    );


    definirValor(
        "triagemAlergias",
        triagem.alergias
    );


    definirValor(
        "triagemMedicamentos",
        triagem.medicamentos
    );


    definirValor(
        "triagemObservacoes",
        triagem.observacoes
    );


    /*************************************************
                BOTÃO SALVAR
    *************************************************/

    atualizarBotaoTriagem(
        true
    );


    criarBotaoCancelarEdicao();


    /*************************************************
                SUBIR FORMULÁRIO
    *************************************************/

    document
        .getElementById(
            "secaoTriagem"
        )
        ?.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });


    console.log(
        "✏️ Editando triagem:",
        id
    );

}


/*************************************************
        SELECIONAR PACIENTE NA EDIÇÃO
*************************************************/

function selecionarPacienteTriagem(
    triagem
) {

    const select =
        document.getElementById(
            "triagemPaciente"
        );


    if (!select) {

        return;

    }


    /*************************************************
            TENTAR PELO ID
    *************************************************/

    const peloId =
        Array.from(
            select.options
        )
        .find(
            (option) =>

                String(
                    option.dataset.id || ""
                )
                ===
                String(
                    triagem.pacienteId || ""
                )

        );


    if (peloId) {

        select.value =
            peloId.value;

        return;

    }


    /*************************************************
            FALLBACK PELO NOME
    *************************************************/

    select.value =
        triagem.pacienteNome || "";

}


/*************************************************
            EXCLUIR TRIAGEM
*************************************************/

export async function excluirTriagem(
    id
) {

    const triagem =
        triagens.find(
            (item) =>
                item.id === id
        );


    if (!triagem) {

        alert(
            "Triagem não encontrada."
        );

        return;

    }


    const resposta =
        window.confirm(

            `Deseja realmente excluir a triagem de "${triagem.pacienteNome || "Paciente"}"?`

        );


    if (!resposta) {

        return;

    }


    try {

        await deleteDoc(

            doc(
                db,
                "triagens",
                id
            )

        );


        /*************************************************
            SE ESTAVA EDITANDO ESSA TRIAGEM
        *************************************************/

        if (
            triagemEmEdicao ===
            id
        ) {

            cancelarEdicaoTriagem();

        }


        await carregarTriagens();


        renderTriagens();


        alert(
            "Triagem excluída com sucesso."
        );


        document.dispatchEvent(

            new CustomEvent(
                "sirmed:dados-alterados"
            )

        );


        console.log(
            "🗑️ Triagem excluída:",
            id
        );

    }

    catch (erro) {

        console.error(
            "❌ Erro ao excluir triagem:",
            erro
        );


        alert(
            "Não foi possível excluir a triagem."
        );

    }

}


/*************************************************
            CANCELAR EDIÇÃO
*************************************************/

export function cancelarEdicaoTriagem() {

    triagemEmEdicao =
        null;


    limparFormularioTriagem();


    atualizarBotaoTriagem(
        false
    );


    removerBotaoCancelarEdicao();


    console.log(
        "↩️ Edição da triagem cancelada."
    );

}


/*************************************************
        ALTERAR TEXTO BOTÃO PRINCIPAL
*************************************************/

function atualizarBotaoTriagem(
    editando
) {

    const botao =
        document.getElementById(
            "btnRegistrarTriagem"
        );


    if (!botao) {

        return;

    }


    botao.textContent =

        editando

            ? "💾 Salvar alterações"

            : "🩹 Registrar triagem";

}


/*************************************************
        CRIAR BOTÃO CANCELAR
*************************************************/

function criarBotaoCancelarEdicao() {

    if (
        document.getElementById(
            "btnCancelarEdicaoTriagem"
        )
    ) {

        return;

    }


    const botaoRegistrar =
        document.getElementById(
            "btnRegistrarTriagem"
        );


    if (!botaoRegistrar) {

        return;

    }


    const botao =
        document.createElement(
            "button"
        );


    botao.type =
        "button";


    botao.id =
        "btnCancelarEdicaoTriagem";


    botao.className =
        "btn-excluir";


    botao.textContent =
        "↩️ Cancelar edição";


    botao.style.marginLeft =
        "10px";


    botao.style.marginTop =
        "10px";


    botao.addEventListener(
        "click",
        cancelarEdicaoTriagem
    );


    botaoRegistrar.insertAdjacentElement(
        "afterend",
        botao
    );

}


/*************************************************
        REMOVER BOTÃO CANCELAR
*************************************************/

function removerBotaoCancelarEdicao() {

    document
        .getElementById(
            "btnCancelarEdicaoTriagem"
        )
        ?.remove();

}


/*************************************************
            DEFINIR VALOR
*************************************************/

function definirValor(
    id,
    novoValor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {

        return;

    }


    elemento.value =
        novoValor ??
        "";

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


                📅 ${
                    escaparHTML(
                        formatarData(
                            t.data
                        )
                    )
                }


                &nbsp;


                🕐 ${
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


                <div
                    class="acoes-registro"
                    style="margin-top:18px;"
                >

                    <button
                        type="button"
                        class="btn-editar"
                        data-editar-triagem="${t.id}"
                    >
                        ✏️ Editar
                    </button>


                    <button
                        type="button"
                        class="btn-excluir"
                        data-excluir-triagem="${t.id}"
                    >
                        🗑️ Excluir
                    </button>

                </div>

            `;


            lista.appendChild(
                li
            );

        }
    );


    ligarBotoesTriagem();

}


/*************************************************
            LIGAR BOTÕES TRIAGEM
*************************************************/

function ligarBotoesTriagem() {

    /*************************************************
                    EDITAR
    *************************************************/

    document
        .querySelectorAll(
            "[data-editar-triagem]"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(

                    "click",

                    () => {

                        editarTriagem(

                            botao.dataset
                                .editarTriagem

                        );

                    }

                );

            }
        );


    /*************************************************
                    EXCLUIR
    *************************************************/

    document
        .querySelectorAll(
            "[data-excluir-triagem]"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(

                    "click",

                    () => {

                        excluirTriagem(

                            botao.dataset
                                .excluirTriagem

                        );

                    }

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
                REGISTRAR / SALVAR
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


window.editarTriagem =
    editarTriagem;


window.excluirTriagem =
    excluirTriagem;


window.cancelarEdicaoTriagem =
    cancelarEdicaoTriagem;


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
    "✅ triagem.js V4.7 + Editar + Excluir carregado"
);
