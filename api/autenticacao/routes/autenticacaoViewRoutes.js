const express = require("express");
const model = require("../models/autenticacaoModels");

const router = express.Router();
const pontoColetaBaseUrl = (
    process.env.PONTO_COLETA_API_URL ||
    process.env.MS_PONTO_COLETA_URL ||
    "http://localhost:5501"
).replace(/\/$/, "");

async function fetchPontoColeta(path, options = {}) {
    const response = await fetch(`${pontoColetaBaseUrl}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const error = new Error(
            (body && body.message) || "Erro ao comunicar com o servico de ponto de coleta"
        );
        error.statusCode = response.status;
        throw error;
    }

    return body;
}

// ===== ROTAS DE AUTENTICAÇÃO =====

// GET /login - Mostrar página de login
router.get("/login", (req, res) => {
    res.render("login", { message: null, error: null, values: {} });
});

// POST /login - Processar login
router.post("/login", async (req, res) => {
    try {
        const { username, senha } = req.body;

        if (!username || !senha) {
            return res.status(400).render("login", {
                error: "Usuário e senha são obrigatórios",
                message: null,
                values: { username }
            });
        }

        const admin = await model.login(username, senha);

        // Salvar sessão
        req.session.admin = admin;
        req.session.logado = true;

        return res.redirect("/menu");
    } catch (erro) {
        return res.status(401).render("login", {
            error: erro.message || "Credenciais inválidas",
            message: null,
            values: { username: req.body.username }
        });
    }
});

// GET /logout - Fazer logout
router.get("/logout", (req, res) => {
    req.session.destroy((erro) => {
        if (erro) {
            return res.status(500).json({ message: "Erro ao fazer logout" });
        }
        return res.redirect("/login");
    });
});

// ===== ROTAS DE REGISTRO =====

// GET /credenciais/novo - Mostrar formulário de registro
router.get("/credenciais/novo", (req, res) => {
    res.render("novo", { errors: null, message: null, values: {} });
});

// POST /credenciais/novo - Criar novo administrador
router.post("/credenciais/novo", async (req, res) => {
    try {
        const { username, emailUser, senha, confirmaSenha } = req.body;

        // Validações
        const errors = [];

        if (!username) errors.push("Usuário é obrigatório");
        if (username && username.length < 3) errors.push("Usuário deve ter pelo menos 3 caracteres");

        if (!emailUser) errors.push("Email é obrigatório");
        if (emailUser && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailUser)) {
            errors.push("Email inválido");
        }

        if (!senha) errors.push("Senha é obrigatória");
        if (senha && senha.length < 6) errors.push("Senha deve ter pelo menos 6 caracteres");

        if (senha !== confirmaSenha) errors.push("As senhas não coincidem");

        if (errors.length > 0) {
            return res.status(400).render("novo", {
                errors,
                message: null,
                values: { username, emailUser }
            });
        }

        const novoAdmin = await model.criar({
            username,
            emailUser,
            senha
        });

        return res.render("novo", {
            errors: null,
            message: "Conta criada com sucesso! Faça login para continuar.",
            values: {}
        });
    } catch (erro) {
        const errors = [erro.message];
        return res.status(400).render("novo", {
            errors,
            message: null,
            values: { username: req.body.username, emailUser: req.body.emailUser }
        });
    }
});

// ===== ROTAS DE RECUPERAÇÃO DE SENHA =====

// GET /recuperar-senha - Mostrar formulário de recuperação
router.get("/recuperar-senha", (req, res) => {
    res.render("recuperar-senha", {
        error: null,
        message: null,
        values: {}
    });
});

// POST /recuperacao/solicitar - Solicitar token de recuperação
router.post("/recuperacao/solicitar", async (req, res) => {
    try {
        const { emailUser } = req.body;

        if (!emailUser) {
            return res.status(400).render("recuperar-senha", {
                error: "Email é obrigatório",
                message: null,
                values: {}
            });
        }

        const resetToken = await model.gerarTokenRecuperacao(emailUser);

        // TODO: Enviar email com token
        // await enviarEmail(emailUser, resetToken);

        return res.render("recuperar-senha", {
            error: null,
            message: `Email enviado! Token: ${resetToken} (remover em produção)`,
            values: { emailUser }
        });
    } catch (erro) {
        return res.status(400).render("recuperar-senha", {
            error: erro.message || "Erro ao solicitar recuperação",
            message: null,
            values: req.body
        });
    }
});

// POST /recuperacao/validar - Validar token
router.post("/recuperacao/validar", async (req, res) => {
    try {
        const { emailUser, resetToken } = req.body;

        await model.validarTokenRecuperacao(emailUser, resetToken);

        return res.render("recuperar-senha", {
            error: null,
            message: "Token válido! Defina sua nova senha.",
            values: { emailUser, resetToken }
        });
    } catch (erro) {
        return res.status(400).render("recuperar-senha", {
            error: erro.message || "Token inválido",
            message: null,
            values: req.body
        });
    }
});

// POST /recuperacao/redefinir - Redefinir senha
router.post("/recuperacao/redefinir", async (req, res) => {
    try {
        const { emailUser, resetToken, novaSenha } = req.body;

        if (!novaSenha || novaSenha.length < 6) {
            return res.status(400).render("recuperar-senha", {
                error: "Senha deve ter pelo menos 6 caracteres",
                message: null,
                values: { emailUser }
            });
        }

        await model.redefinirSenha(emailUser, resetToken, novaSenha);

        return res.render("login", {
            message: "Senha redefinida com sucesso! Faça login.",
            error: null,
            values: {}
        });
    } catch (erro) {
        return res.status(400).render("recuperar-senha", {
            error: erro.message || "Erro ao redefinir senha",
            message: null,
            values: { emailUser: req.body.emailUser }
        });
    }
});

// ===== ROTAS DO MENU =====

// GET /menu - Menu principal do administrador
router.get("/menu", (req, res) => {
    res.render("menu", {
        noticiasUrl: "/noticias",
        pontoColetaUrl: "/pontos",
        relatorioUrl: "/relatorio",
        credenciaisUrl: "/credenciais",
    });
});

// ===== ROTAS DE NOTÍCIAS =====

router.get("/noticias", (req, res) => {
    res.render("noticias", { noticias: [] });
});

router.get("/noticias/novo", (req, res) => {
    res.render("formnews", { noticia: null });
});

router.get("/noticias/:id", (req, res) => {
    res.render("detalhe", { noticia: { id: req.params.id, titulo: "Notícia", conteudo: "Conteúdo da notícia" } });
});

// ===== ROTAS DE PONTOS DE COLETA =====

router.get("/pontos", (req, res) => {
    res.render("formspt", { errors: null, values: {} });
});

router.post("/pontos", async (req, res) => {
    try {
        const created = await fetchPontoColeta("/api/points", {
            method: "POST",
            body: JSON.stringify(req.body),
        });

        return res.render("detalhept", {
            ponto: created,
        });
    } catch (error) {
        const errors = [error.message || "Erro ao cadastrar ponto de coleta"];
        return res.status(error.statusCode || 400).render("formspt", {
            errors,
            values: req.body,
        });
    }
});

router.get("/pontos/solicitacao", async (req, res) => {
    try {
        const pontos = await fetchPontoColeta("/api/points?status=APROVADO");
        res.render("Solicitacaopt", { pontos });
    } catch (error) {
        res.status(error.statusCode || 500).render("Solicitacaopt", { pontos: [], error: error.message });
    }
});

router.get("/pontos/:id", async (req, res) => {
    try {
        const ponto = await fetchPontoColeta(`/api/points/${req.params.id}`);
        res.render("detalhept", { ponto });
    } catch (error) {
        res.status(error.statusCode || 404).render("detalhept", {
            ponto: null,
            error: error.message,
        });
    }
});

// ===== ROTAS DE RELATÓRIOS =====

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
