# API - Microservico Ponto de Coleta

Documentacao exclusiva do microservico de ponto de coleta.

## Base URL

- Local: `http://localhost:5501`
- Prefixo das rotas: `/api/pontos-coleta`

## Healthcheck

### GET /health

Valida se o servico esta ativo.

Resposta 200 (exemplo):

```json
{
  "status": "ok",
  "service": "ms-ponto-coleta",
  "database": "configured"
}
```

## Regras de negocio

- Toda nova solicitacao entra com status `PENDENTE`.
- Somente solicitacoes `PENDENTE` podem ser editadas.
- Revisao aceita apenas `APPROVE` ou `REJECT`.
- Ao aprovar: dados sao copiados para tabela definitiva e a solicitacao recebe status `APROVADO`.
- Ao recusar: solicitacao permanece historica com status `RECUSADO` e motivo opcional.

## Validacoes de entrada

- `cpfUser`: CPF valido.
- `cpnjPoint`: CNPJ valido.
- `emailUser`: email valido.
- `hourInit` e `hour`: formato `HH:mm`.
- `postCode`: 8 digitos.
- Campos obrigatorios no cadastro: `opensPc`, `nameUser`, `linkPhoto`, `cpfUser`, `cpnjPoint`, `emailUser`, `celUser`, `namePoint`, `hourInit`, `hour`, `address`.

## Endpoints

### 1) Criar solicitacao

- Metodo: `POST`
- Rota: `/api/pontos-coleta/requests`

Body (exemplo):

```json
{
  "opensPc": true,
  "nameUser": "Daiane Camargo",
  "linkPhoto": "https://images.example.com/ponto-centro.jpg",
  "cpfUser": "11144477735",
  "cpnjPoint": "11222333000181",
  "emailUser": "daiane@email.com",
  "celUser": "11988887777",
  "namePoint": "Ponto Centro",
  "hourInit": "08:00",
  "hour": "18:00",
  "address": {
    "street": "Rua das Flores",
    "number": "100",
    "complement": "Sala 2",
    "district": "Centro",
    "city": "Sao Paulo",
    "postCode": "01001000"
  }
}
```

Resposta 201: objeto criado com `idPc`, `status`, endereco e metadados.

### 2) Listar solicitacoes

- Metodo: `GET`
- Rota: `/api/pontos-coleta/requests`
- Query opcional: `status=PENDENTE|APROVADO|RECUSADO`

Exemplos:

- `/api/pontos-coleta/requests`
- `/api/pontos-coleta/requests?status=PENDENTE`

Resposta 200: lista de solicitacoes.

### 3) Buscar solicitacao por ID

- Metodo: `GET`
- Rota: `/api/pontos-coleta/requests/:id`

Resposta 200: solicitacao encontrada.

Resposta 404 (exemplo):

```json
{
  "message": "Solicitacao de ponto de coleta nao encontrada"
}
```

### 4) Atualizar solicitacao

- Metodo: `PATCH`
- Rota: `/api/pontos-coleta/requests/:id`

Body parcial (exemplo):

```json
{
  "hourInit": "09:00",
  "hour": "19:00",
  "address": {
    "street": "Rua das Flores",
    "number": "120",
    "complement": "Sala 2",
    "district": "Centro",
    "city": "Sao Paulo",
    "postCode": "01001000"
  }
}
```

Respostas:

- 200: atualizado
- 400: payload invalido
- 409: solicitacao nao esta `PENDENTE`

### 5) Revisar solicitacao (aprovar ou recusar)

- Metodo: `PATCH`
- Rota: `/api/pontos-coleta/requests/:id/review`

Body para aprovar:

```json
{
  "decision": "APPROVE",
  "reason": "Documentacao validada"
}
```

Body para recusar:

```json
{
  "decision": "REJECT",
  "reason": "Endereco inconsistente"
}
```

Resposta 200 (APPROVE):

```json
{
  "reviewed": {
    "idPc": 1,
    "status": "APROVADO"
  },
  "approved": {
    "idPcApproved": 1
  }
}
```

Resposta 200 (REJECT):

```json
{
  "reviewed": {
    "idPc": 2,
    "status": "RECUSADO"
  },
  "approved": null
}
```

### 6) Listar pontos aprovados

- Metodo: `GET`
- Rota: `/api/pontos-coleta/approved`

Resposta 200: lista de pontos da base definitiva.

## Erros padrao

### 400 - Validacao

```json
{
  "message": "Dados invalidos",
  "errors": [
    {
      "field": "cpfUser",
      "message": "cpfUser invalido"
    }
  ]
}
```

### 409 - Conflito de status

```json
{
  "message": "Solicitacao ja revisada anteriormente"
}
```

### 500 - Erro interno

```json
{
  "message": "Erro interno do servidor"
}
```
