const model = require('../models/newsModel');

async function listar(req, res) {
  try {
    const dados = await model.listarNoticias();
    return res.status(200).json(dados);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const noticia = await model.buscarPorId(id);

    if (!noticia) {
      return res.status(404).json({ mensagem: "Notícia não encontrada" });
    }

    return res.status(200).json(noticia);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

async function criar(req, res) {
  try {
    const { titulo, link, imagem } = req.body;

    if (!titulo || !link || !imagem) {
      return res.status(400).json({ mensagem: "Campos obrigatórios" });
    }

    const nova = await model.criarNoticia(titulo, link, imagem);
    return res.status(201).json(nova);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const { id } = req.params;

    const atualizada = await model.atualizarNoticia(id, req.body);

    return res.status(200).json(atualizada);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

async function remover(req, res) {
  try {
    const { id } = req.params;

    await model.removerNoticia(id);

    return res.status(200).json({ mensagem: "Notícia removida com sucesso" });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover,
};