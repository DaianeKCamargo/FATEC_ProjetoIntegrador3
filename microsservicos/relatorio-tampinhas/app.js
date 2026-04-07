const express = require("express");
const relatorioTampinhasRoutes = require("./routes/relatorio-tampinhasRoutes");

const app = express();
const PORT = process.env.RELATORIO_TAMPINHAS_PORT || 5504;

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "ms-relatorio-tampinhas" });
});

app.use("/api/relatorios-tampinhas", relatorioTampinhasRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Rota nao encontrada" });
});

app.listen(PORT, () => {
    console.log(`Microservico relatorio-tampinhas em execucao na porta ${PORT}`);
});
