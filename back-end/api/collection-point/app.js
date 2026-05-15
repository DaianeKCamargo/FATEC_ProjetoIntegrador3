require("dotenv").config();
const express = require("express");
const collectionPointRoute = require("./routes/collection-pointRoute");

const app = express();
const PORT = process.env.PONTO_COLETA_PORT || 5501;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "ms-ponto-coleta",
        database: process.env.DATABASE_URL ? "configured" : "missing DATABASE_URL",
    });
});

app.use("/api/collection-point", collectionPointRoute);

app.use((req, res) => {
    res.status(404).json({ message: "Rota nao encontrada" });
});

app.listen(PORT, () => {
    console.log(`API ponto-coleta em execucao na porta ${PORT}`);
});
