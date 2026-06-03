const express = require("express");
const cors = require("cors");
const session = require("express-session");

const CollectionPointRoute = require("./routes/collection-pointRoute.js");
const newsRoute = require("./routes/newsRoute.js");
const capsRegistrationRoute = require("../api/caps-registration/routes/caps-registrationRoute.js");
const registrosAnimaisRoute = require("../api/animals-registration/routes/animals-registrationRoute.js");
const adminUsersRoutes = require("../api/admin-users/routes/admin-usersRoutes");

const app = express();
const PORT = process.env.PORT || 5500;

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "tampets-session-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "app-principal" });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "app-principal" });
});

app.use("/api/collection-point", CollectionPointRoute);
app.use("/api/news", newsRoute);
app.use("/api/caps-registration", capsRegistrationRoute);
app.use("/api/animals-registration", registrosAnimaisRoute);
app.use("/api/credentials", adminUsersRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Rota nao encontrada" });
});

app.listen(PORT, () => {
    console.log(`App principal em execucao na porta ${PORT}`);
});

module.exports = app;
