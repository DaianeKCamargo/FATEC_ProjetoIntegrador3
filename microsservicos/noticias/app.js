const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const noticiasRoutes = require('./routes/NoticiasRoutes');
app.use('/api/noticias', noticiasRoutes);

// Simple view routes to preview templates
app.get('/noticias', (req, res) => res.render('noticias', { noticias: [] }));
app.get('/noticias/novo', (req, res) => res.render('formnews', { errors: null, values: {} }));
app.get('/noticias/:id', (req, res) => res.render('detalhe', { id: req.params.id }));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Microsserviço de notícias rodando na porta ${PORT}`);
});