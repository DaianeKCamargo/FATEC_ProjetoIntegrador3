require("dotenv").config();
const express = require("express");
const path = require('path');
const pontoColetaRoutes = require("./routes/pontoColetaRoutes");

const app = express();
const PORT = process.env.PONTO_COLETA_PORT || 5501;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "ms-ponto-coleta",
        database: process.env.DATABASE_URL ? "configured" : "missing DATABASE_URL",
    });
});

app.use("/api/pontos-coleta", pontoColetaRoutes);

// Simple preview routes for templates
app.get('/pontos', (req, res) => res.render('formspt', { errors: null, values: {} }));
app.get('/pontos/solicitacao', (req, res) => res.render('Solicitacaopt', {}));
app.get('/pontos/:id', (req, res) => res.render('detalhept', { id: req.params.id }));

app.use((req, res) => {
    res.status(404).json({ message: "Rota nao encontrada" });
});

app.listen(PORT, () => {
    console.log(`Microservico ponto-coleta em execucao na porta ${PORT}`);
});
