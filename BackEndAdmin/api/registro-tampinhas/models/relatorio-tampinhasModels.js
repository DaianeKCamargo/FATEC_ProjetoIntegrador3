const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// LISTAR
async function listar() {
    return await prisma.relatorioTampinhas.findMany({
        orderBy: { id: "asc" },
        select: {
            id: true,
            data: true,
            quantidadeKg: true
        }
    });
}

// BUSCAR POR ID
async function buscarPorId(id) {
    const item = await prisma.relatorioTampinhas.findUnique({
        where: { id },
        select: {
            id: true,
            data: true,
            quantidadeKg: true
        }
    });

    return item || null; // ✅ faltava isso
}

// CRIAR
async function criar(dados) {
    const novo = await prisma.relatorioTampinhas.create({
        data: {
            data: dados.data ? new Date(dados.data) : new Date(),
            quantidadeKg: Number(dados.quantidadeKg) // ✅ corrigido
        },
        select: {
            id: true,
            data: true,
            quantidadeKg: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return novo; // ✅ sem gambiarra
}

// ATUALIZAR
async function atualizar(id, dados) {
    try {
        const atualizado = await prisma.relatorioTampinhas.update({
            where: { id },
            data: {
                data: dados.data ? new Date(dados.data) : undefined,
                quantidadeKg: dados.quantidadeKg !== undefined
                    ? Number(dados.quantidadeKg)
                    : undefined
            },
            select: {
                id: true,
                data: true,
                quantidadeKg: true
            }
        });

        return atualizado;

    } catch (error) {
        return null;
    }
}

// REMOVER
async function remover(id) {
    try {
        await prisma.relatorioTampinhas.delete({
            where: { id }
        });
        return true;
    } catch {
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