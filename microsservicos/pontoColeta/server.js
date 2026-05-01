const express = require("express");
const app = express();
const axios = require('axios');

app.use(express.json());

let pontos = [];
let pontosAprovados = [];


app.get("/admin/pontos-pendentes", (req, res) => {
    const pendentes = pontos.filter(p => String(p.status).toLowerCase() === "pendente");
    res.json(pendentes);
});


app.put("/admin/aprovar/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    const ponto = pontos.find(p => p.id === id);

    if (!ponto) {
        return res.status(404).json({ erro: "Ponto não encontrado" });
    }

    ponto.status = "Aprovado";

    const already = pontosAprovados.find(p => p.id === id);
    if (!already) pontosAprovados.push(ponto);

    const result = {
        mensagem: "Ponto aprovado com sucesso",
        ponto
    };

    const callbackUrl = process.env.UI_CALLBACK_URL;
    if (callbackUrl) {
        try {
            const resp = await axios.post(callbackUrl, ponto, { timeout: 5000 });
            result.callback = { ok: true, status: resp.status };
        } catch (err) {
            result.callback = { ok: false, error: err.message };
        }
    }

    res.json(result);

});


app.get("/pontos-coleta", (req, res) => {
    res.json(pontosAprovados);
});


app.get("/pontos-coleta/proximos", (req, res) => {

    const cidade = req.query.cidade;

    const resultados = pontosAprovados.filter(
        p => p.cidade.toLowerCase() === cidade.toLowerCase()
    );

    res.json(resultados);

});


app.listen(5500, () => {
    console.log("Microserviço rodando na porta 5500");
});