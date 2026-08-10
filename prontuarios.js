/*************************************************
            PRONTUARIOS.JS - SIRMED V4
*************************************************/

import {
    db,
    collection,
    getDocs
} from "./firebase.js";

import {
    formatarData,
    escaparHTML
} from "./utils.js";


/*************************************************
                VARIÁVEL PRINCIPAL
*************************************************/

const prontuarios = [];


/*************************************************
                OBTER PRONTUÁRIOS
*************************************************/

export function obterProntuarios() {

    return prontuarios;

}


/*************************************************
                CARREGAR PRONTUÁRIOS
*************************************************/

export async function carregarProntuarios() {

    const snap =
        await getDocs(
            collection(
                db,
                "prontuarios"
            )
        );


    prontuarios.length = 0;


    snap.forEach(
        (docSnap) => {

            prontuarios.push({

                id:
                    docSnap.id,

                ...docSnap.data()

            });

        }
    );


    /*************************************************
                ORDENAR POR DATA
    *************************************************/

    prontuarios.sort(
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
                RENDER PRONTUÁRIOS
*************************************************/

export function renderProntuarios() {

    const lista =
        document.getElementById(
            "listaProntuarios"
        );


    if (!lista) {

        return;

    }


    /*************************************************
                LISTA VAZIA
    *************************************************/

    if (
        prontuarios.length === 0
    ) {

        lista.innerHTML = `

            <li class="lista-vazia">

                Nenhum prontuário encontrado.

            </li>

        `;


        return;

    }


    /*************************************************
                RENDERIZAR LISTA
    *************************************************/

    lista.innerHTML =

        prontuarios.map(
            (p) => `

                <li class="item-registro prontuario">

                    <strong>

                        👤 ${
                            escaparHTML(
                                p.pacienteNome ||
                                p.paciente ||
                                "-"
                            )
                        }

                    </strong>


                    <span>

                        <b>Profissional:</b>

                        ${
                            escaparHTML(
                                p.profissionalNome ||
                                p.profissional ||
                                "-"
                            )
                        }

                    </span>


                    <span>

                        <b>Data:</b>

                        ${
                            escaparHTML(
                                formatarData(
                                    p.data
                                )
                            )
                        }

                    </span>


                    <span>

                        <b>Queixa:</b>

                        ${
                            escaparHTML(
                                p.queixa || "-"
                            )
                        }

                    </span>


                    <span>

                        <b>Pressão arterial:</b>

                        ${
                            escaparHTML(
                                p.pa || "-"
                            )
                        }

                    </span>


                    <span>

                        <b>Frequência cardíaca:</b>

                        ${
                            escaparHTML(
                                p.fc || "-"
                            )
                        }

                    </span>


                    <span>

                        <b>Temperatura:</b>

                        ${
                            escaparHTML(
                                p.temperatura || "-"
                            )
                        }

                    </span>


                    <span>

                        <b>Exame físico:</b>

                        ${
                            escaparHTML(
                                p.exameFisico || "-"
                            )
                        }

                    </span>


                    <span>

                        <b>Diagnóstico:</b>

                        ${
                            escaparHTML(
                                p.diagnostico || "-"
                            )
                        }

                    </span>


                    <span>

                        <b>Prescrição:</b>

                        ${
                            escaparHTML(
                                p.prescricao || "-"
                            )
                        }

                    </span>


                    <span>

                        <b>Observações:</b>

                        ${
                            escaparHTML(
                                p.observacoes || "-"
                            )
                        }

                    </span>

                </li>

            `
        ).join("");

}


/*************************************************
            BUSCAR PRONTUÁRIO POR PACIENTE
*************************************************/

export function buscarProntuariosPaciente(
    identificador
) {

    return prontuarios.filter(
        (p) =>

            p.pacienteId === identificador

            ||

            p.pacienteNome === identificador

            ||

            p.paciente === identificador

    );

}


/*************************************************
            TOTAL DE PRONTUÁRIOS
*************************************************/

export function totalProntuarios() {

    return prontuarios.length;

}


/*************************************************
                LOG DO SISTEMA
*************************************************/

console.log(
    "✅ prontuarios.js carregado"
);
