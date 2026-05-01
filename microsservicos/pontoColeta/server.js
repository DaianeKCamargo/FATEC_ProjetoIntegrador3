const express = require("express");
const app = express();

app.use(express.json());

const allowedStatus = ["PENDENTE", "APROVADO", "RECUSADO"];
let nextRequestId = 1;
let nextApprovedId = 1;
let requests = [];
let approvedPoints = [];

function normalizeAddress(address = {}) {
    return {
        street: address.street || "",
        number: address.number || "",
        complement: address.complement || null,
        district: address.district || "",
        city: address.city || "",
        postCode: address.postCode || "",
    };
}

function buildApprovedFromRequest(request) {
    return {
        idPcApproved: nextApprovedId++,
        sourceRequestId: request.idPc,
        approvedAt: new Date().toISOString(),
        opensPc: request.opensPc,
        nameUser: request.nameUser,
        linkPhoto: request.linkPhoto,
        cpfUser: request.cpfUser,
        cpnjPoint: request.cpnjPoint,
        emailUser: request.emailUser,
        celUser: request.celUser,
        namePoint: request.namePoint,
        hourInit: request.hourInit,
        hour: request.hour,
        address: request.address,
    };
}

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "ms-ponto-coleta" });
});

app.post("/api/pontos-coleta/requests", (req, res) => {
    const payload = req.body || {};

    const created = {
        idPc: nextRequestId++,
        status: "PENDENTE",
        createdAt: new Date().toISOString(),
        reviewedAt: null,
        reviewReason: null,
        approvedPointId: null,
        opensPc: payload.opensPc,
        nameUser: payload.nameUser,
        linkPhoto: payload.linkPhoto,
        cpfUser: payload.cpfUser,
        cpnjPoint: payload.cpnjPoint,
        emailUser: payload.emailUser,
        celUser: payload.celUser,
        namePoint: payload.namePoint,
        hourInit: payload.hourInit,
        hour: payload.hour,
        address: normalizeAddress(payload.address),
        approvedPoint: null,
    };

    requests.push(created);
    return res.status(201).json(created);
});

app.get("/api/pontos-coleta/requests", (req, res) => {
    const { status } = req.query;

    if (status && !allowedStatus.includes(status)) {
        return res
            .status(400)
            .json({ message: "status deve ser PENDENTE, APROVADO ou RECUSADO" });
    }

    const result = status
        ? requests.filter((item) => item.status === status)
        : requests;

    return res.status(200).json(result);
});

app.get("/api/pontos-coleta/requests/:id", (req, res) => {
    const id = Number(req.params.id);
    const item = requests.find((request) => request.idPc === id);

    if (!item) {
        return res
            .status(404)
            .json({ message: "Solicitacao de ponto de coleta nao encontrada" });
    }

    return res.status(200).json(item);
});

app.patch("/api/pontos-coleta/requests/:id", (req, res) => {
    const id = Number(req.params.id);
    const item = requests.find((request) => request.idPc === id);

    if (!item) {
        return res
            .status(404)
            .json({ message: "Solicitacao de ponto de coleta nao encontrada" });
    }

    if (item.status !== "PENDENTE") {
        return res.status(409).json({
            message: "Somente solicitacoes com status PENDENTE podem ser editadas",
        });
    }

    const updates = req.body || {};
    const hasData = Object.keys(updates).length > 0;
    if (!hasData) {
        return res.status(400).json({ message: "Informe ao menos um campo para atualizar" });
    }

    Object.assign(item, {
        opensPc: updates.opensPc ?? item.opensPc,
        nameUser: updates.nameUser ?? item.nameUser,
        linkPhoto: updates.linkPhoto ?? item.linkPhoto,
        cpfUser: updates.cpfUser ?? item.cpfUser,
        cpnjPoint: updates.cpnjPoint ?? item.cpnjPoint,
        emailUser: updates.emailUser ?? item.emailUser,
        celUser: updates.celUser ?? item.celUser,
        namePoint: updates.namePoint ?? item.namePoint,
        hourInit: updates.hourInit ?? item.hourInit,
        hour: updates.hour ?? item.hour,
        address: updates.address
            ? {
                ...item.address,
                ...normalizeAddress({ ...item.address, ...updates.address }),
            }
            : item.address,
    });

    return res.status(200).json(item);
});

app.patch("/api/pontos-coleta/requests/:id/review", (req, res) => {
    const id = Number(req.params.id);
    const { decision, reason } = req.body || {};
    const item = requests.find((request) => request.idPc === id);

    if (!item) {
        return res
            .status(404)
            .json({ message: "Solicitacao de ponto de coleta nao encontrada" });
    }

    if (item.status !== "PENDENTE") {
        return res
            .status(409)
            .json({ message: "Solicitacao ja revisada anteriormente" });
    }

    if (!["APPROVE", "REJECT"].includes(decision)) {
        return res
            .status(400)
            .json({ message: "decision deve ser APPROVE ou REJECT" });
    }

    item.reviewedAt = new Date().toISOString();
    item.reviewReason = reason || null;

    if (decision === "APPROVE") {
        const approved = buildApprovedFromRequest(item);
        approvedPoints.push(approved);
        item.status = "APROVADO";
        item.approvedPointId = approved.idPcApproved;
        item.approvedPoint = approved;
        return res.status(200).json({ reviewed: item, approved });
    }

    item.status = "RECUSADO";
    item.approvedPoint = null;
    return res.status(200).json({ reviewed: item, approved: null });
});

app.get("/api/pontos-coleta/approved", (req, res) => {
    return res.status(200).json(approvedPoints);
});

app.get("/admin/pontos-pendentes", (req, res) => {
    const pendentes = requests.filter((item) => item.status === "PENDENTE");
    res.json(pendentes);
});


app.put("/admin/aprovar/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const request = requests.find((item) => item.idPc === id);

    if (!request) {
        return res.status(404).json({ erro: "Ponto não encontrado" });
    }

    if (request.status !== "PENDENTE") {
        return res.status(409).json({ erro: "Solicitacao ja revisada" });
    }

    const approved = buildApprovedFromRequest(request);
    request.status = "APROVADO";
    request.reviewedAt = new Date().toISOString();
    request.reviewReason = req.body?.reason || null;
    request.approvedPointId = approved.idPcApproved;
    request.approvedPoint = approved;

    approvedPoints.push(approved);

    return res.json({ mensagem: "Ponto aprovado com sucesso", ponto: request });
});

app.get("/pontos-coleta", (req, res) => {
    res.json(approvedPoints);
});


app.get("/pontos-coleta/proximos", (req, res) => {

    const cidade = req.query.cidade;
    if (!cidade) {
        return res.status(400).json({ message: "cidade e obrigatoria" });
    }

    const resultados = approvedPoints.filter(
        (point) => String(point.address?.city || "").toLowerCase() === cidade.toLowerCase()
    );

    res.json(resultados);

});


const PORT = process.env.MS_PONTO_COLETA_PORT || 5501;

app.listen(PORT, () => {
    console.log(`Microservico rodando na porta ${PORT}`);
});