/*************************************************
            PROFISSIONAIS.JS - SIRMED V4.1
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
    escaparHTML
} from "./utils.js";


/*************************************************
                VARIÁVEIS
*************************************************/

const profissionais = [];

let profissionalEmEdicao = null;


/*************************************************
                OBTER PROFISSIONAIS
*************************************************/

export function obterProfissionais() {
    return profissionais;
}


/*************************************************
                TOTAL PROFISSIONAIS
*************************************************/

export function totalProfissionais() {
    return profissionais.length;
}


/*************************************************
                CARREGAR PROFISSIONAIS
*************************************************/

export async function carregarProfissionais() {

    const snap = await getDocs(
        collection(
            db,
            "profissionais"
        )
    );

    profissionais.length = 0;

    snap.forEach(
        (docSnap) => {

            profissionais.push({
                id: docSnap.id,
                ...docSnap.data()
            });

        }
    );

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
            CADASTRAR / SALVAR PROFISSIONAL
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


    try {

        /*************************************************
                    EDITAR PROFISSIONAL
        *************************************************/

        if (
            profissionalEmEdicao
        ) {

            await updateDoc(

                doc(
                    db,
                    "profissionais",
                    profissionalEmEdicao
                ),

                {
                    nome,
                    funcao,
                    registro,
                    atualizadoEm:
                        serverTimestamp()
                }

            );

            mensagem(
                "Profissional atualizado com sucesso."
            );

            profissionalEmEdicao =
                null;

            atualizarBotaoProfissional(
                false
            );

        }


        /*************************************************
                    NOVO PROFISSIONAL
        *************************************************/

        else {

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

            mensagem(
                "Profissional cadastrado com sucesso."
            );

        }


        limparFormularioProfissional();


        document.dispatchEvent(
            new CustomEvent(
                "sirmed:dados-alterados"
            )
        );

    } catch (erro) {

        console.error(
            "Erro ao salvar profissional:",
            erro
        );

        mensagem(
            "Não foi possível salvar o profissional."
        );

    }

}


/*************************************************
                EDITAR PROFISSIONAL
*************************************************/

export function editarProfissional(id) {

    const profissional =
        profissionais.find(
            (p) =>
                p.id === id
        );


    if (!profissional) {

        mensagem(
            "Profissional não encontrado."
        );

        return;

    }


    profissionalEmEdicao =
        id;


    document
        .getElementById(
            "profissionalNome"
        )
        .value =
        profissional.nome || "";


    document
        .getElementById(
            "profissionalFuncao"
        )
        .value =
        profissional.funcao || "";


    document
        .getElementById(
            "profissionalRegistro"
        )
        .value =
        profissional.registro || "";


    atualizarBotaoProfissional(
        true
    );


    document
        .getElementById(
            "secaoProfissionais"
        )
        ?.scrollIntoView({
            behavior: "smooth"
        });


    mensagem(
        "Profissional carregado para edição."
    );

}


/*************************************************
                EXCLUIR PROFISSIONAL
*************************************************/

export async function excluirProfissional(id) {

    const profissional =
        profissionais.find(
            (p) =>
                p.id === id
        );


    if (!profissional) {

        mensagem(
            "Profissional não encontrado."
        );

        return;

    }


    const resposta =
        confirmar(
            `Deseja realmente excluir o profissional "${profissional.nome}"?`
        );


    if (!resposta) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "profissionais",
                id
            )
        );


        if (
            profissionalEmEdicao ===
            id
        ) {

            profissionalEmEdicao =
                null;

            limparFormularioProfissional();

            atualizarBotaoProfissional(
                false
            );

        }


        mensagem(
            "Profissional excluído com sucesso."
        );


        document.dispatchEvent(
            new CustomEvent(
                "sirmed:dados-alterados"
            )
        );

    } catch (erro) {

        console.error(
            "Erro ao excluir profissional:",
            erro
        );

        mensagem(
            "Não foi possível excluir o profissional."
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

                        ${escaparHTML(
                            p.funcao || "-"
                        )}

                    </span>


                    <span>

                        <b>Registro:</b>

                        ${escaparHTML(
                            p.registro || "-"
                        )}

                    </span>


                    <div class="acoes-registro">

                        <button
                            type="button"
                            class="btn-editar"
                            data-editar-profissional="${p.id}"
                        >
                            ✏️ Editar
                        </button>


                        <button
                            type="button"
                            class="btn-excluir"
                            data-excluir-profissional="${p.id}"
                        >
                            🗑️ Excluir
                        </button>

                    </div>

                </li>

            `
        ).join("");


    ligarBotoesProfissionais();

}


/*************************************************
        LIGAR BOTÕES DOS PROFISSIONAIS
*************************************************/

function ligarBotoesProfissionais() {

    document
        .querySelectorAll(
            "[data-editar-profissional]"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    () => {

                        editarProfissional(
                            botao.dataset
                                .editarProfissional
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-excluir-profissional]"
        )
        .forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    () => {

                        excluirProfissional(
                            botao.dataset
                                .excluirProfissional
                        );

                    }
                );

            }
        );

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


    profissionalEmEdicao =
        null;


    atualizarBotaoProfissional(
        false
    );

}


/*************************************************
            ALTERAR TEXTO DO BOTÃO
*************************************************/

function atualizarBotaoProfissional(editando) {

    const botao =
        document.getElementById(
            "btnCadastrarProfissional"
        );


    if (!botao) {
        return;
    }


    botao.textContent =

        editando

        ? "💾 Salvar alterações"

        : "Cadastrar profissional";

}


/*************************************************
                    LOG
*************************************************/

console.log(
    "✅ profissionais.js V4.1 carregado"
);
