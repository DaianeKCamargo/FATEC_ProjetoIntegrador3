const model = require('../models/NoticiasModels');

exports.listar = async (req, res) => {
  const dados = await model.listarNoticias();
  res.json(dados);
};

exports.criar = async (req, res) => {
  const { titulo, conteudo } = req.body;
  const nova = await model.criarNoticia(titulo, conteudo);
  res.json(nova);
};