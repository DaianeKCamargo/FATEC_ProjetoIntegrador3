const prisma = require("../lib/prismaClient");

const includePointRelations = {
    address: true,
};

async function createPoint(data) {
    return prisma.pointCollection.create({
        data: {
            nameUser: data.nameUser,
            cpfUser: data.cpfUser,
            celUser: data.celUser,
            emailUser: data.emailUser,
            linkPhoto: data.linkPhoto,
            namePoint: data.namePoint,
            cnpjPoint: data.cnpjPoint,
            opensDay: data.opensDay,
            hourInit: data.hourInit,
            hourFinal: data.hourFinal,
            address: {
                create: {
                    street: data.address.street,
                    number: data.address.number,
                    complement: data.address.complement || null,
                    district: data.address.district,
                    city: data.address.city,
                    postCode: data.address.postCode,
                },
            },
        },
        include: includePointRelations,
    });
}

async function listPoints(filters = {}) {
    const where = {};

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.namePoint) {
        where.namePoint = {
            contains: filters.namePoint,
            mode: "insensitive",
        };
    }

    if (filters.city) {
        where.address = {
            city: {
                contains: filters.city,
                mode: "insensitive",
            },
        };
    }

    return prisma.pointCollection.findMany({
        where,
        include: includePointRelations,
        orderBy: { createdAt: "desc" },
    });
}

async function findPointById(id) {
    return prisma.pointCollection.findUnique({
        where: { idPc: id },
        include: includePointRelations,
    });
}

async function findPointByCpf(cpfUser) {
    return prisma.pointCollection.findUnique({
        where: { cpfUser },
        include: includePointRelations,
    });
}

async function findPointByCnpj(cnpjPoint) {
    return prisma.pointCollection.findUnique({
        where: { cnpjPoint },
        include: includePointRelations,
    });
}

async function updatePoint(id, data) {
    const { address, ...rest } = data;
    const current = await prisma.pointCollection.findUnique({
        where: { idPc: id },
        include: { address: true },
    });

    if (!current) {
        return null;
    }

    return prisma.pointCollection.update({
        where: { idPc: id },
        data: {
            ...rest,
            ...(address
                ? {
                    address: {
                        update: {
                            street: address.street ?? current.address.street,
                            number: address.number ?? current.address.number,
                            complement: address.complement ?? current.address.complement,
                            district: address.district ?? current.address.district,
                            city: address.city ?? current.address.city,
                            postCode: address.postCode ?? current.address.postCode,
                        },
                    },
                }
                : {}),
        },
        include: includePointRelations,
    });
}

async function deletePoint(id) {
    return prisma.pointCollection.delete({
        where: { idPc: id },
        include: includePointRelations,
    });
}

async function updatePointStatus(id, status) {
    return prisma.pointCollection.update({
        where: { idPc: id },
        data: {
            status,
        },
        include: includePointRelations,
    });
}

async function listApprovedPoints(filters = {}) {
    return listPoints({ ...filters, status: "APROVADO" });
}

module.exports = {
    createPoint,
    listPoints,
    findPointById,
    findPointByCpf,
    findPointByCnpj,
    updatePoint,
    deletePoint,
    updatePointStatus,
    listApprovedPoints,
};
