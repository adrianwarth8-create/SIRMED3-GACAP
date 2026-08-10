/*************************************************
              PACIENTES.JS - SIRMED V4
*************************************************/

import {
    db,
    collection,
    addDoc,
    getDocs,
    serverTimestamp
} from "./firebase.js";

import {
    mensagem,
    formatarData,
    formatarCPF,
    formatarTelefone,
    escaparHTML
} from "./utils.js";


/*************************************************
                VARIÁVEL PRINCIPAL
*************************************************/

const pacientes = [];


/*************************************************
                OBTER PACIENTES
*************************************************/

export function obterPacientes() {

    return pacientes;

}


/*************************************************
                TOTAL DE PACIENTES
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


    /*************************************************
                ORDENAR POR NOME
    *************************************************/

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
                CADASTRAR PACIENTE
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


    /*************************************************
                    VALIDAÇÃO
    *************************************************/

    if (!nome) {

        mensagem(
            "Informe o nome do paciente."
        );

        return;

    }


    /*************************************************
                SALVAR NO FIRESTORE
    *************************************************/

    try {

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


        /*************************************************
                    LIMPAR FORMULÁRIO
        *************************************************/

        limparFormularioPaciente();


        /*************************************************
                    MENSAGEM
        *************************************************/

        mensagem(
            "Paciente cadastrado com sucesso."
        );


        /*************************************************
                AVISAR O SISTEMA
        *************************************************/

        document.dispatchEvent(

            new CustomEvent(
                "sirmed:dados-alterados"
            )

        );

    } catch (erro) {

        console.error(
            "Erro ao cadastrar paciente:",
            erro
        );


        mensagem(
            "Não foi possível cadastrar o paciente."
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


    /*************************************************
                LISTA VAZIA
    *************************************************/

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


    /*************************************************
                RENDERIZAR LISTA
    *************************************************/

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

                </li>

            `
        ).join("");

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

}


/*************************************************
                LOG DO SISTEMA
*************************************************/

console.log(
    "✅ pacientes.js carregado"
);
