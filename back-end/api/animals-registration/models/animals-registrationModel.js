const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function listar() {
    return await prisma.registrosAnimais.findMany();
}

async function buscarPorId(id) {
    return await prisma.registrosAnimais.findUnique({
        where: { id }
    });
}

async function criar(dados) {
    return await prisma.registrosAnimais.create({
        data: {
            data: new Date(dados.data),
            tipoAnimal: dados.tipoAnimal,
            quantidade: Number(dados.quantidade)
        }
    });
}

async function atualizar(id, dados) {
    return await prisma.registrosAnimais.update({
        where: { id },
        data: {
            data: dados.data ? new Date(dados.data) : undefined,
            tipoAnimal: dados.tipoAnimal,
            quantidade: dados.quantidade
        }
    });
}

async function remover(id) {
    return await prisma.registrosAnimais.delete({
        where: { id }
    });
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
};