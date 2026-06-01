# Reset Pass Email Service

Microsservico responsavel por enviar e-mail com token de recuperacao de senha.

## Endpoints

- `GET /health`
  - Retorna status do servico.

- `POST /api/reset-pass-email/send-token`
  - Envia o token de recuperacao para o e-mail informado.

### Payload esperado

```json
{
  "email": "cliente@exemplo.com",
  "token": "A1B2C3",
  "userName": "Cliente",
  "expiresInMinutes": 15,
  "subject": "Token de recuperacao de senha - Tampets"
}
```

## Configuracao

1. Copie `.env.example` para `.env`.
2. Configure os dados SMTP.
3. Instale as dependencias:

```bash
npm install
```

4. Rode em desenvolvimento:

```bash
npm run dev
```

5. Ou em producao:

```bash
npm start
```

## Integracao futura com admin-users

A API `admin-users` podera chamar `POST /api/reset-pass-email/send-token` sempre que o usuario solicitar recuperacao de senha.
