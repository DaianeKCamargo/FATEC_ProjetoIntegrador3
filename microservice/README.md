# Tampets Microservicos

Microserviços auxiliares do projeto Tampets. Eles complementam a API princípal com funcionalidades independentes de conversão, revisão de pontos de coleta e envio de token de recuperação de senha.

## Função do Projeto

A pasta `microservice/` agrupa serviços que podem ser executados separadamente da API princípal:

- Conversão de kg de tampinhas para quantidade estimada de tampinhas.
- Estimativa de redulão de CO2 à partir da quantidade de tampinhas.
- Revisão de pontos de coleta aprovados/rejeitados.
- Envio de token de recuperação de senha por email.

## Ferramentas Utilizadas

- Node.js
- Express
- HTTP nativo do Node.js
- Prisma
- Axios
- dotenv
- Nodemailer
- nodemon

## Estrutura

```text
microservice/
  caps-conversion-service/          Conversão de kg para tampinhas
  co2-conversion-service/           Conversão de tampinhas para estimativa de CO2
  collection-point-review-service/  Revisão de pontos de coleta
  reset-pass-email-service/         Envio de token de recuperacão por email
```

## Servicos e Portas

| Serviço | Porta padrão | Healthcheck | Endpoint princípal |
|---|---:|---|---|
| `caps-conversion-service` | `5506` | `GET /health` | `POST /converter` |
| `collection-point-review-service` | `5507` | `GET /health` | `GET /api/collection-point/approved` e `PATCH /api/collection-point/:id/status` |
| `co2-conversion-service` | `5508` | `GET /health` | `POST /converter` |
| `reset-pass-email-service` | `5509` | `GET /health` | `POST /api/reset-pass-email/send-token` |


## Como Rodar

Execute cada microserviço em um terminal separado.

### Conversão de tampinhas

```bash
cd microservice/caps-conversion-service
npm install
npm start
```

### Conversão de CO2

```bash
cd microservice/co2-conversion-service
npm install
npm start
```

### Revisão de pontos de coleta

```bash
cd microservice/collection-point-review-service
npm install
npm run prisma:generate
npm start
```

### Envio de token por email

```bash
cd microservice/reset-pass-email-service
npm install
npm start
```

Para desenvolvimento com reinicio automático no serviço de email:

```bash
npm run dev
```

## Exemplos de Requisição

### Converter kg em tampinhas

```http
POST http://localhost:5506/converter
Content-Type: application/json

{
  "kg": 12.5
}
```

### Converter tampinhas em CO2 evitado

```http
POST http://localhost:5508/converter
Content-Type: application/json

{
  "tampinhas": 5000,
  "pesoMedioGramas": 2.5,
  "fatorCo2KgPorKg": 2.7
}
```

### Enviar token de recuperação

```http
POST http://localhost:5509/api/reset-pass-email/send-token
Content-Type: application/json

{
  "emailUser": "admin@tampets.com",
  "resetToken": "123456"
}
```
