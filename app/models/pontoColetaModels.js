const pontosColeta = [];
let nextId = 1;

function listar() {
    return pontosColeta;
}

function buscarPorId(id) {
    return pontosColeta.find((item) => item.id === id);
}

function criar(dados) {
    const novoPonto = {
        id: nextId++,
        nomeEmpresa: dados.nomeEmpresa || "",
        endereco: dados.endereco || "",
        aprovado: Boolean(dados.aprovado),
    };
    pontosColeta.push(novoPonto);
    return novoPonto;
}

function atualizar(id, dados) {
    const ponto = buscarPorId(id);
    if (!ponto) return null;

    ponto.nomeEmpresa = dados.nomeEmpresa ?? ponto.nomeEmpresa;
    ponto.endereco = dados.endereco ?? ponto.endereco;
    ponto.aprovado = dados.aprovado ?? ponto.aprovado;
    return ponto;
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
