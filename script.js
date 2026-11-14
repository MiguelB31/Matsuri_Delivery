function carregarTemaSalvo() {
    const mudarTema = document.getElementById("tema");
    const temaSalvo = localStorage.getItem("tema"); 


    if (temaSalvo == "escuro") {
        mudarTema.checked = false;
    } else if (temaSalvo == "claro") {
        mudarTema.checked = true;
    }
    trocaDeTema();
}


function trocaDeTema(){
    const mudarTema = document.getElementById("tema");
    document.body.classList.toggle("claro", mudarTema.checked);
    
    const logo = document.getElementById("logo");
    if(mudarTema.checked){
        logo.src = "img/claro/download-removebg-preview 1.png"; 
        localStorage.setItem("tema", "claro"); 
    }
    else{
        logo.src = "img/escuro/Inserir_um_título_2_-removebg-preview 1 (1).png"; 
        localStorage.setItem("tema", "escuro"); 
    }
}
window.addEventListener("load", carregarTemaSalvo);



function mascara_telefone() {
    var tel_formatado = document.getElementById("telefone").value;
    tel_formatado = tel_formatado.replace(/[^0-9() \-]+/g, '');
    document.getElementById("telefone").value = tel_formatado;

  
    if (tel_formatado[0] !== "(") {
        if (tel_formatado[0] !== undefined) {
            document.getElementById("telefone").value = "(" + tel_formatado[0];
        }
    }

    if (tel_formatado[1] !== "3") {
        if (tel_formatado[1] !== undefined) {
            document.getElementById("telefone").value = tel_formatado.slice(0,1) + "3" + tel_formatado[1];
        }
    }
    if (tel_formatado[2] !== "1") {
        if (tel_formatado[2] !== undefined) {
            document.getElementById("telefone").value = tel_formatado.slice(0,2) + "1" + tel_formatado[2];
        }
    }

    if (tel_formatado[3] !== ")") {
        if (tel_formatado[3] !== undefined) {
            document.getElementById("telefone").value = tel_formatado.slice(0,3) + ") " + tel_formatado[3];
        }
    }

    if (tel_formatado[10] !== "-") {
        if (tel_formatado[10] !== undefined) {
            document.getElementById("telefone").value = tel_formatado.slice(0,10) + "-" + tel_formatado[10];
        }
    }
}

function mascara_cpf(){
    var cpf_formatado = document.getElementById("cpf").value;
    cpf_formatado = cpf_formatado.replace(/[^0-9.\-]+/g, ''); 
    document.getElementById("cpf").value = cpf_formatado;


    if (cpf_formatado[3]!="."){
        if(cpf_formatado[3]!=undefined){
            document.getElementById("cpf").value=cpf_formatado.slice(0,3)+"."+cpf_formatado[3];
        }
    }
   
    if (cpf_formatado[7]!="."){
        if(cpf_formatado[7]!=undefined){
            document.getElementById("cpf").value=cpf_formatado.slice(0,7)+"."+cpf_formatado[7];
        }
    }

    if (cpf_formatado[11]!="-"){
        if(cpf_formatado[11]!=undefined){
            document.getElementById("cpf").value=cpf_formatado.slice(0,11)+"-"+cpf_formatado[11];
        }
    }
}

// Carrega o carrinho salvo no navegador ou cria uma lista vazia se não tiver nada
let carrinho = JSON.parse(localStorage.getItem("carrinho_matsuri")) || [];

// Abre e fecha a aba lateral do carrinho
function toggleCarrinho() {
    var carrinhoAba = document.getElementById("carrinho-aba");
    carrinhoAba.classList.toggle("ativo");
}

// Configura o clique em todos os botões de "Adicionar" dos produtos
function iniciarCarrinho() {
    const botoesAdicionar = document.querySelectorAll(".btn_adicionar");

    botoesAdicionar.forEach((botao) => {
        botao.addEventListener("click", function (evento) {
            evento.preventDefault(); // Evita que o botão recarregue a página ou siga algum link
          
            // Verifica se o usuário está logado antes de deixar colocar algo no carrinho
            const estaLogado = localStorage.getItem("usuario_logado");

            if (estaLogado !== "true") {
                alert("Você precisa criar uma conta ou fazer login antes de adicionar produtos ao carrinho!");
                window.location.href = "cadastro.html"; // Manda direto para a tela de cadastro
                return; // Para a função aqui para não adicionar o item
            }

            // Pega o card do produto clicado e extrai nome, preço e imagem
            const card = this.closest(".produto");
            const nome = card.querySelector(".nome_produto").innerText;
            const precoTexto = card.querySelector(".preco").innerText;
            const img = card.querySelector(".img img").getAttribute("src");

            // Limpa o "R$" e troca vírgula por ponto para transformar o preço em número
            const preco = parseFloat(precoTexto.replace("R$", "").replace(".", "").replace(",", ".").trim());

            adicionarProduto(nome, preco, img); // Manda o produto para o carrinho
        });
    });

    atualizarCarrinho(); // Desenha os itens salvos assim que a página abre
}

