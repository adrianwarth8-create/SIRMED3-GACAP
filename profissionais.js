/*************************************************
            PROFISSIONAIS.JS - SIRMED V4
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
    escaparHTML
} from "./utils.js";


/*************************************************
                VARIÁVEL PRINCIPAL
*************************************************/

const profissionais = [];


/*************************************************
                OBTER PROFISSIONAIS
*************************************************/

export function obterProfissionais() {

    return profissionais;

}


/*************************************************
            TOTAL DE PROFISSIONAIS
*************************************************/

export function totalProfissionais() {

    return profissionais.length;

}


/*************************************************
            CARREGAR PROFISSIONAIS
*************************************************/

export async function carregarProfissionais() {

    const snap =
        await getDocs(
            collection(
                db,
                "profissionais"
            )
        );


    profissionais.length = 0;


    snap.forEach(
        (docSnap) => {

            profissionais.push({

                id:
                    docSnap.id,

                ...docSnap.data()

            });

        }
    );


    /*************************************************
                ORDENAR POR NOME
    *************************************************/

    profissionais.sort(
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
            CADASTRAR PROFISSIONAL
*************************************************/

export async function cadastrarProfissional() {

    const nome =
        document
            .getElementById(
                "profissionalNome"
            )
            ?.value
            .trim()
        || "";


    const funcao =
        document
            .getElementById(
                "profissionalFuncao"
            )
            ?.value
        || "";


    const registro =
        document
            .getElementById(
                "profissionalRegistro"
            )
            ?.value
            .trim()
        || "";


    /*************************************************
                    VALIDAÇÃO
    *************************************************/

    if (
        !nome ||
        !funcao
    ) {

        mensagem(
            "Preencha o nome e a função do profissional."
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
                "profissionais"
            ),

            {

                nome,

                funcao,

                registro,

                criadoEm:
                    serverTimestamp()

            }

        );


        /*************************************************
                    LIMPAR FORMULÁRIO
        *************************************************/

        limparFormularioProfissional();


        /*************************************************
                    MENSAGEM
        *************************************************/

        mensagem(
            "Profissional cadastrado com sucesso."
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
            "Erro ao cadastrar profissional:",
            erro
        );


        mensagem(
            "Não foi possível cadastrar o profissional."
        );

    }

}


/*************************************************
            RENDER PROFISSIONAIS
*************************************************/

export function renderProfissionais() {

    const lista =
        document.getElementById(
            "listaProfissionais"
        );


    if (!lista) {

        return;

    }


    /*************************************************
                LISTA VAZIA
    *************************************************/

    if (
        profissionais.length === 0
    ) {

        lista.innerHTML = `

            <li class="lista-vazia">

                Nenhum profissional encontrado.

            </li>

        `;


        return;

    }


    /*************************************************
                RENDERIZAR LISTA
    *************************************************/

    lista.innerHTML =

        profissionais.map(
            (p) => `

                <li class="item-registro">

                    <strong>

                        👨‍⚕️ ${escaparHTML(
                            p.nome
                        )}

                    </strong>


                    <span>

                        <b>Função:</b>

                        ${
                            escaparHTML(
                                p.funcao || "-"
                            )
                        }

                    </span>


                    <span>

                        <b>Registro:</b>

                        ${
                            escaparHTML(
                                p.registro || "-"
                            )
                        }

                    </span>

                </li>

            `
        ).join("");

}


/*************************************************
            FILTRAR PROFISSIONAIS
*************************************************/

export function filtrarProfissionais() {

    const filtro =
        (
            document
                .getElementById(
                    "pesquisaProfissional"
                )
                ?.value
            || ""
        )
        .toLowerCase();


    document
        .querySelectorAll(
            "#listaProfissionais li"
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
        LIMPAR FORMULÁRIO PROFISSIONAL
*************************************************/

export function limparFormularioProfissional() {

    const campos = [

        "profissionalNome",

        "profissionalFuncao",

        "profissionalRegistro"

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
    "✅ profissionais.js carregado"
);
