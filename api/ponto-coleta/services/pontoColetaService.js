const model = require("../models/pontoColetaModel");
const { notifyAdmin, notifyUser } = require("./notificacaoService");
const {
    validateCreate,
    validateUpdate,
    validateReview,
} = require("../validators/pontoColetaValidator");

const allowedStatus = ["PENDENTE", "APROVADO", "RECUSADO"];

class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

function toIntId(value) {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        throw new HttpError(400, "ID invalido");
    }
    return id;
}

async function criarSolicitacao(payload) {
    const data = validateCreate(payload);
    const created = await model.createRequest(data);

    notifyAdmin("POINT_COLLECTION_CREATED", created);
    notifyUser(
        created.emailUser,
        "Sua solicitacao de ponto de coleta foi recebida com status PENDENTE."
    );

    return created;
}

async function listarSolicitacoes(status) {
    if (status && !allowedStatus.includes(status)) {
        throw new HttpError(400, "status deve ser PENDENTE, APROVADO ou RECUSADO");
    }
    return model.listRequests(status);
}

async function buscarSolicitacaoPorId(rawId) {
    const id = toIntId(rawId);
    const item = await model.findRequestById(id);

    if (!item) {
        throw new HttpError(404, "Solicitacao de ponto de coleta nao encontrada");
    }

    return item;
}

async function atualizarSolicitacao(rawId, payload) {
    const id = toIntId(rawId);
    const data = validateUpdate(payload);
    const atual = await model.findRequestById(id);

    if (!atual) {
        throw new HttpError(404, "Solicitacao de ponto de coleta nao encontrada");
    }

    if (atual.status !== "PENDENTE") {
        throw new HttpError(
            409,
            "Somente solicitacoes com status PENDENTE podem ser editadas"
        );
    }

    return model.updateRequest(id, data);
}

async function revisarSolicitacao(rawId, payload) {
    const id = toIntId(rawId);
    const review = validateReview(payload);
    const atual = await model.findRequestById(id);

    if (!atual) {
        throw new HttpError(404, "Solicitacao de ponto de coleta nao encontrada");
    }

    if (atual.status !== "PENDENTE") {
        throw new HttpError(409, "Solicitacao ja revisada anteriormente");
    }

    if (review.decision === "APPROVE") {
        const approvedPayload = await model.approveRequestTransaction(id, review.reason);

        notifyAdmin("POINT_COLLECTION_APPROVED", approvedPayload.reviewed);
        notifyUser(
            approvedPayload.reviewed.emailUser,
            "Sua solicitacao foi APROVADA e movida para a base definitiva."
        );

        return approvedPayload;
    }

    const rejected = await model.rejectRequestTransaction(id, review.reason);

    notifyAdmin("POINT_COLLECTION_REJECTED", rejected);
    notifyUser(
        rejected.emailUser,
        `Sua solicitacao foi RECUSADA. Motivo: ${review.reason || "Nao informado"}`
    );

    return { reviewed: rejected, approved: null };
}

async function listarAprovados() {
    return model.listApprovedPoints();
}

module.exports = {
    HttpError,
    criarSolicitacao,
    listarSolicitacoes,
    buscarSolicitacaoPorId,
    atualizarSolicitacao,
    revisarSolicitacao,
    listarAprovados,
};