// Coloca o produto na lista do carrinho (se já existir, só aumenta a quantidade)
function adicionarProduto(nome, preco, img) {
    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.qtd += 1;
    } else {
        carrinho.push({ nome: nome, preco: preco, img: img, qtd: 1 });
    }

    salvarCarrinho();
    document.getElementById("carrinho-aba").classList.add("ativo"); // Abre o carrinho automaticamente
}

// Aumenta ou diminui a quantidade pelos botões + e -
function mudarQuantidade(index, valor) {
    carrinho[index].qtd += valor;
    if (carrinho[index].qtd <= 0) {
        carrinho.splice(index, 1); // Remove o produto se a quantidade zerar
    }
    salvarCarrinho();
}

// Remove o item direto quando clica na lixeira
function removerProduto(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
}

// Salva a lista atualizada do carrinho no localStorage e atualiza a tela
function salvarCarrinho() {
    localStorage.setItem("carrinho_matsuri", JSON.stringify(carrinho));
    atualizarCarrinho();
}

// Monta o HTML dos itens dentro do carrinho e calcula subtotal, frete e total
function atualizarCarrinho() {
    const container = document.querySelector(".conteudo-carrinho");
    const resumo = document.getElementById("resumo-valores");
    if (!container) return;

    container.innerHTML = ""; // Limpa a área antes de desenhar de novo

    // Se não tiver nada no carrinho, mostra mensagem de vazio e esconde os valores
    if (carrinho.length === 0) {
        container.innerHTML = "<p>Seu carrinho está vazio.</p>";
        if (resumo) resumo.style.display = "none";
        return;
    }

    if (resumo) resumo.style.display = "flex";
    let subtotal = 0;

    // Cria o card de cada item no carrinho e soma os preços
    carrinho.forEach((item, index) => {
        subtotal += item.preco * item.qtd;

        container.innerHTML += `
            <div class="item-carrinho">
                <img src="${item.img}" alt="${item.nome}">
                <div class="info-item">
                    <div class="topo-item">
                        <h4>${item.nome}</h4>
                        <span>R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div class="acoes-item">
                        <button class="btn-qtd" onclick="mudarQuantidade(${index}, -1)">-</button>
                        <span>${item.qtd}</span>
                        <button class="btn-qtd" onclick="mudarQuantidade(${index}, 1)">+</button>
                        <button class="btn-remover" onclick="removerProduto(${index})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    });

    const frete = 12.00;
    const total = subtotal + frete;

    // Mostra os valores formatados com R$ e vírgula
    document.getElementById("subtotal-carrinho").innerText = "R$ " + subtotal.toFixed(2).replace('.', ',');
    document.getElementById("frete-carrinho").innerText = "R$ " + frete.toFixed(2).replace('.', ',');
    document.getElementById("total-carrinho").innerText = "R$ " + total.toFixed(2).replace('.', ',');
}

// Finaliza o pedido, salva no histórico, baixa o JSON pro C# e vai pra página de pedidos
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    // Calcula o valor total do pedido com o frete
    let subtotal = 0;
    carrinho.forEach(item => subtotal += item.preco * item.qtd);
    const frete = 12.00;
    const total = Number((subtotal + frete).toFixed(2));

    // Pega a data de hoje e formata em AAAA-MM-DD para o banco MySQL aceitar
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    const dataMySQL = `${ano}-${mes}-${dia}`;

    // Cria o objeto do pedido com os mesmos nomes das colunas do banco de dados
    const novoPedido = {
        idpedidos: Math.floor(1000 + Math.random() * 9000),
        status_pedido: "Pendente",
        valor_total: total,
        data_pedidos: dataMySQL,
        itens: carrinho
    };

    // Adiciona o pedido novo no histórico salvo no navegador
    let historicoPedidos = JSON.parse(localStorage.getItem("pedidos_matsuri")) || [];
    historicoPedidos = historicoPedidos.filter(p => p && p.idpedidos !== undefined);
    historicoPedidos.unshift(novoPedido);
    localStorage.setItem("pedidos_matsuri", JSON.stringify(historicoPedidos));

    // Filtra só os 4 campos que a tabela "pedidos" do C# precisa ler
    const listaParaCSharp = historicoPedidos.map(p => ({
        idpedidos: p.idpedidos,
        status_pedido: p.status_pedido,
        valor_total: p.valor_total,
        data_pedidos: p.data_pedidos
    }));

    // Gera e baixa automaticamente o arquivo pedidos.json para importar no C#
    const dadosJSON = JSON.stringify(listaParaCSharp, null, 2);
    const blob = new Blob([dadosJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const linkDownload = document.createElement("a");
    linkDownload.href = url;
    linkDownload.download = "pedidos.json";
    linkDownload.click();
    URL.revokeObjectURL(url);

    // Esvazia o carrinho e redireciona para a tela de pedidos feitos
    carrinho = [];
    salvarCarrinho();
    alert("Pedido #" + novoPedido.idpedidos + " finalizado com sucesso!");
    window.location.href = "pedidos.html";
}

window.addEventListener("load", iniciarCarrinho); // Inicia o carrinho quando a página termina de carregar


// Pega o envio do formulário de cadastro e salva os dados do usuário
const formCadastro = document.getElementById("form-cadastro");

if (formCadastro) {
    formCadastro.addEventListener("submit", function (evento) {
        evento.preventDefault(); // Evita o recarregamento padrão do formulário

        // Guarda todos os campos preenchidos em um objeto
        const dadosUsuario = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            cpf: document.getElementById("cpf").value,
            telefone: document.getElementById("telefone").value,
            senha: document.getElementById("senha").value
        };

        localStorage.setItem("usuario_matsuri", JSON.stringify(dadosUsuario)); // Salva o cadastro no navegador

        alert("Cadastro realizado com sucesso! Agora faça seu login.");

        window.location.href = "login.html"; // Manda para a tela de login
    });
}


// Confere usuário e senha na tela de login para liberar o acesso
const formLogin = document.getElementById("form-login");

if (formLogin) {
    formLogin.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const usuarioDigitado = document.getElementById("usuario").value;
        const senhaDigitada = document.getElementById("senha").value;
        const usuarioSalvo = JSON.parse(localStorage.getItem("usuario_matsuri"));

        // Compara o que foi digitado com o cadastro salvo
        if (usuarioSalvo && usuarioDigitado === usuarioSalvo.nome && senhaDigitada === usuarioSalvo.senha) {
            localStorage.setItem("usuario_logado", "true"); // Marca que o usuário está logado
            
            // Limpa qualquer carrinho antigo antes de entrar na conta
            localStorage.removeItem("carrinho_matsuri");
            carrinho = [];

            alert("Login realizado com sucesso! Bem-vindo, " + usuarioSalvo.nome);
            window.location.href = "pos_login.html"; // Vai para a página inicial logada
        } else {
            alert("Usuário ou senha incorretos! Verifique seus dados ou crie uma conta.");
        }
    });
}

// Preenche o nome e e-mail na página de perfil se o usuário estiver logado
window.addEventListener("load", function () {
    const estaLogado = localStorage.getItem("usuario_logado"); 
    const usuarioSalvo = JSON.parse(localStorage.getItem("usuario_matsuri"));
    const campoNomePerfil = document.querySelector("h3#usuario");
    const campoEmailPerfil = document.getElementById("email_usuario");

    if (estaLogado === "true" && usuarioSalvo && campoNomePerfil && campoEmailPerfil) {
        campoNomePerfil.innerText = usuarioSalvo.nome;
        campoEmailPerfil.innerText = usuarioSalvo.email;
    }
});

// Apaga os dados da sessão, cadastro e carrinho quando o usuário clica em Sair
function sairDaConta() {
    localStorage.removeItem("usuario_logado"); // Tira o status de logado
    localStorage.removeItem("usuario_matsuri"); // Remove os dados do perfil anterior
    localStorage.removeItem("carrinho_matsuri"); // Limpa o carrinho
    carrinho = [];
    window.location.href = "index.html"; // Volta para a tela inicial
}