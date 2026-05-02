const express = require("express");
const app = express();
const prisma = require("./lib/prismaClient");

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "ms-ponto-coleta" });
});

app.get("/api/pontos-coleta", async (req, res) => {
    const { status } = req.query;
    const where = status ? { status } : undefined;

    const points = await prisma.pointCollection.findMany({
        where,
        include: { address: true },
        orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(points);
});

app.get("/api/pontos-coleta/approved", async (req, res) => {
    const points = await prisma.pointCollection.findMany({
        where: { status: "APROVADO" },
        include: { address: true },
        orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(points);
});

app.patch("/api/pontos-coleta/:id/status", async (req, res) => {
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
        data: { status },
        include: { address: true },
    });

    return res.status(200).json({
        message: `Status atualizado para ${status}`,
        reason: reason || null,
        data: updated,
    });
});

app.get("/api/pontos-coleta/proximos", async (req, res) => {
    const cidade = req.query.cidade;
    if (!cidade) {
        return res.status(400).json({ message: "cidade e obrigatoria" });
    }

    const resultados = await prisma.pointCollection.findMany({
        where: {
            status: "APROVADO",
            address: {
                city: {
                    equals: String(cidade),
                    mode: "insensitive",
                },
            },
        },
        include: { address: true },
        orderBy: { namePoint: "asc" },
    });

    res.json(resultados);
});

app.post("/api/pontos-coleta", async (req, res) => {
    const payload = req.body || {};
    try {
        const created = await prisma.pointCollection.create({
            data: {
                status: "PENDENTE",
                nameUser: payload.nameUser,
                cpfUser: payload.cpfUser,
                celUser: payload.celUser,
                emailUser: payload.emailUser,
                linkPhoto: payload.linkPhoto,
                namePoint: payload.namePoint,
                cnpjPoint: payload.cnpjPoint,
                opensDay: payload.opensDay,
                hourInit: payload.hourInit,
                hourFinal: payload.hourFinal,
                address: payload.address
                    ? {
                        create: {
                            street: payload.address.street,
                            number: payload.address.number,
                            complement: payload.address.complement || null,
                            district: payload.address.district,
                            city: payload.address.city,
                            postCode: payload.address.postCode,
                        },
                    }
                    : undefined,
            },
            include: { address: true },
        });

        return res.status(201).json(created);
    } catch (error) {
        if (error && error.code === 'P2002' && error.meta && error.meta.target) {
            const field = Array.isArray(error.meta.target) ? error.meta.target.join(', ') : error.meta.target;
            return res.status(409).json({ message: `Valor duplicado em campo unico: ${field}` });
        }
        console.error('Erro ao criar ponto de coleta:', error);
        return res.status(500).json({ message: 'Erro interno ao criar ponto de coleta' });
    }
});


// GET by ID (buscar um ponto específico)
app.get("/api/pontos-coleta/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "ID invalido" });
    }

    const point = await prisma.pointCollection.findUnique({
        where: { idPc: id },
        include: { address: true }
    });

    if (!point) {
        return res.status(404).json({ message: "Ponto de coleta nao encontrado" });
    }

    return res.status(200).json(point);
});

// PATCH by ID (atualizar dados do ponto)
app.patch("/api/pontos-coleta/:id", async (req, res) => {
    const id = Number(req.params.id);
    const payload = req.body || {};

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "ID invalido" });
    }

    const current = await prisma.pointCollection.findUnique({ where: { idPc: id } });
    if (!current) {
        return res.status(404).json({ message: "Ponto de coleta nao encontrado" });
    }

    try {
        const updated = await prisma.pointCollection.update({
            where: { idPc: id },
            data: {
                nameUser: payload.nameUser ?? current.nameUser,
                cpfUser: payload.cpfUser ?? current.cpfUser,
                celUser: payload.celUser ?? current.celUser,
                emailUser: payload.emailUser ?? current.emailUser,
                linkPhoto: payload.linkPhoto ?? current.linkPhoto,
                namePoint: payload.namePoint ?? current.namePoint,
                cnpjPoint: payload.cnpjPoint ?? current.cnpjPoint,
                opensDay: payload.opensDay ?? current.opensDay,
                hourInit: payload.hourInit ?? current.hourInit,
                hourFinal: payload.hourFinal ?? current.hourFinal,
                address: payload.address
                    ? {
                        update: {
                            street: payload.address.street ?? undefined,
                            number: payload.address.number ?? undefined,
                            complement: payload.address.complement ?? undefined,
                            district: payload.address.district ?? undefined,
                            city: payload.address.city ?? undefined,
                            postCode: payload.address.postCode ?? undefined,
                        }
                    }
                    : undefined,
            },
            include: { address: true }
        });

        return res.status(200).json({
            message: "Ponto de coleta atualizado com sucesso",
            data: updated
        });
    } catch (error) {
        console.error('Erro ao atualizar ponto de coleta:', error);
        return res.status(500).json({ message: 'Erro interno ao atualizar ponto de coleta' });
    }
});

