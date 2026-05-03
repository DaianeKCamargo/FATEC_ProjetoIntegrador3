const model = require("../models/relatorio-tampinhasModels");
const axios = require("axios");
const MICROSERVICO_URL = "http://localhost:4000/converter";
const FATOR_TAMPINHAS_POR_KG = 160;

// LISTAR
async function listar(req, res) {
    const lista = await model.listar();

    const convertida = await Promise.all(
        lista.map(async (item) => {
            try {
                const response = await axios.post(MICROSERVICO_URL, {
                    kg: item.quantidadeKg
                });

                return {
                    ...item,
                    quantidade_tampinhas: response.data.quantidade_tampinhas
                };
            } catch (error) {
                // fallback (se microserviço cair)
                return {
                    ...item,
                    quantidade_tampinhas: Math.round(item.quantidadeKg * 160)
                };
            }
        })
    );

    return res.json(convertida);
}

// BUSCAR POR ID
async function buscarPorId(req, res) {
    const id = Number(req.params.id);
    const item = await model.buscarPorId(id);

    if (!item) {
        return res.status(404).json({
            message: "Relatorio de tampinhas nao encontrado"
        });
    }

    const convertido = {
        ...item,
        peso_gramas: item.quantidadeKg * 1000,
        quantidade_tampinhas: Math.round(item.quantidadeKg * FATOR_TAMPINHAS_POR_KG)
    };

    return res.status(200).json(convertido);
}

// CRIAR
async function criar(req, res) {
    const { data, quantidadeKg } = req.body;

    if (!data || quantidadeKg === undefined || quantidadeKg <= 0) {
        return res.status(400).json({
            message: "data e quantidadeKg válidos são obrigatórios"
        });
    }

    const novo = await model.criar(req.body);
    return res.status(201).json(novo);
}

// ATUALIZAR
async function atualizar(req, res) {
    const id = Number(req.params.id);
    const { quantidadeKg } = req.body;

    if (quantidadeKg !== undefined && quantidadeKg <= 0) {
        return res.status(400).json({
            message: "quantidadeKg deve ser maior que zero"
        });
    }

    const atualizado = await model.atualizar(id, req.body);

    if (!atualizado) {
        return res.status(404).json({
            message: "Relatorio de tampinhas nao encontrado"
        });
    }

    return res.status(200).json(atualizado);
}

// REMOVER
async function remover(req, res) {
    const id = Number(req.params.id);
    const removido = await model.remover(id);

    if (!removido) {
        return res.status(404).json({
            message: "Relatorio de tampinhas nao encontrado"
        });
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