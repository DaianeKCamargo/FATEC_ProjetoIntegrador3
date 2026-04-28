const express = require("express");
const model = require("../models/autenticacaoModels");

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
        pontoColetaUrl: "/pontos",
        relatorioUrl: "/relatorio",
        credenciaisUrl: "/credenciais",
    });
});

router.get("/noticias", (req, res) => {
    res.render("noticias", { noticias: [] });
});

router.get("/noticias/novo", (req, res) => {
    res.render("formnews", { noticia: null });
});

router.get("/noticias/:id", (req, res) => {
    res.render("detalhe", { noticia: { id: req.params.id, titulo: "Notícia", conteudo: "Conteúdo da notícia" } });
});
router.get("/pontos", (req, res) => {
    res.render("formspt", { errors: null, values: {} });
});

router.post("/pontos", (req, res) => {
    const { nome, status } = req.body;

    if (!nome) {
        return res.status(400).render("formspt", {
            errors: ["Nome e obrigatorio"],
            values: req.body,
        });
    }

    res.render("detalhept", {
        solicitacao: {
            id: Date.now(),
            nome,
            status: status || "PENDENTE",
        },
    });
});

router.get("/pontos/solicitacao", (req, res) => {
    res.render("Solicitacaopt", {});
});

router.get("/pontos/:id", (req, res) => {
    res.render("detalhept", { solicitacao: { id: req.params.id, nome: "Solicitação", status: "PENDENTE" } });
});

router.get("/relatorio", (req, res) => {
    res.render("relatorio-menu", {
        relatorioAnimaisUrl: "/relatorios-animais",
        relatorioTampinhasUrl: "/tampinhas",
        menuUrl: "/menu",
    });
});

router.get("/relatorios-animais", (req, res) => {
    res.render("relatorios", { relatorios: [] });
});

router.get("/relatorios-animais/novo", (req, res) => {
    res.render("formsanimais", { errors: null, values: {} });
});

router.get("/relatorios-animais/:id", (req, res) => {
    res.render("detalhes", {
        relatorio: {
            id: req.params.id,
            data: new Date().toISOString().slice(0, 10),
            tipoAnimal: "Animal",
            quantidade: 0,
        },
    });
});

router.get("/tampinhas", (req, res) => {
    res.render("tampinhas", { relatorios: [] });
});

router.get("/tampinhas/novo", (req, res) => {
    res.render("formstampinhas", { errors: null, values: {} });
});

router.get("/tampinhas/:id", (req, res) => {
    res.render("detalhestampinhas", {
        relatorio: {
            id: req.params.id,
            data: new Date().toISOString().slice(0, 10),
            quantidadeKg: 0,
            peso_gramas: 0,
            quantidade_tampinhas: 0,
        },
    });
});

module.exports = router;
