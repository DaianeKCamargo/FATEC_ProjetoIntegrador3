const http = require('http');

const PORT = Number(process.env.CONVERSAO_CO2_PORT || 5508);
const PESO_MEDIO_TAMPINHA_GRAMAS = Number(process.env.PESO_MEDIO_TAMPINHA_GRAMAS || 2);
const FATOR_CO2_KG_POR_KG = Number(process.env.FATOR_CO2_KG_POR_KG || 1.9);

function toPositiveNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function calculateCo2Reduction(tampinhas, overrides = {}) {
    const pesoMedioGramas = toPositiveNumber(overrides.pesoMedioGramas) || PESO_MEDIO_TAMPINHA_GRAMAS;
    const fatorCo2KgPorKg = toPositiveNumber(overrides.fatorCo2KgPorKg) || FATOR_CO2_KG_POR_KG;

    const massaKg = (tampinhas * pesoMedioGramas) / 1000;
    const co2EvitadoKg = massaKg * fatorCo2KgPorKg;

    return {
        tampinhas,
        peso_medio_tampinha_gramas: pesoMedioGramas,
        massa_reciclada_kg: Number(massaKg.toFixed(6)),
        fator_co2_kg_por_kg: fatorCo2KgPorKg,
        co2_evitado_kg: Number(co2EvitadoKg.toFixed(6)),
        co2_evitado_g: Number((co2EvitadoKg * 1000).toFixed(3)),
        formula:
            'CO2 evitado = (quantidade de tampinhas × peso medio da tampinha em gramas / 1000) × fator de emissao evitado em kg CO2e por kg de plastico',
        observacao:
            'Estimativa tecnica configuravel. Para uso oficial, os fatores devem ser validados por um engenheiro ambiental ou por estudo de ACV.',
    };
}

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let rawBody = '';

        req.on('data', (chunk) => {
            rawBody += chunk;

            if (rawBody.length > 1_000_000) {
                reject(new Error('Payload muito grande'));
                req.destroy();
            }
        });

        req.on('end', () => {
            if (!rawBody) {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(rawBody));
            } catch (error) {
                reject(new Error('JSON invalido'));
            }
        });

        req.on('error', reject);
    });
}

const server = http.createServer(async (req, res) => {
    try {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

        if (req.method === 'GET' && url.pathname === '/health') {
            sendJson(res, 200, {
                status: 'ok',
                service: 'ms-conversao-co2',
            });
            return;
        }

        if (req.method === 'GET' && url.pathname === '/') {
            sendJson(res, 200, {
                service: 'ms-conversao-co2',
                endpoints: {
                    health: 'GET /health',
                    converter: 'POST /converter',
                },
                exemplo: {
                    tampinhas: 1000,
                },
            });
            return;
        }

        if (req.method === 'POST' && url.pathname === '/converter') {
            const body = await parseBody(req);
            const tampinhas = toPositiveNumber(body.tampinhas ?? body.quantidade ?? body.unidades);

            if (!tampinhas || !Number.isInteger(tampinhas)) {
                sendJson(res, 400, {
                    message: 'Informe a quantidade de tampinhas em unidades como um numero inteiro maior que 0.',
                });
                return;
            }

            const resultado = calculateCo2Reduction(tampinhas, {
                pesoMedioGramas: body.pesoMedioGramas,
                fatorCo2KgPorKg: body.fatorCo2KgPorKg,
            });

            sendJson(res, 200, resultado);
            return;
        }

        sendJson(res, 404, {
            message: 'Rota nao encontrada',
        });
    } catch (error) {
        console.error('Erro no microsservico de conversao de CO2:', error);
        sendJson(res, 500, {
            message: 'Erro interno do servidor',
        });
    }
});

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Microsservico de conversao de CO2 em execucao na porta ${PORT}`);
    });
}

module.exports = {
    server,
    calculateCo2Reduction,
};