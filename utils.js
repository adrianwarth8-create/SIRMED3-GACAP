/*****************
                UTILS.JS - SIRMED V4
*****************/

/*****************
                FORMATA DATA
*****************/

function formatarData(data) {

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

function formatarMoeda(valor) {

    valor = Number(valor || 0);

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}

/*****************
                DATA ATUAL
*****************/

function dataAtual() {

    return new Date().toLocaleDateString("pt-BR");

}

/*****************
                HORA ATUAL
*****************/

function horaAtual() {

    return new Date().toLocaleTimeString("pt-BR");

}

/*****************
                DATA E HORA
*****************/

function dataHoraAtual() {

    return `${dataAtual()} ${horaAtual()}`;

}

/*****************
                LIMPAR TEXTO
*****************/

function limparTexto(texto) {

    return texto.trim();

}

/*****************
                CAMPO VAZIO
*****************/

function campoVazio(valor) {

    return !valor || valor.trim() === "";

}

/*****************
                LIMPAR CAMPOS
*****************/

function limparCampos(ids) {

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

function mensagem(texto) {

    alert(texto);

}

/*****************
                CONFIRMAÇÃO
*****************/

function confirmar(texto) {

    return confirm(texto);

}

/*****************
                FORMATA CPF
*****************/

function formatarCPF(cpf) {

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

function formatarTelefone(telefone) {

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

function somenteNumeros(texto) {

    return texto.replace(/\D/g, "");

}

/*****************
                GERA ID
*****************/

function gerarID() {

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
