const { ZodError } = require("zod");
const service = require("../services/pontoColetaService");

function handleError(res, error) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            message: "Dados invalidos",
            errors: error.errors.map((item) => ({
                field: item.path.join("."),
                message: item.message,
            })),
        });
    }

    if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
    }

    console.error("Erro no pontoColetaController:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
}

async function criarPontoColeta(req, res) {
    try {
        const created = await service.criarPontoColeta(req.body);
        return res.status(201).json(created);
    } catch (error) {
        return handleError(res, error);
    }
}

async function listarPontosColeta(req, res) {
    try {
        const items = await service.listarPontosColeta(req.query);
        return res.status(200).json(items);
    } catch (error) {
        return handleError(res, error);
    }
}

async function buscarPontoColetaPorId(req, res) {
    try {
        const item = await service.buscarPontoColetaPorId(req.params.id);
        return res.status(200).json(item);
    } catch (error) {
        return handleError(res, error);
    }
}

async function atualizarPontoColeta(req, res) {
    try {
        const updated = await service.atualizarPontoColeta(req.params.id, req.body);
        return res.status(200).json(updated);
    } catch (error) {
        return handleError(res, error);
    }
}

async function removerPontoColeta(req, res) {
    try {
        const result = await service.removerPontoColeta(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        return handleError(res, error);
    }
}

async function atualizarStatusPontoColeta(req, res) {
    try {
        const result = await service.atualizarStatusPontoColeta(req.params.id, req.body);
        return res.status(200).json(result);
    } catch (error) {
        return handleError(res, error);
    }
}

async function listarPontosAprovados(req, res) {
    try {
        const items = await service.listarPontosAprovados(req.query);
        return res.status(200).json(items);
    } catch (error) {
        return handleError(res, error);
    }
}

module.exports = {
    criarPontoColeta,
    listarPontosColeta,
    buscarPontoColetaPorId,
    atualizarPontoColeta,
    removerPontoColeta,
    atualizarStatusPontoColeta,
    listarPontosAprovados,
};
