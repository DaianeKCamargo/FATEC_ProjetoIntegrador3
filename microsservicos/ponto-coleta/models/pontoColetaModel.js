const pontosColeta = [];
let nextId = 1;

function listar() {
    return pontosColeta;
}

function buscarPorId(id) {
    return pontosColeta.find((item) => item.id === id);
}

function criar(dados) {
    const novo = {
        id: nextId++,
        nomeEmpresa: dados.nomeEmpresa || "",
        endereco: dados.endereco || "",
        telefone: dados.telefone || "",
        status: dados.status || "pendente",
    };
    pontosColeta.push(novo);
    return novo;
}

function atualizar(id, dados) {
    const item = buscarPorId(id);
    if (!item) return null;

    item.nomeEmpresa = dados.nomeEmpresa ?? item.nomeEmpresa;
    item.endereco = dados.endereco ?? item.endereco;
    item.telefone = dados.telefone ?? item.telefone;
    item.status = dados.status ?? item.status;
    return item;
}

function remover(id) {
    const indice = pontosColeta.findIndex((item) => item.id === id);
    if (indice === -1) return false;

    pontosColeta.splice(indice, 1);
    return true;
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
};
