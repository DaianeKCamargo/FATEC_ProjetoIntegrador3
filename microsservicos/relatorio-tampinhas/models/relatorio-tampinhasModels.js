const relatoriosTampinhas = [];
let nextId = 1;

function listar() {
    return relatoriosTampinhas;
}

function buscarPorId(id) {
    return relatoriosTampinhas.find((item) => item.id === id);
}

function criar(dados) {
    const quantidade = Number(dados.quantidadeKg);

    const novo = {
        id: nextId++,
        data: dados.data || new Date().toISOString().split("T")[0],
        quantidadeKg: isNaN(quantidade) ? 0 : quantidade,
    };

    relatoriosTampinhas.push(novo);
    return novo;
}

function atualizar(id, dados) {
    const item = buscarPorId(id);
    if (!item) return null;

    if (dados.data !== undefined) {
        item.data = dados.data;
    }

    if (dados.quantidadeKg !== undefined) {
        const novoValor = Number(dados.quantidadeKg);
        if (!isNaN(novoValor)) {
            item.quantidadeKg = novoValor;
        }
    }

    return item;
}

function remover(id) {
    const indice = relatoriosTampinhas.findIndex((item) => item.id === id);
    if (indice === -1) return false;

    relatoriosTampinhas.splice(indice, 1);
    return true;
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
};