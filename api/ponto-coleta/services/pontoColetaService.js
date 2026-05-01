const { notifyAdmin, notifyUser } = require("./notificacaoService");
const {
    validateCreate,
    validateUpdate,
    validateReview,
} = require("../validators/pontoColetaValidator");

const allowedStatus = ["PENDENTE", "APROVADO", "RECUSADO"];
const baseUrl = (
    process.env.MS_PONTO_COLETA_URL || "http://localhost:5501"
).replace(/\/$/, "");

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

async function parseResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const message =
            (isJson && body && body.message) ||
            response.statusText ||
            "Erro ao comunicar com o microservico";
        throw new HttpError(response.status, message);
    }

    return body;
}

async function requestMs(path, options = {}) {
    try {
        const response = await fetch(`${baseUrl}${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        });

        return parseResponse(response);
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }

        throw new HttpError(
            503,
            "Nao foi possivel conectar ao microservico de ponto de coleta"
        );
    }
}

async function criarSolicitacao(payload) {
    const data = validateCreate(payload);
    const created = await requestMs("/api/pontos-coleta/requests", {
        method: "POST",
        body: JSON.stringify(data),
    });

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

    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    return requestMs(`/api/pontos-coleta/requests${query}`);
}

async function buscarSolicitacaoPorId(rawId) {
    const id = toIntId(rawId);
    return requestMs(`/api/pontos-coleta/requests/${id}`);
}

async function atualizarSolicitacao(rawId, payload) {
    const id = toIntId(rawId);
    const data = validateUpdate(payload);

    return requestMs(`/api/pontos-coleta/requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

async function revisarSolicitacao(rawId, payload) {
    const id = toIntId(rawId);
    const review = validateReview(payload);
    const reviewedPayload = await requestMs(
        `/api/pontos-coleta/requests/${id}/review`,
        {
            method: "PATCH",
            body: JSON.stringify(review),
        }
    );

    if (review.decision === "APPROVE") {
        const approvedPayload = reviewedPayload;

        notifyAdmin("POINT_COLLECTION_APPROVED", approvedPayload.reviewed);
        notifyUser(
            approvedPayload.reviewed.emailUser,
            "Sua solicitacao foi APROVADA e movida para a base definitiva."
        );

        return approvedPayload;
    }

    const rejected = reviewedPayload.reviewed;

    notifyAdmin("POINT_COLLECTION_REJECTED", rejected);
    notifyUser(
        rejected.emailUser,
        `Sua solicitacao foi RECUSADA. Motivo: ${review.reason || "Nao informado"}`
    );

    return { reviewed: rejected, approved: null };
}

async function listarAprovados() {
    return requestMs("/api/pontos-coleta/approved");
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
