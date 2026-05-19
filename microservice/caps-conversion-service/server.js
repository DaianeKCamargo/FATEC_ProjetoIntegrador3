const express = require('express');
const app = express();

app.use(express.json());

const FATOR = 500; // 1 kg de tampinhas equivale a 500 tampinhas

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'ms-conversao-tampinhas' });
});

app.post('/converter', (req, res) => {
    try {
        const { kg } = req.body;

        // Validação melhorada
        if (typeof kg !== 'number' || kg === undefined) {
            return res.status(400).json({
                message: "Valor inválido - kg deve ser um número"
            });
        }

        if (kg <= 0) {
            return res.status(400).json({
                message: "Valor inválido - kg deve ser maior que 0"
            });
        }

        const quantidade_tampinhas = Math.round(kg * FATOR);

        return res.json({
            quantidade_tampinhas,
            kg_entrada: kg,
            fator_conversao: FATOR
        });
    } catch (error) {
        console.error('Erro na conversão:', error);
        return res.status(500).json({
            message: "Erro interno do servidor"
        });
    }
});

// Tratamento global de erros
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({ message: "Erro interno do servidor" });
});

const PORT = process.env.CONVERSAO_TAMPINHAS_PORT || 5506;

app.listen(PORT, () => {
    console.log(`Microsserviço conversão tampinhas em execução na porta ${PORT}`);
});

module.exports = app;