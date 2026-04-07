const express = require("express");
const relatorioAnimaisRoutes = require("./routes/relatorio-animaisRoutes");

const app = express();
const PORT = process.env.RELATORIO_ANIMAIS_PORT || 5503;

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "ms-relatorio-animais" });
});

app.use("/api/relatorios-animais", relatorioAnimaisRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Rota nao encontrada" });
});

app.listen(PORT, () => {
    console.log(`Microservico relatorio-animais em execucao na porta ${PORT}`);
});
