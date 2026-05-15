require("dotenv").config();

const express = require("express");
const session = require("express-session");
const adminUsersRoutes = require("./routes/admin-usersRoutes");

const app = express();
const PORT = process.env.ADMIN_USERS_PORT || 5502;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
    throw new Error("SESSION_SECRET não definido. Configure a variável no arquivo .env.");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sessão com opções de segurança
app.use(
    session({
        secret: SESSION_SECRET,
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


// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "ms-admin-users" });
});

// Rota raiz - simples health/placeholder
app.get("/", (req, res) => {
    return res.status(200).json({ message: "ms-admin-users root", service: "ms-admin-users" });
});

// Rotas da API
app.use("/api/credentials", adminUsersRoutes);

// Sem rotas de visualização neste microserviço

// Tratamento de erro 404
app.use((req, res) => {
    return res.status(404).json({ message: "Rota não encontrada" });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`API autenticação em execução na porta ${PORT}`);
    });
}

module.exports = app;
