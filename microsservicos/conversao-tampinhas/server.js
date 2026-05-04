const express = require('express');
const app = express();

app.use(express.json());

const FATOR = 160;

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

app.listen(4000, () => {
    console.log("Microserviço rodando na porta 4000");
});