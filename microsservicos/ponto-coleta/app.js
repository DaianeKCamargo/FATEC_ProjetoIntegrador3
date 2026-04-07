const express = require("express");
const pontoColetaRoutes = require("./routes/pontoColetaRoutes");

const app = express();
const PORT = process.env.PONTO_COLETA_PORT || 5501;

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "ms-ponto-coleta" });
});

app.use("/api/pontos-coleta", pontoColetaRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Rota nao encontrada" });
});

app.listen(PORT, () => {
    console.log(`Microservico ponto-coleta em execucao na porta ${PORT}`);
});
