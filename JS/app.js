/* =========================================================
   LU&YOSHI CAFÉ
   INDEX.JS
   ========================================================= */


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    inicializarNavegacao();

    inicializarCarrinho();

    inicializarPesquisa();

    inicializarBotoesAdicionar();

    atualizarContadoresCarrinho();

});


/* =========================================================
   CONFIGURAÇÃO
   ========================================================= */

const CHAVE_CARRINHO = "luYoshiCarrinho";


/* =========================================================
   NAVEGAÇÃO
   ========================================================= */

function inicializarNavegacao() {

    const links = document.querySelectorAll(
        ".menu-principal a"
    );

    const paginaAtual = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    links.forEach(link => {

        const href = link.getAttribute("href");

        if (!href) {
            return;
        }

        if (href.startsWith("#")) {
            return;
        }

        const nomeArquivo = href
            .split("?")[0]
            .split("/")
            .pop()
            .toLowerCase();

        if (nomeArquivo === paginaAtual) {

            links.forEach(item => {
                item.classList.remove("ativo");
            });

            link.classList.add("ativo");
        }

    });

}


/* =========================================================
   CARRINHO
   ========================================================= */

function obterCarrinho() {

    try {

        const dados = localStorage.getItem(
            CHAVE_CARRINHO
        );

        if (!dados) {
            return [];
        }

        return JSON.parse(dados);

    } catch (erro) {

        console.error(
            "Erro ao carregar o carrinho:",
            erro
        );

        return [];
    }

}


function salvarCarrinho(carrinho) {

    try {

        localStorage.setItem(
            CHAVE_CARRINHO,
            JSON.stringify(carrinho)
        );

    } catch (erro) {

        console.error(
            "Erro ao salvar o carrinho:",
            erro
        );

    }

}


/* =========================================================
   INICIALIZAR CARRINHO
   ========================================================= */

function inicializarCarrinho() {

    const botaoCarrinho =
        document.getElementById("abrirCarrinho");

    if (!botaoCarrinho) {
        return;
    }

    botaoCarrinho.addEventListener(
        "click",
        event => {

            event.preventDefault();

            abrirCarrinho();

        }
    );

}


/* =========================================================
   CONTADOR DO CARRINHO
   ========================================================= */

function atualizarContadoresCarrinho() {

    const carrinho = obterCarrinho();

    const quantidade = carrinho.reduce(
        (total, produto) => {

            return total +
                Number(produto.quantidade || 0);

        },
        0
    );


    document
        .querySelectorAll(".contador-carrinho")
        .forEach(contador => {

            contador.textContent = quantidade;

            if (quantidade > 0) {

                contador.style.display = "flex";

            } else {

                contador.style.display = "none";

            }

        });

}


/* =========================================================
   ADICIONAR PRODUTO
   ========================================================= */

function adicionarAoCarrinho(produto) {

    const carrinho = obterCarrinho();


    const produtoExistente =
        carrinho.find(item => {

            return item.id === produto.id;

        });


    if (produtoExistente) {

        produtoExistente.quantidade += 1;

    } else {

        carrinho.push({

            id: produto.id,

            nome: produto.nome,

            preco: produto.preco,

            imagem: produto.imagem,

            quantidade: 1

        });

    }


    salvarCarrinho(carrinho);

    atualizarContadoresCarrinho();


    mostrarMensagem(
        `${produto.nome} foi adicionado ao carrinho.`
    );

}


/* =========================================================
   BOTÕES DOS PRODUTOS
   ========================================================= */

function inicializarBotoesAdicionar() {

    const produtos =
        document.querySelectorAll(
            ".produto-card"
        );


    produtos.forEach((card, indice) => {

        const botao =
            card.querySelector(
                ".botao-adicionar"
            );


        if (!botao) {
            return;
        }


        botao.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                const nomeElemento =
                    card.querySelector(
                        ".produto-conteudo h3"
                    );


                const precoElemento =
                    card.querySelector(
                        ".produto-final strong"
                    );


                const imagemElemento =
                    card.querySelector(
                        ".produto-imagem img"
                    );


                const nome =
                    nomeElemento
                        ? nomeElemento.textContent.trim()
                        : `Produto ${indice + 1}`;


                const precoTexto =
                    precoElemento
                        ? precoElemento.textContent.trim()
                        : "0";


                const preco =
                    extrairPreco(
                        precoTexto
                    );


                const id =
                    card.dataset.id ||
                    botao.dataset.produto ||
                    `produto-${indice + 1}`;


                const imagem =
                    imagemElemento
                        ? imagemElemento.getAttribute("src")
                        : "";


                adicionarAoCarrinho({

                    id: id,

                    nome: nome,

                    preco: preco,

                    imagem: imagem

                });

            }
        );

    });

}


/* =========================================================
   CONVERTER PREÇO
   ========================================================= */

