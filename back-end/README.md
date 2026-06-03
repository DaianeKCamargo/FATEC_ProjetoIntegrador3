# Tampets Back-end

Back-end do projeto Tampets, responsavel pelas APIs REST, regras de negocio, validacoes, integracao com banco de dados e documentacao Postman.

## Funcao do Projeto

O back-end centraliza os dados e operacoes do sistema Tampets. Ele gerencia administradores, autenticacao, recuperacao de senha, pontos de coleta, noticias, registros de tampinhas e registros de castracoes.

O projeto pode rodar como uma API principal local ou como APIs separadas por dominio para desenvolvimento, testes e documentacao.

## Ferramentas Utilizadas

- Node.js
- Express
- Prisma
- JavaScript
- TypeScript no arquivo de configuracao do Prisma
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

O back-end usa Prisma para acessar o banco configurado pela variavel `DATABASE_URL`.

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

### Rodar migracoes em desenvolvimento

```bash
npm run prisma:migrate:dev
```

### Rodar migracoes em deploy/producao

```bash
npm run prisma:migrate
```

### Rodar API principal

```bash
npm start
```

A API principal fica disponivel em:

```text
http://localhost:5500
```

## Como Rodar APIs por Dominio

Execute dentro da pasta `back-end/`, em terminais separados quando precisar testar cada dominio de forma isolada.

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

Para criar ponto de coleta, o endereco deve incluir `latitude` e `longitude`.

### Noticias, animais e tampinhas

Cada modulo possui rotas CRUD:

- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

## Documentacao Postman

A collection atualizada fica em:

```text
back-end/Tampets.postman_collection.json
```

Ela cobre:

- Healthchecks.
- API principal.
- Admin users, login, logout e recuperacao de senha.
- Pontos de coleta, incluindo aprovacao e reprovacao.
- Noticias.
- Registros de animais.
- Registros de tampinhas.
- Conversao de tampinhas.
- Conversao de CO2.
- Envio de token por email.

## Scripts Disponiveis

| Script | Funcao |
|---|---|
| `npm start` | Roda a API principal |
| `npm run start:app` | Roda a API principal |
| `npm run start:ms:collection-point` | Roda a API de pontos de coleta |
| `npm run start:ms:news` | Roda a API de noticias |
| `npm run start:ms:admin-users` | Roda a API de administradores |
| `npm run start:ms:animals-registration` | Roda a API de registros de animais |
| `npm run start:ms:caps-registration` | Roda a API de registros de tampinhas |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:migrate:dev` | Executa migracoes em desenvolvimento |
| `npm run prisma:migrate` | Executa migracoes em deploy/producao |
| `npm run prisma:studio` | Abre o Prisma Studio |
