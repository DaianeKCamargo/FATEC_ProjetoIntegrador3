const express = require('express');
const app = express();

app.use(express.json());

const FATOR = 160;

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'ms-conversao-tampinhas' });
});

app.post('/converter', (req, res) => {
    const { kg } = req.body;

    if (kg === undefined || kg <= 0) {
        return res.status(400).json({
            message: "Valor inválido"
        });
    }

    return res.json({
        quantidade_tampinhas: Math.round(kg * FATOR)
    });
});

const PORT = process.env.CONVERSAO_TAMPINHAS_PORT || 5506;

app.listen(PORT, () => {
    console.log(`Microsserviço conversão tampinhas em execução na porta ${PORT}`);
});

module.exports = app;
