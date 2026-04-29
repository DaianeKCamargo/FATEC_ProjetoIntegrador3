const express = require("express");
const path = require("path");
const autenticacaoRoutes = require("./routes/autenticacaoRoutes");
const autenticacaoViewRoutes = require("./routes/autenticacaoViewRoutes");

const app = express();
const PORT = process.env.AUTENTICACAO_PORT || 5502;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "ms-autenticacao" });
});

app.get("/", (req, res) => {
    res.render("login", { message: null });
});

app.use("/api/credenciais", autenticacaoRoutes);
app.use("/", autenticacaoViewRoutes);

app.use((req, res) => {
    if (req.accepts("html")) {
        return res.status(404).render("404", { url: req.originalUrl });
    }
    return res.status(404).json({ message: "Rota nao encontrada" });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Microservico autenticacao em execucao na porta ${PORT}`);
    });
}

module.exports = app;