const PORT = process.env.MS_PONTO_COLETA_PORT || 5501;

app.listen(PORT, () => {
    console.log(`Microservico rodando na porta ${PORT}`);
});

// Compatibility aliases (singular path) for older clients
app.get("/api/ponto-coleta", async (req, res) => {
    const { status } = req.query;
    const where = status ? { status } : undefined;

    const points = await prisma.pointCollection.findMany({
        where,
        include: { address: true },
        orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(points);
});

app.get("/api/ponto-coleta/approved", async (req, res) => {
    const points = await prisma.pointCollection.findMany({
        where: { status: "APROVADO" },
        include: { address: true },
        orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(points);
});

app.patch("/api/ponto-coleta/:id/status", async (req, res) => {
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
        data: { status },
        include: { address: true },
    });

    return res.status(200).json({
        message: `Status atualizado para ${status}`,
        reason: reason || null,
        data: updated,
    });
});

app.get("/api/ponto-coleta/proximos", async (req, res) => {
    const cidade = req.query.cidade;
    if (!cidade) {
        return res.status(400).json({ message: "cidade e obrigatoria" });
    }

    const resultados = await prisma.pointCollection.findMany({
        where: {
            status: "APROVADO",
            address: {
                city: {
                    equals: String(cidade),
                    mode: "insensitive",
                },
            },
        },
        include: { address: true },
        orderBy: { namePoint: "asc" },
    });

    res.json(resultados);
});

app.get("/api/ponto-coleta/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "ID invalido" });
    }

    const point = await prisma.pointCollection.findUnique({
        where: { idPc: id },
        include: { address: true }
    });

    if (!point) {
        return res.status(404).json({ message: "Ponto de coleta nao encontrado" });
    }

    return res.status(200).json(point);
});

app.patch("/api/ponto-coleta/:id", async (req, res) => {
    const id = Number(req.params.id);
    const payload = req.body || {};

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "ID invalido" });
    }

    const current = await prisma.pointCollection.findUnique({ where: { idPc: id } });
    if (!current) {
        return res.status(404).json({ message: "Ponto de coleta nao encontrado" });
    }

    try {
        const updated = await prisma.pointCollection.update({
            where: { idPc: id },
            data: {
                nameUser: payload.nameUser ?? current.nameUser,
                cpfUser: payload.cpfUser ?? current.cpfUser,
                celUser: payload.celUser ?? current.celUser,
                emailUser: payload.emailUser ?? current.emailUser,
                linkPhoto: payload.linkPhoto ?? current.linkPhoto,
                namePoint: payload.namePoint ?? current.namePoint,
                cnpjPoint: payload.cnpjPoint ?? current.cnpjPoint,
                opensDay: payload.opensDay ?? current.opensDay,
                hourInit: payload.hourInit ?? current.hourInit,
                hourFinal: payload.hourFinal ?? current.hourFinal,
                address: payload.address
                    ? {
                        update: {
                            street: payload.address.street ?? undefined,
                            number: payload.address.number ?? undefined,
                            complement: payload.address.complement ?? undefined,
                            district: payload.address.district ?? undefined,
                            city: payload.address.city ?? undefined,
                            postCode: payload.address.postCode ?? undefined,
                        }
                    }
                    : undefined,
            },
            include: { address: true }
        });

        return res.status(200).json({
            message: "Ponto de coleta atualizado com sucesso",
            data: updated
        });
    } catch (error) {
        console.error('Erro ao atualizar ponto de coleta:', error);
        return res.status(500).json({ message: 'Erro interno ao atualizar ponto de coleta' });
    }
});

app.post("/api/ponto-coleta", async (req, res) => {
    const payload = req.body || {};
    try {
        const created = await prisma.pointCollection.create({
            data: {
                status: "PENDENTE",
                nameUser: payload.nameUser,
                cpfUser: payload.cpfUser,
                celUser: payload.celUser,
                emailUser: payload.emailUser,
                linkPhoto: payload.linkPhoto,
                namePoint: payload.namePoint,
                cnpjPoint: payload.cnpjPoint,
                opensDay: payload.opensDay,
                hourInit: payload.hourInit,
                hourFinal: payload.hourFinal,
                address: payload.address
                    ? {
                        create: {
                            street: payload.address.street,
                            number: payload.address.number,
                            complement: payload.address.complement || null,
                            district: payload.address.district,
                            city: payload.address.city,
                            postCode: payload.address.postCode,
                        },
                    }
                    : undefined,
            },
            include: { address: true },
        });

        return res.status(201).json(created);
    } catch (error) {
        if (error && error.code === 'P2002' && error.meta && error.meta.target) {
            const field = Array.isArray(error.meta.target) ? error.meta.target.join(', ') : error.meta.target;
            return res.status(409).json({ message: `Valor duplicado em campo unico: ${field}` });
        }
        console.error('Erro ao criar ponto de coleta (singular):', error);
        return res.status(500).json({ message: 'Erro interno ao criar ponto de coleta' });
    }
});