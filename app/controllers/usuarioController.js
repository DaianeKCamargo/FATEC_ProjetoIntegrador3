const usuarioModel = require("../models/usuarioModels");

function listarUsuarios(req, res) {
    res.status(200).json(usuarioModel.listar());
}

function buscarUsuarioPorId(req, res) {
    const id = Number(req.params.id);
    const usuario = usuarioModel.buscarPorId(id);

    if (!usuario) {
        return res.status(404).json({ message: "Usuario nao encontrado" });
    }

    return res.status(200).json(usuario);
}

function criarUsuario(req, res) {
    const { nome, email } = req.body;
    if (!nome || !email) {
        return res.status(400).json({ message: "nome e email sao obrigatorios" });
    }

    const novoUsuario = usuarioModel.criar({ nome, email });
    return res.status(201).json(novoUsuario);
}

function atualizarUsuario(req, res) {
    const id = Number(req.params.id);
    const usuarioAtualizado = usuarioModel.atualizar(id, req.body);

    if (!usuarioAtualizado) {
        return res.status(404).json({ message: "Usuario nao encontrado" });
    }

    return res.status(200).json(usuarioAtualizado);
}

function removerUsuario(req, res) {
    const id = Number(req.params.id);
    const removido = usuarioModel.remover(id);

    if (!removido) {
        return res.status(404).json({ message: "Usuario nao encontrado" });
    }

    return res.status(204).send();
}

module.exports = {
    listarUsuarios,
    buscarUsuarioPorId,
    criarUsuario,
    atualizarUsuario,
    removerUsuario,
};
