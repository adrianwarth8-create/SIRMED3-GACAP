/*************************************************
        HISTORICO.JS - SIRMED V4.7
*************************************************/


/*************************************************
                    CONSULTAS
*************************************************/

import {
    obterConsultas
} from "./consultas.js";


/*************************************************
                    UTILS
*************************************************/

import {
    formatarData,
    formatarMoeda,
    escaparHTML
} from "./utils.js";


/*************************************************
            OBTER HISTÓRICO
*************************************************/

export function obterHistorico() {

    const consultas =
        obterConsultas();


    if (
        !Array.isArray(
            consultas
        )
    ) {

        return [];

    }


    /*
        Criamos uma cópia para não
        alterar a lista original
        de consultas.
    */

    return consultas
        .slice()
        .sort(
            ordenarHistorico
        );

}


/*************************************************
            ORDENAR HISTÓRICO
*************************************************/

function ordenarHistorico(
    a,
    b
) {

    /*
        Primeiro tentamos usar o
        Timestamp criadoEm do Firestore.
    */

    const dataA =
        obterTempo(
            a
        );


    const dataB =
        obterTempo(
            b
        );


    return (
        dataB -
        dataA
    );

}


/*************************************************
            OBTER TEMPO
*************************************************/

function obterTempo(
    registro
) {

    /*
        Timestamp Firebase
    */

    if (
        registro?.criadoEm
        &&
        typeof registro.criadoEm.toDate
        ===
        "function"
    ) {

        return registro
            .criadoEm
            .toDate()
            .getTime();

    }


    /*
        Fallback pela data da consulta.
    */

    if (
        registro?.data
    ) {

        const texto =
            String(
                registro.data
            );


        /*
            YYYY-MM-DD
        */

        if (
            /^\d{4}-\d{2}-\d{2}$/
            .test(
                texto
            )
        ) {

            return new Date(
                `${texto}T00:00:00`
            )
            .getTime();

        }


        /*
            DD/MM/YYYY
        */

        const brasileiro =
            texto.match(
                /^(\d{2})\/(\d{2})\/(\d{4})$/
            );


        if (
            brasileiro
        ) {

            return new Date(
                Number(
                    brasileiro[3]
                ),
                Number(
                    brasileiro[2]
                ) - 1,
                Number(
                    brasileiro[1]
                )
            )
            .getTime();

        }

    }


    return 0;

}


/*************************************************
            RENDER HISTÓRICO
*************************************************/

export function renderHistorico() {

    const lista =
        document.getElementById(
            "listaHistorico"
        );


    if (!lista) {

        return;

    }


    const historico =
        obterHistorico();


    /*************************************************
                HISTÓRICO VAZIO
    *************************************************/

    if (
        historico.length === 0
    ) {

        lista.innerHTML = `

            <li class="lista-vazia">

                O histórico está vazio.

            </li>

        `;


        return;

    }


    /*************************************************
                MOSTRAR REGISTROS
    *************************************************/

    lista.innerHTML =

        historico.map(
            (consulta) => {

                return `

                    <li class="item-registro">

                        <strong>

                            🩺 Consulta Médica

                        </strong>


                        <span>

                            <b>Paciente:</b>

                            ${
                                escaparHTML(
                                    consulta.paciente
                                    ||
                                    "-"
                                )
                            }

                        </span>


                        <span>

                            <b>Profissional:</b>

                            ${
                                escaparHTML(
                                    consulta.profissional
                                    ||
                                    "-"
                                )
                            }

                        </span>


                        <span>

                            <b>Data:</b>

                            ${
                                escaparHTML(
                                    formatarData(
                                        consulta.data
                                    )
                                )
                            }

                        </span>


                        ${
                            montarLinha(
                                "🩸 Pressão arterial",
                                consulta.pa
                            )
                        }


                        ${
                            montarLinha(
                                "❤️ Frequência cardíaca",
                                consulta.fc,
                                " bpm"
                            )
                        }


                        ${
                            montarLinha(
                                "🌡️ Temperatura",
                                consulta.temperatura,
                                " °C"
                            )
                        }


                        ${
                            montarBloco(
                                "🩺 Queixa principal",
                                consulta.queixa
                            )
                        }


                        ${
                            montarBloco(
                                "🔎 Exame físico",
                                consulta.exameFisico
                            )
                        }


                        ${
                            montarBloco(
                                "📋 Diagnóstico",
                                consulta.diagnostico
                            )
                        }


                        ${
                            montarBloco(
                                "💊 Prescrição",
                                consulta.prescricao
                            )
                        }


                        ${
                            montarBloco(
                                "📝 Observações",
                                consulta.observacoes
                            )
                        }


                        <span>

                            <b>💰 Valor:</b>

                            ${
                                escaparHTML(
                                    formatarMoeda(
                                        consulta.valor
                                        ||
                                        0
                                    )
                                )
                            }

                        </span>


                    </li>

                `;

            }

        )
        .join("");

}


/*************************************************
                MONTAR LINHA
*************************************************/

function montarLinha(
    titulo,
    valor,
    sufixo = ""
) {

    if (
        valor === ""
        ||
        valor === null
        ||
        valor === undefined
    ) {

        return "";

    }


    return `

        <span>

            <b>
                ${escaparHTML(
                    titulo
                )}:
            </b>

            ${escaparHTML(
                valor
            )}

            ${escaparHTML(
                sufixo
            )}

        </span>

    `;

}


/*************************************************
                MONTAR BLOCO
*************************************************/

function montarBloco(
    titulo,
    valor
) {

    if (
        !valor
    ) {

        return "";

    }


    return `

        <div style="
            margin-top:10px;
        ">

            <b>
                ${escaparHTML(
                    titulo
                )}:
            </b>

            <br>

            ${escaparHTML(
                valor
            )}

        </div>

    `;

}


/*************************************************
              FILTRAR HISTÓRICO
*************************************************/

export function filtrarHistorico() {

    const pesquisa =
        document.getElementById(
            "pesquisaHistorico"
        );


    if (!pesquisa) {

        return;

    }


    const filtro =
        String(
            pesquisa.value
            ||
            ""
        )
        .trim()
        .toLowerCase();


    document
        .querySelectorAll(
            "#listaHistorico li"
        )
        .forEach(
            (item) => {

                const texto =
                    item
                        .textContent
                        .toLowerCase();


                item.style.display =

                    texto.includes(
                        filtro
                    )

                        ? ""

                        : "none";

            }
        );

}


/*************************************************
          CONFIGURAR EVENTOS HISTÓRICO
*************************************************/

let eventosConfigurados =
    false;


export function configurarEventosHistorico() {

    if (
        eventosConfigurados
    ) {

        return;

    }


    eventosConfigurados =
        true;


    document
        .getElementById(
            "pesquisaHistorico"
        )
        ?.addEventListener(
            "input",
            filtrarHistorico
        );


    console.log(
        "📋 Eventos do histórico configurados."
    );

}


/*************************************************
            EXPORTAÇÕES GLOBAIS
*************************************************/

window.renderHistorico =
    renderHistorico;


window.filtrarHistorico =
    filtrarHistorico;


/*************************************************
                    LOG
*************************************************/

console.log(
    "✅ historico.js V4.7 carregado"
);
