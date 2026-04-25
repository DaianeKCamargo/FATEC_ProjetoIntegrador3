const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const relatoriosAnimais = [];
let nextId = 1;

function listar() {
    return relatoriosAnimais;
}

function buscarPorId(id) {
    return relatoriosAnimais.find((item) => item.id === id);
}

function criar(dados) {
    const novo = {
        id: nextId++,
        data: dados.data || "",
        tipoAnimal: dados.tipoAnimal || "",
        quantidade: Number(dados.quantidade || 0),
    };
    relatoriosAnimais.push(novo);
    return novo;
}

function atualizar(id, dados) {
    const item = buscarPorId(id);
    if (!item) return null;

    item.data = dados.data ?? item.data;
    item.tipoAnimal = dados.tipoAnimal ?? item.tipoAnimal;
    item.quantidade = dados.quantidade ?? item.quantidade;
    return item;
}

function remover(id) {
    const indice = relatoriosAnimais.findIndex((item) => item.id === id);
    if (indice === -1) return false;

    relatoriosAnimais.splice(indice, 1);
    return true;
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
};
