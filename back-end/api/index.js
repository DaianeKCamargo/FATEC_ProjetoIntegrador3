const express = require("express");
const cors = require("cors");
const session = require("express-session");

require("dotenv").config();

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const sessionSecret = process.env.SESSION_SECRET || (isProduction ? "" : "tampets-dev-session-secret");
const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    ...(process.env.FRONTEND_ORIGIN ? process.env.FRONTEND_ORIGIN.split(",").map((value) => value.trim()).filter(Boolean) : []),
]);

if (!sessionSecret) {
    throw new Error("SESSION_SECRET deve ser configurado em producao.");
}

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: sessionSecret,
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
    res.status(200).json({ status: "ok", service: "tampets-api" });
});

app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "tampets-api",
        endpoints: [
            "/api/credentials",
            "/api/animals-registration",
            "/api/caps-registration",
            "/api/collection-point",
            "/api/news",
            "/health",
        ],
    });
});

app.use("/api/credentials", require("./admin-users/routes/admin-usersRoutes"));
app.use("/api/animals-registration", require("./animals-registration/routes/animals-registrationRoute"));
app.use("/api/caps-registration", require("./caps-registration/routes/caps-registrationRoute"));
app.use("/api/collection-point", require("./collection-point/routes/collection-pointRoute"));
app.use("/api/news", require("./news/routes/newsRoute"));

app.use((req, res) => {
    return res.status(404).json({ message: "Rota nao encontrada" });
});

module.exports = app;
