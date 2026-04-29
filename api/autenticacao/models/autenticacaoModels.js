const credenciais = [];
let nextId = 1;

function listar() {
    return credenciais;
}

function buscarPorId(id) {
    return credenciais.find((item) => item.id === id);
}

function buscarPorUsuario(usuario) {
    return credenciais.find((item) => item.usuario === usuario);
}

function criar(dados) {
    const novo = {
        id: nextId++,
        usuario: dados.usuario || "",
        senha: dados.senha || "",
        ativo: dados.ativo ?? true,
    };
    credenciais.push(novo);
    return novo;
}

function atualizar(id, dados) {
    const item = buscarPorId(id);
    if (!item) return null;

    item.usuario = dados.usuario ?? item.usuario;
    item.senha = dados.senha ?? item.senha;
    item.ativo = dados.ativo ?? item.ativo;
    return item;
}

function remover(id) {
    const indice = credenciais.findIndex((item) => item.id === id);
    if (indice === -1) return false;

    credenciais.splice(indice, 1);
    return true;
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorUsuario,
    criar,
    atualizar,
    remover,
};
