const model = require("../models/autenticacaoModels");

function listar(req, res) {
    return res.status(200).json(model.listar());
}

function buscarPorId(req, res) {
    const id = Number(req.params.id);
    const item = model.buscarPorId(id);

    if (!item) {
        return res.status(404).json({ message: "Credencial nao encontrada" });
    }

    return res.status(200).json(item);
}

function criar(req, res) {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) {
        return res.status(400).json({ message: "usuario e senha sao obrigatorios" });
    }

    if (model.buscarPorUsuario(usuario)) {
        return res.status(409).json({ message: "usuario ja cadastrado" });
    }

    const novo = model.criar(req.body);
    return res.status(201).json(novo);
}

function atualizar(req, res) {
    const id = Number(req.params.id);
    const atualizado = model.atualizar(id, req.body);

    if (!atualizado) {
        return res.status(404).json({ message: "Credencial nao encontrada" });
    }

    return res.status(200).json(atualizado);
}

function remover(req, res) {
    const id = Number(req.params.id);
    const removido = model.remover(id);

    if (!removido) {
        return res.status(404).json({ message: "Credencial nao encontrada" });
    }

    return res.status(204).send();
}

function login(req, res) {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) {
        return res.status(400).json({ message: "usuario e senha sao obrigatorios" });
    }

    const credencial = model.buscarPorUsuario(usuario);
    if (!credencial || credencial.senha !== senha || credencial.ativo === false) {
        return res.status(401).json({ message: "Credenciais invalidas" });
    }

    return res.status(200).json({ message: "Login realizado com sucesso" });
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
    login,
};
