const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function listarNoticias() {
    return await prisma.news.findMany({
        orderBy: { id: "desc" },
    });
}

async function buscarPorId(id) {
    return await prisma.news.findUnique({
        where: { id: Number(id) },
    });
}

async function criarNoticia(titulo, link, imagem) {
    return await prisma.news.create({
        data: {
            titulo,
            link,
            imagem,
        },
    });
}

async function atualizarNoticia(id, dados) {
    return await prisma.news.update({
        where: { id: Number(id) },
        data: {
            titulo: dados.titulo || undefined,
            link: dados.link || undefined,
            imagem: dados.imagem || undefined,
        },
    });
}

async function removerNoticia(id) {
    return await prisma.news.delete({
        where: { id: Number(id) },
    });
}

module.exports = {
    listarNoticias,
    buscarPorId,
    criarNoticia,
    atualizarNoticia,
    removerNoticia,
};