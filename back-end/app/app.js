const express = require("express");

const pontoColetaRoutes = require("./routes/pontoColetaRoutes");
const noticiaRoutes = require("./routes/noticiaRoutes");
const capsRegistrationRoutes = require("../api/caps-registration/routes/caps-registrationRoutes.js");
const registrosAnimaisRoutes = require("../api/animals-registration/routes/animals-registrationRoute.js")

const app = express();
const PORT = process.env.PORT || 5500;


app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "app-principal" });
});

app.use("/api/points", pontoColetaRoutes);
app.use("/api/pontos-coleta", pontoColetaRoutes);
app.use("/api/ponto-coleta", pontoColetaRoutes);
app.use("/api/noticias", noticiaRoutes);
app.use("/api/caps-registration", capsRegistrationRoutes);
app.use("/api/animals-registration", registrosAnimaisRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Rota nao encontrada" });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`App principal em execucao na porta ${PORT}`);
});

module.exports = app;
