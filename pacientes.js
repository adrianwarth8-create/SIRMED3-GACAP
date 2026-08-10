/*************************************************
              PACIENTES.JS - SIRMED V4.1
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

import {
    mensagem,
    confirmar,
    formatarData,
    formatarCPF,
    formatarTelefone,
    escaparHTML
} from "./utils.js";


/*************************************************
                VARIÁVEIS
*************************************************/

const pacientes = [];

let pacienteEmEdicao = null;


/*************************************************
                OBTER PACIENTES
*************************************************/

export function obterPacientes() {

    return pacientes;

}


/*************************************************
                TOTAL PACIENTES
*************************************************/

export function totalPacientes() {

    return pacientes.length;

}


/*************************************************
                CARREGAR PACIENTES
*************************************************/

export async function carregarPacientes() {

    const snap =
        await getDocs(
            collection(
                db,
                "pacientes"
            )
        );


    pacientes.length = 0;


    snap.forEach(
        (docSnap) => {

            pacientes.push({

                id:
                    docSnap.id,

                ...docSnap.data()

            });

        }
    );


    pacientes.sort(
        (a, b) =>

            String(
                a.nome || ""
            ).localeCompare(

                String(
                    b.nome || ""
                ),

                "pt-BR"

            )
    );

}


/*************************************************
                CADASTRAR / SALVAR
*************************************************/

export async function cadastrarPaciente() {

    const nome =
        document
            .getElementById(
                "pacienteNome"
            )
            ?.value
            .trim()
        || "";


    const cpf =
        document
            .getElementById(
                "pacienteCpf"
            )
            ?.value
            .trim()
        || "";


    const nascimento =
        document
            .getElementById(
                "pacienteNascimento"
            )
            ?.value
        || "";


    const telefone =
        document
            .getElementById(
                "pacienteTelefone"
            )
            ?.value
            .trim()
        || "";


    const sexo =
        document
            .getElementById(
                "pacienteSexo"
            )
            ?.value
        || "";


    const cidade =
        document
            .getElementById(
                "pacienteCidade"
            )
            ?.value
            .trim()
        || "";


    if (!nome) {

        mensagem(
            "Informe o nome do paciente."
        );

        return;

    }


    try {

        /*************************************************
                    EDITAR PACIENTE
        *************************************************/

        if (
            pacienteEmEdicao
        ) {

            await updateDoc(

                doc(
                    db,
                    "pacientes",
                    pacienteEmEdicao
                ),

                {

                    nome,

                    cpf,

                    nascimento,

                    telefone,

                    sexo,

                    cidade,

                    atualizadoEm:
                        serverTimestamp()

                }

            );


            mensagem(
                "Paciente atualizado com sucesso."
            );


            pacienteEmEdicao =
                null;


            atualizarBotaoPaciente(
                false
            );

        }

        /*************************************************
                    NOVO PACIENTE
        *************************************************/

        else {

            await addDoc(

                collection(
                    db,
                    "pacientes"
                ),

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


            mensagem(
                "Paciente cadastrado com sucesso."
            );

        }


        limparFormularioPaciente();


        document.dispatchEvent(

            new CustomEvent(
                "sirmed:dados-alterados"
            )

        );

    } catch (erro) {

        console.error(
            "Erro ao salvar paciente:",
            erro
        );


        mensagem(
            "Não foi possível salvar o paciente."
        );

    }

}


/*************************************************
                EDITAR PACIENTE
*************************************************/

export function editarPaciente(
    id
) {

    const paciente =
        pacientes.find(
            (p) =>
                p.id === id
        );


    if (!paciente) {

        mensagem(
            "Paciente não encontrado."
        );

        return;

    }


    pacienteEmEdicao =
        id;


    document
        .getElementById(
            "pacienteNome"
        )
        .value =
        paciente.nome || "";


    document
        .getElementById(
            "pacienteCpf"
        )
        .value =
        paciente.cpf || "";


    document
        .getElementById(
            "pacienteNascimento"
        )
        .value =
        paciente.nascimento || "";


    document
        .getElementById(
            "pacienteTelefone"
        )
        .value =
        paciente.telefone || "";


    document
        .getElementById(
            "pacienteSexo"
        )
        .value =
        paciente.sexo || "";


    document
        .getElementById(
            "pacienteCidade"
        )
        .value =
        paciente.cidade || "";


    atualizarBotaoPaciente(
        true
    );


    document
        .getElementById(
            "secaoPacientes"
        )
        ?.scrollIntoView({
            behavior: "smooth"
        });


    mensagem(
        "Paciente carregado para edição."
    );

}


/*************************************************
                EXCLUIR PACIENTE
*************************************************/

export async function excluirPaciente(
    id
) {

    const paciente =
        pacientes.find(
            (p) =>
                p.id === id
        );


    if (!paciente) {

        mensagem(
            "Paciente não encontrado."
        );

        return;

    }


    const resposta =
        confirmar(
            `Deseja realmente excluir o paciente "${paciente.nome}"?`
        );


    if (!resposta) {

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


        if (
            pacienteEmEdicao ===
            id
        ) {

            pacienteEmEdicao =
                null;


            limparFormularioPaciente();


            atualizarBotaoPaciente(
                false
            );

        }


        mensagem(
            "Paciente excluído com sucesso."
        );


        document.dispatchEvent(

            new CustomEvent(
                "sirmed:dados-alterados"
            )

        );

    } catch (erro) {

        console.error(
            "Erro ao excluir paciente:",
            erro
        );


        mensagem(
            "Não foi possível excluir o paciente."
        );

    }

}


/*************************************************
                RENDER PACIENTES
*************************************************/

export function renderPacientes() {

    const lista =
        document.getElementById(
            "listaPacientes"
        );


    if (!lista) {

        return;

    }


    if (
        pacientes.length === 0
    ) {

        lista.innerHTML = `

            <li class="lista-vazia">

                Nenhum paciente encontrado.

            </li>

        `;


        return;

    }


    lista.innerHTML =

        pacientes.map(
            (p) => `

                <li class="item-registro">

                    <strong>

                        👤 ${escaparHTML(
                            p.nome
                        )}

                    </strong>


                    <span>

                        <b>CPF:</b>

                        ${
                            escaparHTML(
                                formatarCPF(
                                    p.cpf || ""
                                )
                            )
                            || "-"
                        }

                    </span>


                    <span>

                        <b>Nascimento:</b>

                        ${
                            escaparHTML(
                                formatarData(
                                    p.nascimento
                                )
                            )
                        }

                    </span>


                    <span>

                        <b>Telefone:</b>

                        ${
                            escaparHTML(
                                formatarTelefone(
                                    p.telefone || ""
                                )
                            )
                            || "-"
                        }

                    </span>


                    <span>

                        <b>Sexo:</b>

                        ${
                            escaparHTML(
                                p.sexo || "-"
                            )
                        }

                    </span>


                    <span>

                        <b>Cidade:</b>

                        ${
                            escaparHTML(
                                p.cidade || "-"
                            )
                        }

                    </span>


                    <div class="acoes-registro">

                        <button
                            type="button"
                            class="btn-editar"
                            data-editar-paciente="${p.id}"
                        >
                            ✏️ Editar
                        </button>


                        <button
                            type="button"
                            class="btn-excluir"
                            data-excluir-paciente="${p.id}"
                        >
                            🗑️ Excluir
                        </button>

                    </div>

                </li>

            `
        ).join("");


    ligarBotoesPacientes();

}


/*************************************************
            LIGAR BOTÕES DA LISTA
*************************************************/

function ligarBotoesPacientes() {

    document
        .querySelectorAll(
            "[data-editar-paciente]"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    () => {

                        editarPaciente(
                            botao.dataset
                                .editarPaciente
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-excluir-paciente]"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    () => {

                        excluirPaciente(
                            botao.dataset
                                .excluirPaciente
                        );

                    }
                );

            }
        );

}


