const relatoriosTampinhas = [];
let nextId = 1;

function listar() {
    return relatoriosTampinhas;
}

function buscarPorId(id) {
    return relatoriosTampinhas.find((item) => item.id === id);
}

function criar(dados) {
    const novo = {
        id: nextId++,
        data: dados.data || "",
        quantidadeKg: Number(dados.quantidadeKg || 0),
    };
    relatoriosTampinhas.push(novo);
    return novo;
}

function atualizar(id, dados) {
    const item = buscarPorId(id);
    if (!item) return null;

    item.data = dados.data ?? item.data;
    item.quantidadeKg = dados.quantidadeKg ?? item.quantidadeKg;
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
