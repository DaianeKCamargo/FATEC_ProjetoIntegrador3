const {
    validateCreate,
    validateUpdate,
    validateStatus,
} = require("../validators/collection-pointValidator");
const repository = require("../models/collection-pointModel");

const baseUrl = (process.env.MS_PONTO_COLETA_URL || "http://localhost:5507").replace(
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


function validarCoordenadas(lat, lng) {
    if (
        typeof lat !== "number" ||
        typeof lng !== "number" ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
    ) {
        throw new HttpError(400, "Coordenadas inválidas");
    }
}

async function parseResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const message =
            (isJson && body && body.message) ||
            response.statusText ||
            "Erro no microsservico";

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

    
    validarCoordenadas(
        data.address.latitude,
        data.address.longitude
    );

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
        throw new HttpError(
            409,
            "Somente pontos com status PENDENTE podem ser editados"
        );
    }

    
    if (data.address) {
        const lat =
            data.address.latitude ?? current.address?.latitude;
        const lng =
            data.address.longitude ?? current.address?.longitude;

        validarCoordenadas(lat, lng);
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

    const result = await requestMs(`/api/collection-point/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
            status: data.status,
            reason: data.reason,
        }),
    });

    const updated = result?.data || result;

    return repository.updatePointStatus(id, {
        status: updated.status ?? data.status,
        rejectionReason:
            updated.rejectionReason ??
            (data.status === "REJEITADO" ? data.reason : null),
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