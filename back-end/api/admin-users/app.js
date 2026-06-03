require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const adminUsersRoutes = require("./routes/admin-usersRoutes");

const app = express();
const PORT = process.env.ADMIN_USERS_PORT || 5502;
const isProduction = process.env.NODE_ENV === "production";
const SESSION_SECRET = process.env.SESSION_SECRET || (isProduction ? "" : "tampets-dev-session-secret");
const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    ...(process.env.FRONTEND_ORIGIN ? process.env.FRONTEND_ORIGIN.split(",").map((value) => value.trim()).filter(Boolean) : []),
]);

if (!SESSION_SECRET) {
    throw new Error("SESSION_SECRET deve ser configurado em producao.");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.has(origin)) {
                return callback(null, true);
            }

            return callback(new Error(`CORS bloqueado para a origem: ${origin}`));
        },
        credentials: true,
    })
);

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "ms-admin-users" });
});

app.get("/", (req, res) => {
    return res.status(200).json({ message: "ms-admin-users root", service: "ms-admin-users" });
});

app.use("/api/credentials", adminUsersRoutes);

app.use((req, res) => {
    return res.status(404).json({ message: "Rota nao encontrada" });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`API autenticacao em execucao na porta ${PORT}`);
    });
}

module.exports = app;
