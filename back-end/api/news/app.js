const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const newsRoutes = require('./routes/newsRoute');
app.use('/api/news', newsRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'ms-noticias' });
});

const PORT = process.env.PORT || 5505;

app.listen(PORT, () => {
  console.log(`API de notícias rodando na porta ${PORT}`);
});