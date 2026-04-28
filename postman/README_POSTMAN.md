# Guia Postman - Tampets

Este guia descreve como usar as colecoes Postman do projeto Tampets no ambiente local.

## Colecoes disponiveis

- `Tampets.postman_collection.json`: colecao consolidada da app principal e dos microservicos.
- `microsservicos/ponto-coleta/ponto-coleta.postman_collection.json`: colecao focada no microservico de ponto de coleta.

## URLs base padrao

- `app`: `http://localhost:5500`
- `msPontoColeta`: `http://localhost:5501`
- `msAutenticacao`: `http://localhost:5502`
- `msRelatorioAnimais`: `http://localhost:5503`
- `msRelatorioTampinhas`: `http://localhost:5504`
- `msNoticias`: `http://localhost:5505`

## Cobertura da colecao consolidada

### Healthchecks

- `GET {{app}}/health`
- `GET {{msPontoColeta}}/health`
- `GET {{msAutenticacao}}/health`
- `GET {{msRelatorioAnimais}}/health`
- `GET {{msRelatorioTampinhas}}/health`

Observacao: o microservico de noticias nao possui endpoint `/health` no momento.

### App principal

- Usuarios: `GET/POST/GET by id/PUT/DELETE` em `/api/usuarios`
- Pontos de coleta: `GET/POST/GET by id/PUT/DELETE` em `/api/pontos-coleta`
- Noticias: `GET/POST/GET by id/PUT/DELETE` em `/api/noticias`

### MS Ponto Coleta

- Criar request: `POST /api/pontos-coleta/requests`
- Listar requests: `GET /api/pontos-coleta/requests`
- Filtrar por status: `GET /api/pontos-coleta/requests?status=PENDENTE`
- Buscar por id: `GET /api/pontos-coleta/requests/:id`
- Atualizar request: `PATCH /api/pontos-coleta/requests/:id`
- Revisar request: `PATCH /api/pontos-coleta/requests/:id/review`
- Listar aprovados: `GET /api/pontos-coleta/approved`

### MS Autenticacao

- Credenciais: `GET/POST/GET by id/PUT/DELETE` em `/api/credenciais`
- Login: `POST /api/credenciais/login`

### MS Relatorio Animais

- Relatorios: `GET/POST/GET by id/PUT/DELETE` em `/api/relatorios-animais`

### MS Relatorio Tampinhas

- Relatorios: `GET/POST/GET by id/PUT/DELETE` em `/api/relatorios-tampinhas`

### MS Noticias

- Noticias: `GET/POST/GET by id/PUT/DELETE` em `/api/noticias`

## Como importar

1. Abra o Postman.
2. Clique em Import.
3. Selecione a colecao desejada.
4. Execute os scripts locais do projeto para disponibilizar os servicos.
5. Ajuste as variaveis da colecao, se necessario.
