/*************************************************
             FINANCEIRO.JS - SIRMED V4
*************************************************/

import {
    db,
    collection,
    getDocs
} from "./firebase.js";

import {
    formatarMoeda,
    formatarData,
    escaparHTML
} from "./utils.js";


/*************************************************
                VARIÁVEL PRINCIPAL
*************************************************/

const gastos = [];


/*************************************************
                OBTER GASTOS
*************************************************/

export function obterGastos() {

    return gastos;

}


/*************************************************
                CARREGAR GASTOS
*************************************************/

export async function carregarGastos() {

    const snap =
        await getDocs(
            collection(
                db,
                "gastos"
            )
        );


    gastos.length = 0;


    snap.forEach(
        (docSnap) => {

            gastos.push({

                id:
                    docSnap.id,

                ...docSnap.data()

            });

        }
    );


    /*************************************************
                ORDENAR POR DATA
    *************************************************/

    gastos.sort(
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
                RENDER FINANCEIRO
*************************************************/

export function renderGastos() {

    const lista =
        document.getElementById(
            "listaGastos"
        );


    if (!lista) {

        return;

    }


    /*************************************************
                LISTA VAZIA
    *************************************************/

    if (
        gastos.length === 0
    ) {

        lista.innerHTML = `

            <li class="lista-vazia">

                Nenhuma movimentação financeira encontrada.

            </li>

        `;


        return;

    }


    /*************************************************
                RENDERIZAR LISTA
    *************************************************/

    lista.innerHTML =

        gastos.map(
            (gasto) => `

                <li class="item-registro">

                    <strong>

                        💰 ${
                            escaparHTML(
                                gasto.tipo ||
                                "Movimentação"
                            )
                        }

                    </strong>


                    <span>

                        <b>Paciente:</b>

                        ${
                            escaparHTML(
                                gasto.paciente || "-"
                            )
                        }

                    </span>


                    <span>

                        <b>Data:</b>

                        ${
                            escaparHTML(
                                formatarData(
                                    gasto.data
                                )
                            )
                        }

                    </span>


                    <span>

                        <b>Valor:</b>

                        ${
                            escaparHTML(
                                formatarMoeda(
                                    gasto.valor
                                )
                            )
                        }

                    </span>

                </li>

            `
        ).join("");

}


/*************************************************
                TOTAL FINANCEIRO
*************************************************/

export function totalFinanceiro() {

    return gastos.reduce(
        (total, gasto) => {

            return (
                total +
                Number(
                    gasto.valor || 0
                )
            );

        },
        0
    );

}


/*************************************************
            QUANTIDADE DE MOVIMENTAÇÕES
*************************************************/

export function quantidadeMovimentacoes() {

    return gastos.length;

}


/*************************************************
                FILTRAR FINANCEIRO
*************************************************/

export function filtrarFinanceiro(
    texto = ""
) {

    const filtro =
        String(
            texto
        ).toLowerCase();


    return gastos.filter(
        (gasto) =>

            String(
                gasto.paciente || ""
            )
            .toLowerCase()
            .includes(
                filtro
            )

            ||

            String(
                gasto.tipo || ""
            )
            .toLowerCase()
            .includes(
                filtro
            )

    );

}


/*************************************************
                LOG DO SISTEMA
*************************************************/

console.log(
    "✅ financeiro.js carregado"
);
