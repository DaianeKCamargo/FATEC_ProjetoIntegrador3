const model = require("../models/caps-registrationModels");
const axios = require("axios");
const MICROSERVICO_URL = process.env.MICROSERVICO_CONVERSAO_URL || "http://localhost:5506/converter";
const FATOR_FALLBACK = 500; // Mesmo fator do microsserviço

// Função auxiliar para converter via microsserviço
async function converterKgParaTampinhas(kg) {
    try {
        const response = await axios.post(MICROSERVICO_URL, { kg }, { timeout: 5000 });
        return response.data.quantidade_tampinhas;
    } catch (error) {
        console.warn(`⚠️ Erro ao chamar microsserviço: ${error.message}`);
        // Fallback: usa mesmo fator do microsserviço
        return Math.round(kg * FATOR_FALLBACK);
    }
}

// LISTAR
async function listar(req, res) {
    try {
        const lista = await model.listar();

        const convertida = await Promise.all(
            lista.map(async (item) => {
                const quantidade_tampinhas = await converterKgParaTampinhas(item.quantidadeKg);
                return {
                    ...item,
                    quantidade_tampinhas
                };
            })
        );

        return res.json(convertida);
    } catch (error) {
        console.error("💥 ERRO em LISTAR:", error);
        return res.status(500).json({ message: "Erro ao listar relatórios" });
    }
}

// BUSCAR POR ID
async function buscarPorId(req, res) {
    try {
        const id = Number(req.params.id);
        const item = await model.buscarPorId(id);

        if (!item) {
            return res.status(404).json({
                message: "Relatorio de tampinhas nao encontrado"
            });
        }

        const quantidade_tampinhas = await converterKgParaTampinhas(item.quantidadeKg);

        const convertido = {
            ...item,
            quantidade_tampinhas
        };

        return res.status(200).json(convertido);
    } catch (error) {
        console.error("💥 ERRO em BUSCAR POR ID:", error);
        return res.status(500).json({ message: "Erro ao buscar relatório" });
    }
}

// CRIAR
async function criar(req, res) {
    try {
        const { data, quantidadeKg } = req.body;

        if (quantidadeKg === undefined || quantidadeKg <= 0) {
            return res.status(400).json({
                message: "quantidadeKg válida é obrigatória"
            });
        }

        // Valida conversão com microsserviço
        const quantidade_tampinhas = await converterKgParaTampinhas(quantidadeKg);

        const novo = await model.criar(req.body);

        return res.status(201).json({
            ...novo,
            quantidade_tampinhas
        });

    } catch (error) {
        console.error("💥 ERRO AO CRIAR:", error);
        return res.status(500).json({
            message: "Erro ao criar relatório"
        });
    }
}

// ATUALIZAR
async function atualizar(req, res) {
    try {
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

        // Se foi atualizada a quantidade, converte com microsserviço
        let quantidade_tampinhas = null;
        if (quantidadeKg !== undefined) {
            quantidade_tampinhas = await converterKgParaTampinhas(quantidadeKg);
        }

        return res.status(200).json({
            ...atualizado,
            ...(quantidade_tampinhas && { quantidade_tampinhas })
        });
    } catch (error) {
        console.error("💥 ERRO AO ATUALIZAR:", error);
        return res.status(500).json({
            message: "Erro ao atualizar relatório"
        });
    }
}

// REMOVER
async function remover(req, res) {
    try {
        const id = Number(req.params.id);
        const removido = await model.remover(id);

        if (!removido) {
            return res.status(404).json({
                message: "Relatorio de tampinhas nao encontrado"
            });
        }

        return res.status(204).send();
    } catch (error) {
        console.error("💥 ERRO AO REMOVER:", error);
        return res.status(500).json({
            message: "Erro ao remover relatório"
        });
    }
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
};