function extrairPreco(texto) {

    if (!texto) {
        return 0;
    }


    let valor = texto
        .replace(/[^\d,.]/g, "")
        .trim();


    if (!valor) {
        return 0;
    }


    /*
     * Exemplo:
     *
     * 120 MT
     * MT 120
     * 120.00 MT
     * 1.800 MT
     */


    if (
        valor.includes(".") &&
        valor.includes(",")
    ) {

        valor = valor
            .replace(/\./g, "")
            .replace(",", ".");

    }


    else if (
        valor.includes(".") &&
        !valor.includes(",")
    ) {

        const partes =
            valor.split(".");


        if (
            partes.length === 2 &&
            partes[1].length === 3
        ) {

            valor =
                valor.replace(".", "");

        }

    }


    else if (valor.includes(",")) {

        valor =
            valor.replace(",", ".");

    }


    return Number(valor) || 0;

}


/* =========================================================
   ABRIR CARRINHO
   ========================================================= */

function abrirCarrinho() {

    const carrinho =
        obterCarrinho();


    if (carrinho.length === 0) {

        mostrarMensagem(
            "O seu carrinho está vazio."
        );

        return;
    }


    /*
     * Por enquanto mostramos uma mensagem.
     *
     * O modal completo do carrinho será criado
     * quando trabalharmos a página Cardápio.
     */

    mostrarMensagem(
        `Você tem ${carrinho.length} produto(s) no carrinho.`
    );


    console.log(
        "Carrinho atual:",
        carrinho
    );

}


/* =========================================================
   PESQUISA
   ========================================================= */

function inicializarPesquisa() {

    const botaoPesquisa =
        document.getElementById(
            "abrirPesquisa"
        );


    if (!botaoPesquisa) {
        return;
    }


    botaoPesquisa.addEventListener(
        "click",
        () => {

            abrirPesquisa();

        }
    );

}


/* =========================================================
   ABRIR PESQUISA
   ========================================================= */

function abrirPesquisa() {

    const termo =
        window.prompt(
            "O que deseja procurar no cardápio?"
        );


    if (termo === null) {
        return;
    }


    const busca =
        termo.trim().toLowerCase();


    if (!busca) {
        return;
    }


    const produtos =
        document.querySelectorAll(
            ".produto-card"
        );


    let encontrados = 0;


    produtos.forEach(card => {

        const texto =
            card.textContent.toLowerCase();


        const corresponde =
            texto.includes(busca);


        if (corresponde) {

            card.style.display = "";

            encontrados++;

        } else {

            card.style.display = "none";

        }

    });


    if (encontrados === 0) {

        mostrarMensagem(
            "Nenhum produto encontrado."
        );

        return;
    }


    const secao =
        document.querySelector(
            ".destaque"
        );


    if (secao) {

        secao.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }


    mostrarMensagem(
        `${encontrados} produto(s) encontrado(s).`
    );

}


/* =========================================================
   MENSAGEM
   ========================================================= */

function mostrarMensagem(texto) {

    let mensagem =
        document.querySelector(
            ".mensagem-site"
        );


    if (!mensagem) {

        mensagem =
            document.createElement("div");


        mensagem.className =
            "mensagem-site";


        mensagem.style.position =
            "fixed";

        mensagem.style.right =
            "24px";

        mensagem.style.bottom =
            "24px";

        mensagem.style.zIndex =
            "9999";

        mensagem.style.padding =
            "13px 18px";

        mensagem.style.borderRadius =
            "8px";

        mensagem.style.background =
            "#1b1612";

        mensagem.style.border =
            "1px solid rgba(217, 154, 50, 0.4)";

        mensagem.style.color =
            "#f5ead8";

        mensagem.style.boxShadow =
            "0 15px 35px rgba(0,0,0,.35)";

        mensagem.style.fontFamily =
            "Poppins, Arial, sans-serif";

        mensagem.style.fontSize =
            "13px";

        mensagem.style.opacity =
            "0";

        mensagem.style.transform =
            "translateY(10px)";

        mensagem.style.transition =
            ".3s ease";


        document.body.appendChild(
            mensagem
        );

    }


    mensagem.textContent =
        texto;


    requestAnimationFrame(() => {

        mensagem.style.opacity =
            "1";

        mensagem.style.transform =
            "translateY(0)";

    });


    clearTimeout(
        mensagem._timer
    );


    mensagem._timer =
        setTimeout(() => {

            mensagem.style.opacity =
                "0";

            mensagem.style.transform =
                "translateY(10px)";

        }, 2500);

}


/* =========================================================
   DISPONIBILIZAR FUNÇÕES PARA OUTRAS PÁGINAS
   ========================================================= */

window.obterCarrinho =
    obterCarrinho;

window.salvarCarrinho =
    salvarCarrinho;

window.adicionarAoCarrinho =
    adicionarAoCarrinho;

window.atualizarContadoresCarrinho =
    atualizarContadoresCarrinho;