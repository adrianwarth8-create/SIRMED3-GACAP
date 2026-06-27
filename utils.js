/*****************
                UTILS.JS - SIRMED V4
*****************/

/*****************
                FORMATA DATA
*****************/

export function formatarData(data) {

    if (!data) return "-";

    if (typeof data === "string") {

        if (data.includes("/")) return data;

        const partes = data.split("-");

        if (partes.length === 3) {

            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

    }

    return data;

}

/*****************
                FORMATA MOEDA
*****************/

export function formatarMoeda(valor) {

    valor = Number(valor || 0);

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}

/*****************
                DATA ATUAL
*****************/

export function dataAtual() {

    return new Date().toLocaleDateString("pt-BR");

}

/*****************
                HORA ATUAL
*****************/

export function horaAtual() {

    return new Date().toLocaleTimeString("pt-BR");

}

/*****************
                DATA E HORA
*****************/

export function dataHoraAtual() {

    return `${dataAtual()} ${horaAtual()}`;

}

/*****************
                LIMPAR TEXTO
*****************/

export function limparTexto(texto) {

    return texto.trim();

}

/*****************
                CAMPO VAZIO
*****************/

export function campoVazio(valor) {

    return !valor || valor.trim() === "";

}

/*****************
                LIMPAR CAMPOS
*****************/

export function limparCampos(ids) {

    ids.forEach(id => {

        const campo = document.getElementById(id);

        if (!campo) return;

        if (campo.tagName === "SELECT") {

            campo.selectedIndex = 0;

        } else {

            campo.value = "";

        }

    });

}

/*****************
                MENSAGEM
*****************/

export function mensagem(texto) {

    alert(texto);

}

/*****************
                CONFIRMAÇÃO
*****************/

export function confirmar(texto) {

    return confirm(texto);

}

/*****************
                FORMATA CPF
*****************/

export function formatarCPF(cpf) {

    cpf = cpf.replace(/\D/g, "");

    if (cpf.length <= 11) {

        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    }

    return cpf;

}

/*****************
                FORMATA TELEFONE
*****************/

export function formatarTelefone(telefone) {

    telefone = telefone.replace(/\D/g, "");

    if (telefone.length <= 10) {

        telefone = telefone.replace(/^(\d{2})(\d)/g, "($1) $2");
        telefone = telefone.replace(/(\d)(\d{4})$/, "$1-$2");

    } else {

        telefone = telefone.replace(/^(\d{2})(\d)/g, "($1) $2");
        telefone = telefone.replace(/(\d)(\d{4})$/, "$1-$2");

    }

    return telefone;

}

/*****************
                SOMENTE NÚMEROS
*****************/

export function somenteNumeros(texto) {

    return texto.replace(/\D/g, "");

}

/*****************
                GERA ID
*****************/

export function gerarID() {

    return Date.now().toString();

}

/*****************
                EXPORTAÇÃO GLOBAL
*****************/

window.formatarData = formatarData;
window.formatarMoeda = formatarMoeda;
window.dataAtual = dataAtual;
window.horaAtual = horaAtual;
window.dataHoraAtual = dataHoraAtual;
window.limparTexto = limparTexto;
window.campoVazio = campoVazio;
window.limparCampos = limparCampos;
window.mensagem = mensagem;
window.confirmar = confirmar;
window.formatarCPF = formatarCPF;
window.formatarTelefone = formatarTelefone;
window.somenteNumeros = somenteNumeros;
window.gerarID = gerarID;

console.log("✅ utils.js carregado");
