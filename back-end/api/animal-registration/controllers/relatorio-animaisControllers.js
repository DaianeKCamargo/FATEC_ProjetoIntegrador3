const model = require("../models/relatorio-animaisModels");

async function listar(req, res) {
    try {
        const dados = await model.listar();
        return res.status(200).json(dados);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao listar relatorios" });
    }
}

async function buscarPorId(req, res) {
    try {
        const id = Number(req.params.id);
        const item = await model.buscarPorId(id);

        if (!item) {
            return res.status(404).json({ message: "Relatorio de animais nao encontrado" });
        }

        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar relatorio" });
    }
}

async function criar(req, res) {
    try {
        const { data, tipoAnimal, quantidade } = req.body;

        if (!data || !tipoAnimal || quantidade === undefined) {
            return res.status(400).json({
                message: "data, tipoAnimal e quantidade sao obrigatorios"
            });
        }

        const novo = await model.criar(req.body);
        return res.status(201).json(novo);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar relatorio" });
    }
}

async function atualizar(req, res) {
    try {
        const id = Number(req.params.id);
        const atualizado = await model.atualizar(id, req.body);

        return res.status(200).json(atualizado);
    } catch (error) {
        return res.status(404).json({ message: "Relatorio de animais nao encontrado" });
    }
}

async function remover(req, res) {
    try {
        const id = Number(req.params.id);
        await model.remover(id);

        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ message: "Relatorio de animais nao encontrado" });
    }
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
};