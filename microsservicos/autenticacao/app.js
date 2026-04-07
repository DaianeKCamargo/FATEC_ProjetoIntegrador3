const express = require("express");
const autenticacaoRoutes = require("./routes/autenticacaoRoutes");

const app = express();
const PORT = process.env.AUTENTICACAO_PORT || 5502;

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "ms-autenticacao" });
});

app.use("/api/credenciais", autenticacaoRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Rota nao encontrada" });
});

app.listen(PORT, () => {
    console.log(`Microservico autenticacao em execucao na porta ${PORT}`);
});
