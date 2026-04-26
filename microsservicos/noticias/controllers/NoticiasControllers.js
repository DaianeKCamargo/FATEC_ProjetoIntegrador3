const model = require('../models/NoticiasModels');

exports.listar = async (req, res) => {
  try {
    const dados = await model.listarNoticias();
    res.json(dados);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const noticia = await model.buscarPorId(id);

    if (!noticia) {
      return res.status(404).json({ mensagem: "Notícia não encontrada" });
    }

    res.json(noticia);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const { titulo, conteudo } = req.body;

    if (!titulo || !conteudo) {
      return res.status(400).json({ mensagem: "Campos obrigatórios" });
    }

    const nova = await model.criarNoticia(titulo, conteudo);
    res.status(201).json(nova);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, conteudo } = req.body;

    const atualizada = await model.atualizarNoticia(id, titulo, conteudo);

    res.json(atualizada);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const { id } = req.params;

    await model.removerNoticia(id);

    res.json({ mensagem: "Notícia removida com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};