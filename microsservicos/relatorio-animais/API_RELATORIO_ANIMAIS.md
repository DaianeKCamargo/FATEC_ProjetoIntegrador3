# API - Microservico Relatorio de Animais

Documentacao exclusiva do microservico de relatorio de animais.

---

## Base URL

- Local: `http://localhost:5503`
- Prefixo das rotas: `/api/relatorios-animais`

---

## Healthcheck

### GET /health

Valida se o servico esta ativo.

### Resposta 200

```json
{
  "status": "ok",
  "service": "ms-relatorio-animais"
}