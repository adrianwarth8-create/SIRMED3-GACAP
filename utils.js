/*************************************************
                UTILS.JS - SIRMED V4
*************************************************/


/*************************************************
                FORMATAR DATA
*************************************************/

export function formatarData(data) {

    if (!data) {
        return "-";
    }

    // Caso venha como Timestamp do Firebase
    if (
        typeof data === "object" &&
        typeof data.toDate === "function"
    ) {

        return data
            .toDate()
            .toLocaleDateString("pt-BR");

    }

    const texto =
        String(data).trim();


    // Já está no formato brasileiro
    if (
        /^\d{2}\/\d{2}\/\d{4}$/
        .test(texto)
    ) {

        return texto;

    }


    // Formato ISO YYYY-MM-DD
    const iso =
        texto.match(
            /^(\d{4})-(\d{2})-(\d{2})$/
        );


    if (iso) {

        return `${iso[3]}/${iso[2]}/${iso[1]}`;

    }


    return texto;

}


/*************************************************
                FORMATAR MOEDA
*************************************************/

export function formatarMoeda(valor) {

    return Number(
        valor || 0
    ).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/*************************************************
                DATA ATUAL
*************************************************/

export function dataAtual() {

    return new Date()
        .toLocaleDateString(
            "pt-BR"
        );

}


/*************************************************
            DATA ATUAL EM ISO
*************************************************/

export function dataAtualISO() {

    const agora =
        new Date();


    const ano =
        agora.getFullYear();


    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            agora.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${ano}-${mes}-${dia}`;

}


/*************************************************
                HORA ATUAL
*************************************************/

export function horaAtual() {

    return new Date()
        .toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


/*************************************************
                DATA E HORA
*************************************************/

export function dataHoraAtual() {

    return `${dataAtual()} ${horaAtual()}`;

}


/*************************************************
                LIMPAR TEXTO
*************************************************/

export function limparTexto(texto) {

    return String(
        texto ?? ""
    ).trim();

}


/*************************************************
                CAMPO VAZIO
*************************************************/

export function campoVazio(valor) {

    return limparTexto(
        valor
    ) === "";

}


/*************************************************
                LIMPAR CAMPOS
*************************************************/

export function limparCampos(ids) {

    ids.forEach(
        (id) => {

            const campo =
                document.getElementById(id);


            if (!campo) {
                return;
            }


            if (
                campo.tagName === "SELECT"
            ) {

                campo.selectedIndex = 0;

            } else {

                campo.value = "";

            }

        }
    );

}


/*************************************************
                MENSAGEM
*************************************************/

export function mensagem(texto) {

    const toast =
        document.getElementById(
            "mensagemSistema"
        );


    // Fallback caso o toast não exista
    if (!toast) {

        alert(texto);

        return;

    }


    toast.textContent =
        texto;


    toast.classList.add(
        "mostrar"
    );


    clearTimeout(
        window.__sirmedToastTimer
    );


    window.__sirmedToastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "mostrar"
                );

            },
            3200
        );

}


/*************************************************
                CONFIRMAÇÃO
*************************************************/

export function confirmar(texto) {

    return window.confirm(
        texto
    );

}


/*************************************************
                FORMATAR CPF
*************************************************/

export function formatarCPF(cpf) {

    let valor =
        somenteNumeros(cpf)
        .slice(
            0,
            11
        );


    valor =
        valor.replace(
            /(\d{3})(\d)/,
            "$1.$2"
        );


    valor =
        valor.replace(
            /(\d{3})(\d)/,
            "$1.$2"
        );


    valor =
        valor.replace(
            /(\d{3})(\d{1,2})$/,
            "$1-$2"
        );


    return valor;

}


/*************************************************
            FORMATAR TELEFONE
*************************************************/

export function formatarTelefone(
    telefone
) {

    let valor =
        somenteNumeros(
            telefone
        ).slice(
            0,
            11
        );


    // Telefone fixo
    if (
        valor.length <= 10
    ) {

        valor =
            valor.replace(
                /^(\d{2})(\d)/,
                "($1) $2"
            );


        valor =
            valor.replace(
                /(\d{4})(\d{1,4})$/,
                "$1-$2"
            );

    }

    // Celular
    else {

        valor =
            valor.replace(
                /^(\d{2})(\d)/,
                "($1) $2"
            );


        valor =
            valor.replace(
                /(\d{5})(\d{1,4})$/,
                "$1-$2"
            );

    }


    return valor;

}


/*************************************************
                SOMENTE NÚMEROS
*************************************************/

export function somenteNumeros(
    texto
) {

    return String(
        texto ?? ""
    ).replace(
        /\D/g,
        ""
    );

}


/*************************************************
                    GERAR ID
*************************************************/

export function gerarID() {

    return `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

}


/*************************************************
                ESCAPAR HTML
*************************************************/

export function escaparHTML(
    valor
) {

    return String(
        valor ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/*************************************************
                LOG DO SISTEMA
*************************************************/

console.log(
    "✅ utils.js carregado"
);
