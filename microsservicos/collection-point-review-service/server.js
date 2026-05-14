const express = require("express");
const app = express();
const prisma = require("./lib/prismaClient");

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "ms-review-ponto-coleta" });
});

// Revisar e atualizar status do ponto de coleta
app.patch("/api/pontos-coleta/:id/review", async (req, res) => {
    const id = Number(req.params.id);
    const { status, reason } = req.body || {};

    // Validações
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "ID invalido" });
    }

    if (!["APROVADO", "REJEITADO"].includes(status)) {
        return res.status(400).json({ message: "status deve ser APROVADO ou REJEITADO" });
    }

    if (status === "REJEITADO" && !reason) {
        return res.status(400).json({ message: "reason e obrigatorio quando o status for REJEITADO" });
    }

    try {
        // Verifica se o ponto de coleta existe
        const current = await prisma.pointCollection.findUnique({ 
            where: { idPc: id } 
        });

        if (!current) {
            return res.status(404).json({ message: "Ponto de coleta nao encontrado" });
        }

        // Atualiza o status
        const updated = await prisma.pointCollection.update({
            where: { idPc: id },
            data: { 
                status,
                reason: status === "REJEITADO" ? reason : null
            },
            include: { address: true },
        });

        return res.status(200).json({
            message: `Ponto de coleta ${status === "APROVADO" ? "aprovado" : "rejeitado"} com sucesso`,
            data: updated,
        });
    } catch (error) {
        console.error('Erro ao revisar ponto de coleta:', error);
        return res.status(500).json({ message: 'Erro interno ao revisar ponto de coleta' });
    }
});

const PORT = process.env.MS_PONTO_COLETA_PORT || 5501;

app.listen(PORT, () => {
    console.log(`Microservico rodando na porta ${PORT}`);
});

module.exports = app;
