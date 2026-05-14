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

    console.error("Erro no pontoColetaReviewController:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
}

async function revisarPontoColeta(req, res) {
    try {
        const { status, reason } = req.body || {};
        const id = req.params.id;

        // Validações
        if (!["APROVADO", "REJEITADO"].includes(status)) {
            return res.status(400).json({
                message: "Status invalido. Deve ser 'APROVADO' ou 'REJEITADO'"
            });
        }

        if (status === "REJEITADO" && !reason) {
            return res.status(400).json({
                message: "Motivo (reason) é obrigatório quando rejeitando"
            });
        }

        // Atualiza o status
        const result = await service.atualizarStatusPontoColeta(id, {
            status,
            reason: status === "REJEITADO" ? reason : null
        });

        return res.status(200).json({
            message: `Ponto de coleta ${status === "APROVADO" ? "aprovado" : "rejeitado"} com sucesso`,
            data: result,
        });
    } catch (error) {
        return handleError(res, error);
    }
}

module.exports = {
    revisarPontoColeta,
};
