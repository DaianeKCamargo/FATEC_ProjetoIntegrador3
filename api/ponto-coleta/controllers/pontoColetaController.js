const { ZodError } = require("zod");
const service = require("../services/pontoColetaService");

// Função auxiliar para tratamento de erros
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

async function criarSolicitacao(req, res) {
    try {
        const created = await service.criarSolicitacao(req.body);
        return res.status(201).json(created);
    } catch (error) {
        return handleError(res, error);
    }
}

async function listarSolicitacoes(req, res) {
    try {
        const items = await service.listarSolicitacoes(req.query.status);
        return res.status(200).json(items);
    } catch (error) {
        return handleError(res, error);
    }
}

async function buscarSolicitacaoPorId(req, res) {
    try {
        const item = await service.buscarSolicitacaoPorId(req.params.id);
        return res.status(200).json(item);
    } catch (error) {
        return handleError(res, error);
    }
}

async function atualizarSolicitacao(req, res) {
    try {
        const updated = await service.atualizarSolicitacao(req.params.id, req.body);
        return res.status(200).json(updated);
    } catch (error) {
        return handleError(res, error);
    }
}

async function revisarSolicitacao(req, res) {
    try {
        const result = await service.revisarSolicitacao(req.params.id, req.body);
        return res.status(200).json(result);
    } catch (error) {
        return handleError(res, error);
    }
}

async function listarAprovados(req, res) {
    try {
        const items = await service.listarAprovados();
        return res.status(200).json(items);
    } catch (error) {
        return handleError(res, error);
    }
}

module.exports = {
    criarSolicitacao,
    listarSolicitacoes,
    buscarSolicitacaoPorId,
    atualizarSolicitacao,
    revisarSolicitacao,
    listarAprovados,
};
