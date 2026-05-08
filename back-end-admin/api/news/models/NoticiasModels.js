const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.listarNoticias = async () => {
  return await prisma.noticia.findMany({
    orderBy: {
      id: 'desc'
    }
  });
};

exports.buscarPorId = async (id) => {
  return await prisma.noticia.findUnique({
    where: {
      id: Number(id)
    }
  });
};

exports.criarNoticia = async (titulo, link, imagem) => {
  return await prisma.noticia.create({
    data: {
      titulo,
      link,
      imagem
    }
  });
};

exports.atualizarNoticia = async (id, dados) => {
  return await prisma.noticia.update({
    where: {
      id: Number(id)
    },
    data: {
      titulo: dados.titulo || undefined,
      link: dados.link || undefined,
      imagem: dados.imagem || undefined
    }
  });
};

exports.removerNoticia = async (id) => {
  return await prisma.noticia.delete({
    where: {
      id: Number(id)
    }
  });
};