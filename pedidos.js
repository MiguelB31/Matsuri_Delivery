let listaPedidos = JSON.parse(localStorage.getItem("pedidos_matsuri")) || [];

listaPedidos = listaPedidos.filter(p => p && p.idpedidos !== undefined);
localStorage.setItem("pedidos_matsuri", JSON.stringify(listaPedidos));

function renderizarPedidos(filtro = "") {
    const container = document.getElementById("lista-pedidos");
    if (!container) return;

    container.innerHTML = "";

    const pedidosFiltrados = listaPedidos.filter(pedido => {
        const termo = filtro.toLowerCase();
        const bateNumero = String(pedido.idpedidos).includes(termo);
        const bateProduto = pedido.itens && pedido.itens.some(item => item.nome.toLowerCase().includes(termo));
        return bateNumero || bateProduto;
    });

    if (pedidosFiltrados.length === 0) {
        container.innerHTML = `<p class="vazio-msg">Nenhum pedido encontrado. Faça uma compra na aba Produtos!</p>`;
        return;
    }

    pedidosFiltrados.forEach((pedido, index) => {
        let classeStatus = "status-pendente";
        if (pedido.status_pedido === "Entregue") classeStatus = "status-entregue";
        if (pedido.status_pedido === "Cancelado") classeStatus = "status-cancelado";

        let itensHTML = "";
        if (pedido.itens) {
            pedido.itens.forEach(item => {
                itensHTML += `
                    <div class="item-comprado">
                        <img src="${item.img}" alt="${item.nome}">
                        <div>
                            <h4>${item.qtd}x ${item.nome}</h4>
                            <span>R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML += `
            <div class="card-pedido">
                <div class="cabecalho-pedido">
                    <div>
                        <h3>Pedido #${pedido.idpedidos}</h3>
                        <span class="data-pedido">Data: ${pedido.data_pedidos}</span>
                    </div>
                    <span class="badge-status ${classeStatus}">${pedido.status_pedido}</span>
                </div>

                <div class="itens-pedido">
                    ${itensHTML}
                </div>

                <div class="rodape-pedido">
                    <div class="acoes-status">
                        <button class="btn-status entregue" onclick="alterarStatusPedido(${index}, 'Entregue')">Marcar Entregue</button>
                        <button class="btn-status cancelar" onclick="alterarStatusPedido(${index}, 'Cancelado')">Cancelar Pedido</button>
                    </div>
                    <div class="total-pedido">
                        <span>Total Pago:</span>
                        <strong>R$ ${Number(pedido.valor_total).toFixed(2).replace('.', ',')}</strong>
                    </div>
                </div>
            </div>
        `;
    });
}

function alterarStatusPedido(index, novoStatus) {
    listaPedidos[index].status_pedido = novoStatus;
    localStorage.setItem("pedidos_matsuri", JSON.stringify(listaPedidos));
    renderizarPedidos();
}

function filtrarPedidos() {
    const termo = document.getElementById("busca-pedido").value;
    renderizarPedidos(termo);
}

window.addEventListener("load", () => renderizarPedidos());


listaPedidos = listaPedidos.filter(p => p && p.idpedidos !== undefined);
localStorage.setItem("pedidos_matsuri", JSON.stringify(listaPedidos));

function renderizarPedidos(filtro = "") {
    const container = document.getElementById("lista-pedidos");
    if (!container) return;

    container.innerHTML = "";

    const pedidosFiltrados = listaPedidos.filter(pedido => {
        const termo = filtro.toLowerCase();
        const bateNumero = String(pedido.idpedidos).includes(termo);
        const bateProduto = pedido.itens && pedido.itens.some(item => item.nome.toLowerCase().includes(termo));
        return bateNumero || bateProduto;
    });

    if (pedidosFiltrados.length === 0) {
        container.innerHTML = `<p class="vazio-msg">Nenhum pedido encontrado. Faça uma compra na aba Produtos!</p>`;
        return;
    }

    pedidosFiltrados.forEach((pedido, index) => {
        let classeStatus = "status-pendente";
        if (pedido.status_pedido === "Entregue") classeStatus = "status-entregue";
        if (pedido.status_pedido === "Cancelado") classeStatus = "status-cancelado";

        let itensHTML = "";
        if (pedido.itens) {
            pedido.itens.forEach(item => {
                itensHTML += `
                    <div class="item-comprado">
                        <img src="${item.img}" alt="${item.nome}">
                        <div>
                            <h4>${item.qtd}x ${item.nome}</h4>
                            <span>R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML += `
            <div class="card-pedido">
                <div class="cabecalho-pedido">
                    <div>
                        <h3>Pedido #${pedido.idpedidos}</h3>
                        <span class="data-pedido">Data: ${pedido.data_pedidos}</span>
                    </div>
                    <span class="badge-status ${classeStatus}">${pedido.status_pedido}</span>
                </div>

                <div class="itens-pedido">
                    ${itensHTML}
                </div>

                <div class="rodape-pedido">
                    <div class="acoes-status">
                        <button class="btn-status entregue" onclick="alterarStatusPedido(${index}, 'Entregue')">Marcar Entregue</button>
                        <button class="btn-status cancelar" onclick="alterarStatusPedido(${index}, 'Cancelado')">Cancelar Pedido</button>
                        <button class="btn-status excluir" onclick="excluirPedido(${index})"><i class="fa-solid fa-trash"></i> Excluir</button>
                    </div>
                    <div class="total-pedido">
                        <span>Total Pago:</span>
                        <strong>R$ ${Number(pedido.valor_total).toFixed(2).replace('.', ',')}</strong>
                    </div>
                </div>
            </div>
        `;
    });
}

function alterarStatusPedido(index, novoStatus) {
    listaPedidos[index].status_pedido = novoStatus;
    localStorage.setItem("pedidos_matsuri", JSON.stringify(listaPedidos));
    renderizarPedidos();
}


function excluirPedido(index) {
    if (confirm("Tem certeza que deseja excluir este pedido do histórico?")) {
        listaPedidos.splice(index, 1);
        localStorage.setItem("pedidos_matsuri", JSON.stringify(listaPedidos));
        renderizarPedidos();
    }
}

function filtrarPedidos() {
    const termo = document.getElementById("busca-pedido").value;
    renderizarPedidos(termo);
}

window.addEventListener("load", () => renderizarPedidos());