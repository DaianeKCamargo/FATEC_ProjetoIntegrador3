const {
    validateCreate,
    validateUpdate,
    validateStatus,
} = require("../validators/collection-pointValidator");
const repository = require("../models/collection-pointModel");

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

    const current = await repository.findPointById(id);

    if (!current) {
        throw new HttpError(404, "Ponto de coleta nao encontrado");
    }

    const data = validateStatus({
        status: payload.status,
        reason: payload.reason ?? payload.rejectionReason,
    });

    return repository.updatePointStatus(id, {
        status: data.status,
        rejectionReason:
            data.status === "REJEITADO" ? data.reason : null,
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
