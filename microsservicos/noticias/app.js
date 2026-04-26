const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

const noticiasRoutes = require('./routes/NoticiasRoutes');
app.use('/api/noticias', noticiasRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Microsserviço de notícias rodando na porta ${PORT}`);
});