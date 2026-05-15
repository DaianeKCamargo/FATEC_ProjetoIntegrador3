const model = require("../models/caps-registrationModel");
const axios = require("axios");
const MICROSERVICO_URL = process.env.MICROSERVICO_CONVERSAO_URL || "http://localhost:5506/converter";
const MICROSERVICO_CO2_URL = process.env.MICROSERVICO_CO2_URL || "http://localhost:5508/converter";
const FATOR_FALLBACK = 500; // Mesmo fator do microsserviço
const PESO_MEDIO_TAMPINHA_GRAMAS = Number(process.env.PESO_MEDIO_TAMPINHA_GRAMAS || 2);
const FATOR_CO2_KG_POR_KG = Number(process.env.FATOR_CO2_KG_POR_KG || 1.9);

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

async function converterTampinhasParaCo2Kg(tampinhas) {
    try {
        const response = await axios.post(MICROSERVICO_CO2_URL, { tampinhas }, { timeout: 5000 });
        return response.data.co2_evitado_kg;
    } catch (error) {
        console.warn(`⚠️ Erro ao chamar microsserviço de CO2: ${error.message}`);

        const massaKg = (tampinhas * PESO_MEDIO_TAMPINHA_GRAMAS) / 1000;
        return Number((massaKg * FATOR_CO2_KG_POR_KG).toFixed(6));
    }
}

// LISTAR
async function listar(req, res) {
    try {
        const lista = await model.listar();

        const convertida = await Promise.all(
            lista.map(async (item) => {
                const quantidade_tampinhas = await converterKgParaTampinhas(item.quantidadeKg);
                const quantidade_co2_reduzido = await converterTampinhasParaCo2Kg(quantidade_tampinhas);
                return {
                    ...item,
                    quantidade_tampinhas,
                    quantidade_co2_reduzido,
                };
            })
        );

        return res.json(convertida);
    } catch (error) {
        console.error("💥 ERRO em LISTAR:", error);
        return res.status(500).json({ message: "Erro ao listar registros" });
    }
}

// BUSCAR POR ID
async function buscarPorId(req, res) {
    try {
        const id = Number(req.params.id);
        const item = await model.buscarPorId(id);

        if (!item) {
            return res.status(404).json({
                message: "Registro de tampinhas nao encontrado"
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
        return res.status(500).json({ message: "Erro ao buscar registro" });
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
            message: "Erro ao criar registro de tampinhas"
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
                message: "Registro de tampinhas nao encontrado"
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
            message: "Erro ao atualizar registro de tampinhas"
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
                message: "Registro de tampinhas nao encontrado"
            });
        }

        return res.status(200).json({ message: "Registro de tampinhas removido com sucesso" });
    } catch (error) {
        console.error("💥 ERRO AO REMOVER:", error);
        return res.status(500).json({
            message: "Erro ao remover registro de tampinhas"
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