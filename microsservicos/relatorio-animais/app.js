const express = require("express");
const path = require('path');
const relatorioAnimaisRoutes = require("./routes/relatorio-animaisRoutes");

const app = express();
const PORT = process.env.RELATORIO_ANIMAIS_PORT || 5503;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "ms-relatorio-animais" });
});

app.use("/api/relatorios-animais", relatorioAnimaisRoutes);

// Simple preview routes for templates
app.get('/relatorios-animais', (req, res) => res.render('relatorios', { relatorios: [] }));
app.get('/relatorios-animais/novo', (req, res) => res.render('formsanimais', { errors: null, values: {} }));
app.get('/relatorios-animais/:id', (req, res) => res.render('detalhes', { id: req.params.id }));

app.use((req, res) => {
    res.status(404).json({ message: "Rota nao encontrada" });
});

app.listen(PORT, () => {
    console.log(`Microservico relatorio-animais em execucao na porta ${PORT}`);
});
