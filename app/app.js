const express = require("express");

const usuarioRoutes = require("./routes/usuarioRoutes");
const pontoColetaRoutes = require("./routes/pontoColetaRoutes");
const noticiaRoutes = require("./routes/noticiaRoutes");

const app = express();
const PORT = process.env.PORT || 5500;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "app-principal" });
});

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/pontos-coleta", pontoColetaRoutes);
app.use("/api/noticias", noticiaRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Rota nao encontrada" });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`App principal em execucao na porta ${PORT}`);
});

module.exports = app;
