const express = require("express");
const model = require("../models/autenticacaoModels");
const noticiasModel = require("../models/noticiasModel");

const router = express.Router();

router.get("/credenciais", (req, res) => {
    const lista = model.listar();
    res.render("lista", { credenciais: lista });
});

router.get("/credenciais/novo", (req, res) => {
    res.render("novo", { errors: null, values: {} });
});

router.post("/credenciais/novo", (req, res) => {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) {
        return res.status(400).render("novo", { errors: ["usuario e senha sao obrigatorios"], values: req.body });
    }

    if (model.buscarPorUsuario(usuario)) {
        return res.status(409).render("novo", { errors: ["usuario ja cadastrado"], values: req.body });
    }

    model.criar({ usuario, senha });
    return res.redirect("/login");
});

router.get("/login", (req, res) => {
    res.render("login", { message: null });
});

router.post("/login", (req, res) => {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) {
        return res.status(400).render("login", { message: "usuario e senha sao obrigatorios" });
    }

    const credencial = model.buscarPorUsuario(usuario);
    if (!credencial || credencial.senha !== senha || credencial.ativo === false) {
        return res.status(401).render("login", { message: "Credenciais invalidas" });
    }

    return res.redirect("/menu");
});

router.get("/menu", (req, res) => {
    res.render("menu", {
        noticiasUrl: "/noticias",
        pontoColetaUrl: process.env.PONTO_COLETA_BASE_URL || "http://localhost:5501/menu",
        relatorioUrl: "/relatorio",
        credenciaisUrl: "/credenciais",
    });
});

router.get("/noticias", async (req, res) => {
    try {
        const noticias = await noticiasModel.listar();
        res.render("noticias", { noticias });
    } catch (err) {
        console.error("Erro ao listar notícias:", err);
        res.render("noticias", { noticias: [] });
    }
});

router.get("/noticias/novo", (req, res) => {
    res.render("formnews", { noticia: null });
});

router.post("/noticias", async (req, res) => {
    try {
        const { titulo, link, imagem, data } = req.body;
        if (!titulo || !link || !imagem || !data) {
            return res.render("formnews", {
                noticia: null,
                errors: ["Título, link, imagem e data são obrigatórios"]
            });
        }
        await noticiasModel.criar({ titulo, link, imagem, data });
        res.redirect("/noticias");
    } catch (err) {
        console.error("Erro ao criar notícia:", err);
        res.render("formnews", { noticia: null, errors: ["Erro ao criar notícia"] });
    }
});

router.get("/noticias/:id", async (req, res) => {
    try {
        const noticia = await noticiasModel.buscarPorId(req.params.id);
        if (!noticia) {
            return res.status(404).send("Notícia não encontrada");
        }
        res.render("detalhe", { noticia });
    } catch (err) {
        console.error("Erro ao buscar notícia:", err);
        res.status(500).send("Erro ao buscar notícia");
    }
});

router.get("/noticias/:id/editar", async (req, res) => {
    try {
        const noticia = await noticiasModel.buscarPorId(req.params.id);
        if (!noticia) {
            return res.status(404).send("Notícia não encontrada");
        }
        res.render("formnews", { noticia });
    } catch (err) {
        console.error("Erro ao buscar notícia:", err);
        res.status(500).send("Erro ao buscar notícia");
    }
});

router.put("/noticias/:id", async (req, res) => {
    try {
        const { titulo, link, imagem, data } = req.body;
        if (!titulo || !link || !imagem || !data) {
            return res.status(400).render("formnews", {
                noticia: null,
                errors: ["Título, link, imagem e data são obrigatórios"]
            });
        }
        await noticiasModel.atualizar(req.params.id, { titulo, link, imagem, data });
        res.redirect("/noticias");
    } catch (err) {
        console.error("Erro ao atualizar notícia:", err);
        res.status(500).send("Erro ao atualizar notícia");
    }
});

router.delete("/noticias/:id", async (req, res) => {
    try {
        await noticiasModel.remover(req.params.id);
        res.redirect("/noticias");
    } catch (err) {
        console.error("Erro ao deletar notícia:", err);
        res.status(500).send("Erro ao deletar notícia");
    }
});

router.get("/relatorio", (req, res) => {
    res.render("relatorio-menu", {
        relatorioAnimaisUrl: process.env.RELATORIO_ANIMAIS_BASE_URL || "http://localhost:5503/relatorios-animais",
        relatorioTampinhasUrl: process.env.RELATORIO_TAMPINHAS_BASE_URL || "http://localhost:5504/tampinhas",
        menuUrl: "/menu",
    });
});

module.exports = router;
