const model = require("../models/relatorio-tampinhasModels");

function listar(req, res) {
    return res.status(200).json(model.listar());
}

function buscarPorId(req, res) {
    const id = Number(req.params.id);
    const item = model.buscarPorId(id);

    if (!item) {
        return res
            .status(404)
            .json({ message: "Relatorio de tampinhas nao encontrado" });
    }

    return res.status(200).json(item);
}

function criar(req, res) {
    const { data, quantidadeKg } = req.body;
    if (!data || quantidadeKg === undefined) {
        return res
            .status(400)
            .json({ message: "data e quantidadeKg sao obrigatorios" });
    }

    const novo = model.criar(req.body);
    return res.status(201).json(novo);
}

function atualizar(req, res) {
    const id = Number(req.params.id);
    const atualizado = model.atualizar(id, req.body);

    if (!atualizado) {
        return res
            .status(404)
            .json({ message: "Relatorio de tampinhas nao encontrado" });
    }

    return res.status(200).json(atualizado);
}

function remover(req, res) {
    const id = Number(req.params.id);
    const removido = model.remover(id);

    if (!removido) {
        return res
            .status(404)
            .json({ message: "Relatorio de tampinhas nao encontrado" });
    }

    return res.status(204).send();
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
};
