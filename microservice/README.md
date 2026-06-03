# Tampets Microservicos

Microservicos auxiliares do projeto Tampets. Eles complementam a API principal com funcionalidades independentes de conversao, revisao de pontos de coleta e envio de token de recuperacao de senha.

## Funcao do Projeto

A pasta `microservice/` agrupa servicos que podem ser executados separadamente da API principal:

- Conversao de kg de tampinhas para quantidade estimada de tampinhas.
- Estimativa de reducao de CO2 a partir da quantidade de tampinhas.
- Revisao de pontos de coleta aprovados/rejeitados.
- Envio de token de recuperacao de senha por email.

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
  caps-conversion-service/          Conversao de kg para tampinhas
  co2-conversion-service/           Conversao de tampinhas para estimativa de CO2
  collection-point-review-service/  Revisao de pontos de coleta
  reset-pass-email-service/         Envio de token de recuperacao por email
```

## Servicos e Portas

| Servico | Porta padrao | Healthcheck | Endpoint principal |
|---|---:|---|---|
| `caps-conversion-service` | `5506` | `GET /health` | `POST /converter` |
| `collection-point-review-service` | `5507` | `GET /health` | `GET /api/collection-point/approved` e `PATCH /api/collection-point/:id/status` |
| `co2-conversion-service` | `5508` | `GET /health` | `POST /converter` |
| `reset-pass-email-service` | `5509` | `GET /health` | `POST /api/reset-pass-email/send-token` |


## Como Rodar

Execute cada microservico em um terminal separado.

### Conversao de tampinhas

```bash
cd microservice/caps-conversion-service
npm install
npm start
```

### Conversao de CO2

```bash
cd microservice/co2-conversion-service
npm install
npm start
```

### Revisao de pontos de coleta

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

Para desenvolvimento com reinicio automatico no servico de email:

```bash
npm run dev
```

## Exemplos de Requisicao

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

### Enviar token de recuperacao

```http
POST http://localhost:5509/api/reset-pass-email/send-token
Content-Type: application/json

{
  "emailUser": "admin@tampets.com",
  "resetToken": "123456"
}
```
