const prisma = require("../lib/prismaClient");

const includeRequestRelations = {
    address: true,
    approvedPoint: true,
};

function createRequest(data) {
    return prisma.pointCollectionRequest.create({
        data: {
            opensPc: data.opensPc,
            nameUser: data.nameUser,
            linkPhoto: data.linkPhoto,
            cpfUser: data.cpfUser,
            cpnjPoint: data.cpnjPoint,
            emailUser: data.emailUser,
            celUser: data.celUser,
            namePoint: data.namePoint,
            hourInit: data.hourInit,
            hour: data.hour,
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
        include: includeRequestRelations,
    });
}

function listRequests(status) {
    return prisma.pointCollectionRequest.findMany({
        where: status ? { status } : undefined,
        include: includeRequestRelations,
        orderBy: { createdAt: "desc" },
    });
}

function findRequestById(id) {
    return prisma.pointCollectionRequest.findUnique({
        where: { idPc: id },
        include: includeRequestRelations,
    });
}

function updateRequest(id, data) {
    const { address, ...rest } = data;

    return prisma.pointCollectionRequest.update({
        where: { idPc: id },
        data: {
            ...rest,
            ...(address
                ? {
                    address: {
                        update: {
                            street: address.street,
                            number: address.number,
                            complement: address.complement || null,
                            district: address.district,
                            city: address.city,
                            postCode: address.postCode,
                        },
                    },
                }
                : {}),
        },
        include: includeRequestRelations,
    });
}

function listApprovedPoints() {
    return prisma.pointCollectionApproved.findMany({
        include: { address: true, sourceRequest: true },
        orderBy: { approvedAt: "desc" },
    });
}

function approveRequestTransaction(id, reason) {
    return prisma.$transaction(async (tx) => {
        const request = await tx.pointCollectionRequest.findUnique({
            where: { idPc: id },
            include: { address: true },
        });

        if (!request) {
            return null;
        }

        const approved = await tx.pointCollectionApproved.create({
            data: {
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
                idAdress: request.idAdress,
            },
        });

        const reviewed = await tx.pointCollectionRequest.update({
            where: { idPc: id },
            data: {
                status: "APROVADO",
                reviewedAt: new Date(),
                reviewReason: reason || null,
                approvedPointId: approved.idPcApproved,
            },
            include: includeRequestRelations,
        });

        return { reviewed, approved };
    });
}

function rejectRequestTransaction(id, reason) {
    return prisma.pointCollectionRequest.update({
        where: { idPc: id },
        data: {
            status: "RECUSADO",
            reviewedAt: new Date(),
            reviewReason: reason || null,
        },
        include: includeRequestRelations,
    });
}

module.exports = {
    createRequest,
    listRequests,
    findRequestById,
    updateRequest,
    listApprovedPoints,
    approveRequestTransaction,
    rejectRequestTransaction,
};
