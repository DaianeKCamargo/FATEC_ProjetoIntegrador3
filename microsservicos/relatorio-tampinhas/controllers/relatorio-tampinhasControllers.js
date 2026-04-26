const model = require("../models/relatorio-tampinhasModels");

// regra de negócio (pode virar config depois)
const FATOR_TAMPINHAS_POR_KG = 160;

function listar(req, res) {
    const lista = model.listar();

    const convertida = lista.map(item => ({
        ...item,
        peso_gramas: item.quantidadeKg * 1000,
        quantidade_tampinhas: Math.round(item.quantidadeKg * FATOR_TAMPINHAS_POR_KG)
    }));

    return res.status(200).json(convertida);
}

function buscarPorId(req, res) {
    const id = Number(req.params.id);
    const item = model.buscarPorId(id);

    if (!item) {
        return res
            .status(404)
            .json({ message: "Relatorio de tampinhas nao encontrado" });
    }

    const convertido = {
        ...item,
        peso_gramas: item.quantidadeKg * 1000,
        quantidade_tampinhas: Math.round(item.quantidadeKg * FATOR_TAMPINHAS_POR_KG)
    };

    return res.status(200).json(convertido);
}

function criar(req, res) {
    const { data, quantidadeKg } = req.body;

    if (!data || quantidadeKg === undefined || quantidadeKg <= 0) {
        return res.status(400).json({
            message: "data e quantidadeKg válidos são obrigatórios"
        });
    }

    const novo = model.criar(req.body);
    return res.status(201).json(novo);
}

function atualizar(req, res) {
    const id = Number(req.params.id);
    const { quantidadeKg } = req.body;

    if (quantidadeKg !== undefined && quantidadeKg <= 0) {
        return res.status(400).json({
            message: "quantidadeKg deve ser maior que zero"
        });
    }

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