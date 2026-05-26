const express = require("express");
const cors = require("cors");
const session = require("express-session");

require("dotenv").config();

const app = express();

app.use(
    cors({
        origin: true,
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