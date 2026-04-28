const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function listar() {
    return await prisma.noticia.findMany({
        orderBy: { createdAt: "desc" },
    });
}

async function buscarPorId(id) {
    return await prisma.noticia.findUnique({
        where: { id: parseInt(id) },
    });
}

async function criar(data) {
    return await prisma.noticia.create({
        data: {
            titulo: data.titulo,
            link: data.link,
            imagem: data.imagem,
            data: new Date(data.data),
        },
    });
}

async function atualizar(id, data) {
    return await prisma.noticia.update({
        where: { id: parseInt(id) },
        data: {
            titulo: data.titulo,
            link: data.link,
            imagem: data.imagem,
            data: new Date(data.data),
        },
    });
}

async function remover(id) {
    return await prisma.noticia.delete({
        where: { id: parseInt(id) },
    });
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
};
