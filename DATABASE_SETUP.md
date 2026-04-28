# Setup Banco de Dados - Tampets

## Para Desenvolvimento Local

### 1. Instalar PostgreSQL
- Download: https://www.postgresql.org/download/
- Ou use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`

### 2. Criar banco de dados local
```sql
CREATE DATABASE tampets_db;
```

### 3. Configurar variáveis de ambiente
Copie `.env.example` para `.env` e ajuste a `DATABASE_URL`:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tampets_db"
```

### 4. Instalar dependências e rodar migrations
```bash
npm install
npm run prisma:generate
npm run prisma:migrate:dev
```

### 5. Iniciar aplicação
```bash
npm run start:ms:ponto-coleta
npm run start:ms:relatorio-animais
# ... outros microserviços em outros terminais
```

---

## Para Deploy na Vercel

### 1. Configurar PostgreSQL em Cloud
Recomendações:
- **Railway.app** (fácil, $5/mês)
- **Neon** (free tier generoso)
- **Render** (free tier com limitações)
- **Aiven** (opcões pagas)

### 2. Copiar DATABASE_URL
Após criar banco em cloud, copie a connection string (ex: `postgresql://user:password@host:5432/database`)

### 3. Configurar em Vercel
1. Acesse dashboard.vercel.com
2. Vá para seu projeto Tampets
3. Settings > Environment Variables
4. Adicione `DATABASE_URL` com a string de cloud

### 4. Deploy
```bash
git push origin main
# Vercel detecta mudanças e faz build automático
# As migrations rodam durante o build via npm run prisma:migrate
```

---

## Informações Importantes

- O `package.json` agora tem:
  - `npm run prisma:migrate` - Executa migrations pendentes (para Vercel)
  - `npm run prisma:migrate:dev` - Dev com prompt interativo (para local)
  - `npm run prisma:generate` - Regenera Prisma Client

- No `vercel.json`, certifique-se de ter:
  - Rewrites apontando para `api/index.js`
  - Build command: `npm install && npm run prisma:generate`

- Variáveis de ambiente necessárias no Vercel:
  - `DATABASE_URL` (obrigatório)
  - `NODE_ENV=production` (recomendado)

---

## Troubleshooting

### Erro: "Error: P1000 Can't reach database server"
- Verifique se a string `DATABASE_URL` está correta
- Confira se o banco está rodando
- Para cloud: verifique IP whitelist/firewall

### Erro: "Prisma Client not generated"
```bash
npm run prisma:generate
```

### Resetar banco local
```bash
# Cuidado - deleta todos os dados!
npm run prisma:migrate:dev -- --skip-generate
# Escolha "reset" quando perguntado
```
