const express = require("express");
const path = require("path");
const session = require("express-session");
const adminUsersRoutes = require("./routes/admin-usersRoutes");
const adminUsersViewRoutes = require("./routes/admin-usersViewRoutes");

const app = express();
const PORT = process.env.ADMIN_USERS_PORT || 5502;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sessão
app.use(
    session({
        secret: process.env.SESSION_SECRET || "sua_chave_secreta_aqui",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true em produção
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24, // 24 horas
        },
    })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "ms-admin-users" });
});

// Rota raiz - redirecionar para login se não autenticado
app.get("/", (req, res) => {
    if (req.session.logado) {
        return res.redirect("/menu");
    }
    res.render("login", { message: null, error: null, values: {} });
});

// Rotas da API
app.use("/api/credenciais", adminUsersRoutes);

// Rotas de visualização
app.use("/", adminUsersViewRoutes);

// Tratamento de erro 404
app.use((req, res) => {
    if (req.accepts("html")) {
        return res.status(404).render("404", { url: req.originalUrl });
    }
    return res.status(404).json({ message: "Rota não encontrada" });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Microserviço autenticação em execução na porta ${PORT}`);
    });
}

module.exports = app;
