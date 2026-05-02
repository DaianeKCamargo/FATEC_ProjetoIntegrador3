const {
    validateCreate,
    validateUpdate,
    validateStatus,
} = require("../validators/pontoColetaValidator");
const repository = require("../models/pontoColetaModel");

const baseUrl = (process.env.MS_PONTO_COLETA_URL || "http://localhost:5501").replace(
    /\/$/,
    ""
);

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
            (isJson && body && body.message) || response.statusText || "Erro no microsservico";
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

        throw new HttpError(503, "Nao foi possivel conectar ao microsservico de status");
    }
}

async function criarPontoColeta(payload) {
    const data = validateCreate(payload);

    const duplicateCpf = await repository.findPointByCpf(data.cpfUser);
    if (duplicateCpf) {
        throw new HttpError(409, "cpfUser ja cadastrado");
    }

    const duplicateCnpj = await repository.findPointByCnpj(data.cnpjPoint);
    if (duplicateCnpj) {
        throw new HttpError(409, "cnpjPoint ja cadastrado");
    }

    return repository.createPoint(data);
}

async function listarPontosColeta(filters = {}) {
    return repository.listPoints(filters);
}

async function buscarPontoColetaPorId(rawId) {
    const id = toIntId(rawId);
    const point = await repository.findPointById(id);

    if (!point) {
        throw new HttpError(404, "Ponto de coleta nao encontrado");
    }

    return point;
}

async function atualizarPontoColeta(rawId, payload) {
    const id = toIntId(rawId);
    const data = validateUpdate(payload);
    const current = await repository.findPointById(id);

    if (!current) {
        throw new HttpError(404, "Ponto de coleta nao encontrado");
    }

    if (current.status !== "PENDENTE") {
        throw new HttpError(409, "Somente pontos com status PENDENTE podem ser editados");
    }

    return repository.updatePoint(id, data);
}

async function removerPontoColeta(rawId) {
    const id = toIntId(rawId);
    const current = await repository.findPointById(id);

    if (!current) {
        throw new HttpError(404, "Ponto de coleta nao encontrado");
    }

    await repository.deletePoint(id);
    return { message: "Ponto de coleta removido com sucesso" };
}

async function atualizarStatusPontoColeta(rawId, payload) {
    const id = toIntId(rawId);
    const data = validateStatus({
        status: payload.status,
        reason: payload.reason ?? payload.rejectionReason,
    });

    return requestMs(`/api/pontos-coleta/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
            status: data.status,
            reason: data.reason,
        }),
    });
}

async function listarPontosAprovados(filters = {}) {
    return repository.listApprovedPoints(filters);
}

module.exports = {
    HttpError,
    criarPontoColeta,
    listarPontosColeta,
    buscarPontoColetaPorId,
    atualizarPontoColeta,
    removerPontoColeta,
    atualizarStatusPontoColeta,
    listarPontosAprovados,
};
