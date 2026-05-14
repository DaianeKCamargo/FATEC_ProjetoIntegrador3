const noticiaModel = require("../models/noticiaModels");

async function listarNoticias(req, res) {
    try {
        const noticias = await noticiaModel.listar();
        res.status(200).json(noticias);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar noticias", error });
    }
}

async function buscarNoticiaPorId(req, res) {
    try {
        const id = Number(req.params.id);
        const noticia = await noticiaModel.buscarPorId(id);

        if (!noticia) {
            return res.status(404).json({ message: "Noticia nao encontrada" });
        }

        return res.status(200).json(noticia);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar noticia", error });
    }
}

async function criarNoticia(req, res) {
    try {
        const { titulo, link, imagem } = req.body;

        if (!titulo || !link || !imagem) {
            return res.status(400).json({
                message: "titulo, link e imagem sao obrigatorios",
            });
        }

        const novaNoticia = await noticiaModel.criar({
            titulo,
            link,
            imagem,
        });

        return res.status(201).json(novaNoticia);
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar noticia", error });
    }
}

async function atualizarNoticia(req, res) {
    try {
        const id = Number(req.params.id);
        const { titulo, link, imagem } = req.body;

        const noticiaAtualizada = await noticiaModel.atualizar(id, {
            titulo,
            link,
            imagem,
        });

        if (!noticiaAtualizada) {
            return res.status(404).json({ message: "Noticia nao encontrada" });
        }

        return res.status(200).json(noticiaAtualizada);
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar noticia", error });
    }
}

async function removerNoticia(req, res) {
    try {
        const id = Number(req.params.id);
        const removido = await noticiaModel.remover(id);

        if (!removido) {
            return res.status(404).json({ message: "Noticia nao encontrada" });
        }

        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Erro ao remover noticia", error });
    }
}

module.exports = {
    listarNoticias,
    buscarNoticiaPorId,
    criarNoticia,
    atualizarNoticia,
    removerNoticia,
};