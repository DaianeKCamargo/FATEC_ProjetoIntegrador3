const express = require("express");
const path = require('path');
const relatorioTampinhasRoutes = require("./routes/relatorio-tampinhasRoutes");

const app = express();
const PORT = process.env.RELATORIO_TAMPINHAS_PORT || 5504;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "ms-relatorio-tampinhas" });
});

app.use("/api/relatorios-tampinhas", relatorioTampinhasRoutes);

// Simple preview routes for templates
app.get('/tampinhas', (req, res) => res.render('tampinhas', { relatorios: [] }));
app.get('/tampinhas/novo', (req, res) => res.render('formstampinhas', { errors: null, values: {} }));
app.get('/tampinhas/:id', (req, res) => res.render('detalhestampinhas', { id: req.params.id }));

app.use((req, res) => {
    res.status(404).json({ message: "Rota nao encontrada" });
});

app.listen(PORT, () => {
    console.log(`Microservico relatorio-tampinhas em execucao na porta ${PORT}`);
});