/*************************************************
                FILTRAR PACIENTES
*************************************************/

export function filtrarPacientes() {

    const filtro =
        (
            document
                .getElementById(
                    "pesquisaPaciente"
                )
                ?.value
            || ""
        )
        .toLowerCase();


    document
        .querySelectorAll(
            "#listaPacientes li"
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
            LIMPAR FORMULÁRIO
*************************************************/

export function limparFormularioPaciente() {

    const campos = [

        "pacienteNome",

        "pacienteCpf",

        "pacienteNascimento",

        "pacienteTelefone",

        "pacienteSexo",

        "pacienteCidade"

    ];


    campos.forEach(
        (id) => {

            const campo =
                document.getElementById(
                    id
                );


            if (!campo) {

                return;

            }


            if (
                campo.tagName ===
                "SELECT"
            ) {

                campo.selectedIndex =
                    0;

            } else {

                campo.value =
                    "";

            }

        }
    );


    pacienteEmEdicao =
        null;


    atualizarBotaoPaciente(
        false
    );

}


/*************************************************
            ALTERAR TEXTO DO BOTÃO
*************************************************/

function atualizarBotaoPaciente(
    editando
) {

    const botao =
        document.getElementById(
            "btnCadastrarPaciente"
        );


    if (!botao) {

        return;

    }


    botao.textContent =

        editando

        ? "💾 Salvar alterações"

        : "Cadastrar paciente";

}


/*************************************************
                LOG
*************************************************/

console.log(
    "✅ pacientes.js V4.1 carregado"
);
