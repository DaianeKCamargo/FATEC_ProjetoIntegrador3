require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const adminUsersRoutes = require("./routes/admin-usersRoutes");

const app = express();
const PORT = process.env.ADMIN_USERS_PORT || 5502;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - allow front-end dev origin and credentials
// Allow local dev and Vercel frontend domains. Override with FRONTEND_ORIGIN when needed.
app.use(
    cors({
        origin: (origin, callback) => {
            const allowedOrigins = new Set([
                "http://localhost:3000",
                "http://localhost:3001",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:3001",
                ...(process.env.FRONTEND_ORIGIN ? process.env.FRONTEND_ORIGIN.split(",").map((value) => value.trim()).filter(Boolean) : []),
            ]);

            const isAllowed =
                !origin ||
                allowedOrigins.has(origin) ||
                origin.endsWith(".vercel.app") ||
                origin.startsWith("https://vercel.app") ||
                origin.startsWith("https://www.vercel.app");

            if (isAllowed) {
                return callback(null, true);
            }

            return callback(new Error(`CORS bloqueado para a origem: ${origin}`));
        },
        credentials: true,
    })
);

// Configurar sessão com opções de segurança
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true em produção
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
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
