# Tampets Back-end

Back-end do projeto Tampets, responsável pelas APIs REST, regras de negócio, validações, integracão com banco de dados e documentação Postman.

## Funcão do Projeto

O back-end centraliza os dados e operações do sistema Tampets. Ele gerencia administradores, autenticacão, recuperacão de senha, pontos de coleta, notícias, registros de tampinhas e registros de castrações.

O projeto pode rodar como uma API principal local ou como APIs separadas por domínio para desenvolvimento, testes e documentação.

## Ferramentas Utilizadas

- Node.js
- Express
- Prisma
- JavaScript
- TypeScript no arquivo de configuração do Prisma
- Zod
- cpf-cnpj-validator
- Axios
- bcrypt
- express-session
- dotenv
- Postman

## Estrutura Principal

```text
back-end/
  app/                         API principal local
  api/
    admin-users/               Administradores, login e recuperacao de senha
    animals-registration/      Registros de castracoes
    caps-registration/         Registros de tampinhas
    collection-point/          Pontos de coleta
    news/                      Noticias
  lib/prisma/                  Schema e cliente Prisma compartilhado
  prisma.config.ts             Configuracao do Prisma
  Tampets.postman_collection.json
```

## Banco de Dados

O back-end usa Prisma para acessar o banco configurado pela variável `DATABASE_URL`.

Modelos principais:

- `AdminUser`
- `News`
- `PointCollection`
- `AddressPoint`
- `RegistrosAnimais`
- `CapsRegistration`


## Como Rodar

### Instalar dependencias

```bash
cd back-end
npm install
```

### Gerar Prisma Client

```bash
npm run prisma:generate
```

### Rodar migrações em desenvolvimento

```bash
npm run prisma:migrate:dev
```

### Rodar migrações em deploy/produção

```bash
npm run prisma:migrate
```

### Rodar API principal

```bash
npm start
```

A API princípal fica disponível em:

```text
http://localhost:5500
```

## Como Rodar APIs por Domínio

Execute dentro da pasta `back-end/`, em terminais separados quando precisar testar cada domínio de forma isolada.

```bash
npm run start:ms:collection-point
npm run start:ms:admin-users
npm run start:ms:animals-registration
npm run start:ms:caps-registration
npm run start:ms:news
```

## Portas

| API | Porta | Base local |
|---|---:|---|
| API principal | `5500` | `http://localhost:5500` |
| Pontos de coleta | `5501` | `http://localhost:5501/api/collection-point` |
| Admin users | `5502` | `http://localhost:5502/api/credentials` |
| Registros de animais | `5503` | `http://localhost:5503/api/animals-registration` |
| Registros de tampinhas | `5504` | `http://localhost:5504/api/caps-registration` |
| Noticias | `5505` | `http://localhost:5505/api/news` |

## Rotas Principais

### API principal

- `GET /health`
- `GET /api/health`
- `/api/credentials`
- `/api/animals-registration`
- `/api/caps-registration`
- `/api/collection-point`
- `/api/news`

### Admin users

- `GET /`
- `GET /:idAdmin`
- `POST /`
- `PUT /:idAdmin`
- `DELETE /:idAdmin`
- `POST /login`
- `POST /logout`
- `POST /recuperacao/solicitar`
- `POST /recuperacao/validar`
- `POST /recuperacao/redefinir`

### Pontos de coleta

- `GET /`
- `GET /approved`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`
- `PATCH /:id/status`

Para criar ponto de coleta, o endereço deve incluir `latitude` e `longitude`.

### Notícias, animais e tampinhas

Cada modulo possui rotas CRUD:

- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

## Documentação Postman

A collection atualizada fica em:

```text
back-end/Tampets.postman_collection.json
```

Ela cobre:

- Healthchecks.
- API principal.
- Admin users, login, logout e recuperação de senha.
- Pontos de coleta, incluindo aprovação e reprovação.
- Notícias.
- Registros de animais.
- Registros de tampinhas.
- Conversão de tampinhas.
- Conversão de CO2.
- Envio de token por email.

## Scripts Disponíveis

| Script | Função |
|---|---|
| `npm start` | Roda a API principal |
| `npm run start:app` | Roda a API principal |
| `npm run start:ms:collection-point` | Roda a API de pontos de coleta |
| `npm run start:ms:news` | Roda a API de notícias |
| `npm run start:ms:admin-users` | Roda a API de administradores |
| `npm run start:ms:animals-registration` | Roda a API de registros de animais |
| `npm run start:ms:caps-registration` | Roda a API de registros de tampinhas |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:migrate:dev` | Executa migrações em desenvolvimento |
| `npm run prisma:migrate` | Executa migrações em deploy/produção |
| `npm run prisma:studio` | Abre o Prisma Studio |
