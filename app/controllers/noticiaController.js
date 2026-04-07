const noticiaModel = require("../models/noticiaModels");

function listarNoticias(req, res) {
    res.status(200).json(noticiaModel.listar());
}

function buscarNoticiaPorId(req, res) {
    const id = Number(req.params.id);
    const noticia = noticiaModel.buscarPorId(id);

    if (!noticia) {
        return res.status(404).json({ message: "Noticia nao encontrada" });
    }

    return res.status(200).json(noticia);
}

function criarNoticia(req, res) {
    const { titulo, link } = req.body;
    if (!titulo || !link) {
        return res.status(400).json({ message: "titulo e link sao obrigatorios" });
    }

    const novaNoticia = noticiaModel.criar(req.body);
    return res.status(201).json(novaNoticia);
}

function atualizarNoticia(req, res) {
    const id = Number(req.params.id);
    const noticiaAtualizada = noticiaModel.atualizar(id, req.body);

    if (!noticiaAtualizada) {
        return res.status(404).json({ message: "Noticia nao encontrada" });
    }

    return res.status(200).json(noticiaAtualizada);
}

function removerNoticia(req, res) {
    const id = Number(req.params.id);
    const removido = noticiaModel.remover(id);

    if (!removido) {
        return res.status(404).json({ message: "Noticia nao encontrada" });
    }

    return res.status(204).send();
}

module.exports = {
    listarNoticias,
    buscarNoticiaPorId,
    criarNoticia,
    atualizarNoticia,
    removerNoticia,
};
