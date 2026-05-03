// api/relatorio-tampinhas/models/relatorioTampinhasModel.js

const prisma = require('../lib/prismaClient');

// LISTAR
async function listar() {
    return await prisma.relatorioTampinhas.findMany({
        orderBy: {
            id: 'asc'
        }
    });
}

// BUSCAR POR ID
async function buscarPorId(id) {
    return await prisma.relatorioTampinhas.findUnique({
        where: { id: Number(id) }
    });
}

// CRIAR
async function criar(dados) {
    return await prisma.relatorioTampinhas.create({
        data: {
            data: dados.data ? new Date(dados.data) : new Date(),
            quantidadeKg: Number(dados.quantidadeKg) || 0
        }
    });
}

// ATUALIZAR
async function atualizar(id, dados) {
    try {
        return await prisma.relatorioTampinhas.update({
            where: { id: Number(id) },
            data: {
                ...(dados.data && { data: new Date(dados.data) }),
                ...(dados.quantidadeKg !== undefined && {
                    quantidadeKg: Number(dados.quantidadeKg)
                })
            }
        });
    } catch (error) {
        return null;
    }
}

// REMOVER
async function remover(id) {
    try {
        await prisma.relatorioTampinhas.delete({
            where: { id: Number(id) }
        });
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
};