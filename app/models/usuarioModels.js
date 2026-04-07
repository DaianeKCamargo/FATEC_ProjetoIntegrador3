const usuarios = [];
let nextId = 1;

function listar() {
    return usuarios;
}

function buscarPorId(id) {
    return usuarios.find((item) => item.id === id);
}

function criar(dados) {
    const novoUsuario = {
        id: nextId++,
        nome: dados.nome || "",
        email: dados.email || "",
    };
    usuarios.push(novoUsuario);
    return novoUsuario;
}

function atualizar(id, dados) {
    const usuario = buscarPorId(id);
    if (!usuario) return null;

    usuario.nome = dados.nome ?? usuario.nome;
    usuario.email = dados.email ?? usuario.email;
    return usuario;
}

function remover(id) {
    const indice = usuarios.findIndex((item) => item.id === id);
    if (indice === -1) return false;

    usuarios.splice(indice, 1);
    return true;
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
};
