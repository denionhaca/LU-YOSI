const modais = document.querySelectorAll(".modal");

const botoesVerMais = document.querySelectorAll(".botao-ver-mais");

const botoesFechar = document.querySelectorAll(".fechar-modal");

const pesquisaCardapio =
    document.querySelector("#pesquisaCardapio");

const atalhosCategorias =
    document.querySelectorAll(".categoria-atalho");

const botoesAdicionar =
    document.querySelectorAll(".botao-adicionar, .botao-adicionar-modal");

const campoPesquisasModal =
    document.querySelectorAll(".modal-pesquisa input");


let carrinho = [];


botoesVerMais.forEach(botao => {

    botao.addEventListener("click", () => {

        const idModal = botao.dataset.modal;

        const modal = document.getElementById(idModal);

        if (!modal) {
            console.warn(
                `Modal "${idModal}" não encontrado.`
            );

            return;
        }

        abrirModal(modal);
    });

});



function abrirModal(modal) {

    modal.classList.add("aberto");

    document.body.style.overflow = "hidden";

    const primeiroInput =
        modal.querySelector(".modal-pesquisa input");

    if (primeiroInput) {

        setTimeout(() => {
            primeiroInput.focus();
        }, 200);

    }

}



botoesFechar.forEach(botao => {

    botao.addEventListener("click", () => {

        const modal =
            botao.closest(".modal");

        fecharModal(modal);

    });

});




function fecharModal(modal) {

    if (!modal) return;

    modal.classList.remove("aberto");

    document.body.style.overflow = "";

}



modais.forEach(modal => {

    modal.addEventListener("click", evento => {

        if (evento.target === modal) {

            fecharModal(modal);

        }

    });

});



document.addEventListener("keydown", evento => {

    if (evento.key !== "Escape") {
        return;
    }

    modais.forEach(modal => {

        if (modal.classList.contains("aberto")) {

            fecharModal(modal);

        }

    });

});




if (pesquisaCardapio) {

    pesquisaCardapio.addEventListener(
        "input",
        pesquisarCardapio
    );

}




function pesquisarCardapio() {

    const termo =
        pesquisaCardapio.value
            .toLowerCase()
            .trim();

    const secoes =
        document.querySelectorAll(".categoria-secao");

    secoes.forEach(secao => {

        const produtos =
            secao.querySelectorAll(".produto-card");

        let encontrou = false;

        produtos.forEach(produto => {

            const nome =
                produto
                    .querySelector("h3")
                    ?.textContent
                    .toLowerCase() || "";

            const descricao =
                produto
                    .querySelector("p")
                    ?.textContent
                    .toLowerCase() || "";

            const corresponde =
                nome.includes(termo) ||
                descricao.includes(termo);

            if (corresponde) {

                produto.style.display = "";

                encontrou = true;

            } else {

                produto.style.display = "none";

            }

        });




        if (termo === "") {

            secao.style.display = "";

        } else {

            secao.style.display =
                encontrou ? "" : "none";

        }

    });

}




campoPesquisasModal.forEach(input => {

    input.addEventListener("input", () => {

        pesquisarDentroModal(input);

    });

});





function pesquisarDentroModal(input) {

    const termo =
        input.value
            .toLowerCase()
            .trim();

    const modal =
        input.closest(".modal");

    if (!modal) return;


    const produtos =
        modal.querySelectorAll(".produto-modal");

    produtos.forEach(produto => {

        const nome =
            produto
                .querySelector("h4")
                ?.textContent
                .toLowerCase() || "";

        const descricao =
            produto
                .querySelector("p")
                ?.textContent
                .toLowerCase() || "";

        const corresponde =
            nome.includes(termo) ||
            descricao.includes(termo);

        produto.style.display =
            corresponde ? "" : "flex";

    });

}



atalhosCategorias.forEach(botao => {

    botao.addEventListener("click", () => {



        atalhosCategorias.forEach(item => {

            item.classList.remove("ativo");

        });

        botao.classList.add("ativo");



        const categoria =
            botao
                .querySelector("span")
                ?.textContent
                .toLowerCase();




        if (categoria === "todos") {

            document
                .querySelectorAll(".categoria-secao")
                .forEach(secao => {

                    secao.style.display = "";

                });

            return;

        }



        const mapaCategorias = {

            "bebidas": "bebidas",

            "pequeno-almoço":
                "pequeno-almoco",

            "lanches":
                "lanches",

            "refeições":
                "refeicoes",

            "sobremesas":
                "sobremesas",

            "pizzas":
                "pizzas"

        };


        const idCategoria =
            mapaCategorias[categoria];


        if (!idCategoria) {
            return;
        }




        document
            .querySelectorAll(".categoria-secao")
            .forEach(secao => {

                secao.style.display = "none";

            });



        const secao =
            document.getElementById(idCategoria);

        if (secao) {

            secao.style.display = "";

            secao.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});




botoesAdicionar.forEach(botao => {

    botao.addEventListener("click", () => {

        const produto =
            obterDadosProduto(botao);

        if (!produto) {
            return;
        }

        adicionarAoCarrinho(produto);

    });

});



function obterDadosProduto(botao) {

    const card =
        botao.closest(
            ".produto-card, .produto-modal"
        );

    if (!card) {
        return null;
    }


    const nomeElemento =
        card.querySelector("h3, h4");

    const descricaoElemento =
        card.querySelector("p");

    const precoElemento =
        card.querySelector("strong");

    const imagemElemento =
        card.querySelector("img");


    const nome =
        nomeElemento
            ? nomeElemento.textContent.trim()
            : "Produto";


    const descricao =
        descricaoElemento
            ? descricaoElemento.textContent.trim()
            : "";


    const preco =
        precoElemento
            ? precoElemento.textContent.trim()
            : "Preço não definido";


    const imagem =
        imagemElemento
            ? imagemElemento.getAttribute("src")
            : "";


    return {

        id: gerarIdProduto(nome),

        nome: nome,

        descricao: descricao,

        preco: preco,

        imagem: imagem,

        quantidade: 1

    };

}



function gerarIdProduto(nome) {

    return nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

}


function adicionarAoCarrinho(produto) {

    const produtoExistente =
        carrinho.find(item =>
            item.id === produto.id
        );


    if (produtoExistente) {

        produtoExistente.quantidade++;

    } else {

        carrinho.push(produto);

    }


    atualizarContadorCarrinho();

    mostrarProdutoAdicionado(produto);

}


function atualizarContadorCarrinho() {

    const contadores =
        document.querySelectorAll(
            ".contador-carrinho"
        );

    const quantidade =
        carrinho.reduce(
            (total, produto) =>
                total + produto.quantidade,
            0
        );


    contadores.forEach(contador => {

        contador.textContent = quantidade;

    });

}




function mostrarProdutoAdicionado(produto) {

    const mensagem =
        document.createElement("div");

    mensagem.className =
        "notificacao-carrinho";


    mensagem.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>

        <div>
            <strong>${produto.nome}</strong>
            <span>Adicionado ao carrinho</span>
        </div>
    `;


    document.body.appendChild(mensagem);


    setTimeout(() => {

        mensagem.classList.add("visivel");

    }, 20);


    setTimeout(() => {

        mensagem.classList.remove("visivel");

        setTimeout(() => {

            mensagem.remove();

        }, 300);

    }, 2500);

}



window.luYoshiCarrinho = {

    obter: function () {

        return carrinho;

    },

    adicionar: function (produto) {

        adicionarAoCarrinho(produto);

    },

    limpar: function () {

        carrinho = [];

        atualizarContadorCarrinho();

    }

};