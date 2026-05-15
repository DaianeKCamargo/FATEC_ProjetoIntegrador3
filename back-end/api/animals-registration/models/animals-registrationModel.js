const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function listar() {
    return await prisma.RegistrosAnimais.findMany();
}

async function buscarPorId(id) {
    return await prisma.RegistrosAnimais.findUnique({
        where: { id }
    });
}

async function criar(dados) {
    return await prisma.RegistrosAnimais.create({
        data: {
            data: new Date(dados.data),
            tipoAnimal: dados.tipoAnimal,
            quantidade: Number(dados.quantidade)
        }
    });
}

async function atualizar(id, dados) {
    return await prisma.RegistrosAnimais.update({
        where: { id },
        data: {
            data: dados.data ? new Date(dados.data) : undefined,
            tipoAnimal: dados.tipoAnimal,
            quantidade: dados.quantidade
        }
    });
}

async function remover(id) {
    return await prisma.RegistrosAnimais.delete({
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