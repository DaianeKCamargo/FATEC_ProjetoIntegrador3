const express = require("express");
const app = express();
const prisma = require("./lib/prismaClient");

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "ms-ponto-coleta" });
});

app.get("/api/collection-point/approved", async (req, res) => {
    try {
        const points = await prisma.pointCollection.findMany({
            where: { status: "APROVADO" },
            include: { address: true },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json(points);
    } catch (err) {
        console.error('Erro ao buscar pontos aprovados:', err);
        return res.status(500).json({ message: 'Erro interno ao listar aprovados', error: err.message });
    }
});

app.patch("/api/collection-point/:id/status", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body || {};
        const reason = req.body?.reason ?? req.body?.rejectionReason;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: "ID invalido" });
        }

        if (!["APROVADO", "REJEITADO"].includes(status)) {
            return res.status(400).json({ message: "status deve ser APROVADO ou REJEITADO" });
        }

        if (status === "REJEITADO" && !reason) {
            return res.status(400).json({ message: "reason e obrigatorio quando o status for REJEITADO" });
        }

        const current = await prisma.pointCollection.findUnique({ where: { idPc: id } });
        if (!current) {
            return res.status(404).json({ message: "Ponto de coleta nao encontrado" });
        }

        const updated = await prisma.pointCollection.update({
            where: { idPc: id },
            data: {
                status,
                rejectionReason: status === "REJEITADO" ? reason : null,
            },
            include: { address: true },
        });

        return res.status(200).json({
            message: `Status atualizado para ${status}`,
            reason: reason || null,
            data: updated,
        });
    } catch (err) {
        console.error('Erro ao atualizar status do ponto:', err);
        return res.status(500).json({ message: 'Erro interno ao atualizar status', error: err.message });
    }
});

const PORT = process.env.MS_PONTO_COLETA_PORT || 5507;

app.listen(PORT, () => {
    console.log(`Microservico rodando na porta ${PORT}`);
});

module.exports = app;
