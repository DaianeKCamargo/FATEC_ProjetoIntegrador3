# PROJETO INTEGRADOR: TAMPETS

Solucao de software end-to-end para apoiar o projeto beneficente Tampets na arrecadacao de tampinhas, gestao de pontos de coleta, controle de castracoes e divulgacao de noticias.

## Integrantes

- Daiane Kelly de Almeida Camargo
- Maria Eduarda Moreno Lopes
- Nicolas de Oliveira Dias
- Nicole Janine Bolzani Oliveira
- Sabrina Sant'Ana da Silva Alves

## Visao Geral

O projeto beneficente Tampets surgiu em 2019 com o objetivo de diminuir a quantidade de animais em situacao de rua, apoiando a castracao de caes e gatos por meio da arrecadacao de tampinhas plasticas.

Este repositorio contem a solucao completa desenvolvida para o Projeto Integrador III. A aplicacao possui uma interface web para usuarios e administradores, uma API principal, APIs por dominio e microservicos auxiliares. O objetivo e centralizar os dados do projeto, facilitar a gestao das informacoes e melhorar a transparencia das acoes realizadas.

## Problema de Negocio

O crescimento da populacao de animais em situacao de rua e um problema recorrente, causado principalmente pela reproducao descontrolada, abandono e falta de conscientizacao. Projetos beneficentes atuam na arrecadacao de recursos para castracoes, mas a gestao manual de pontos de coleta, arrecadacoes, noticias e registros de animais pode gerar retrabalho, perda de informacao e baixa visibilidade dos resultados.

Dessa forma, existe a necessidade de uma solucao digital que organize os processos do projeto Tampets e facilite o acompanhamento das acoes por administradores, voluntarios, parceiros e comunidade.

## Solucao Proposta

A solucao proposta e um sistema web integrado a uma API RESTful. O sistema permite que usuarios consultem informacoes do projeto, vejam pontos de coleta aprovados e acompanhem noticias. A area administrativa permite gerenciar noticias, registros de tampinhas, castracoes, pontos de coleta e usuarios administradores.

O back-end concentra as regras de negocio, persistencia dos dados e integracoes com microservicos. Os microservicos complementam a aplicacao com conversoes ambientais, revisao de pontos de coleta e envio de token para recuperacao de senha.

## Estrutura do Repositorio

```text
FATEC_ProjetoIntegrador3/
  front-end/        Aplicacao web em Next.js para usuarios e administradores
  back-end/         API principal, APIs por dominio, Prisma e collection Postman
  microservice/     Microservicos auxiliares do projeto
```

## Partes do Projeto

### Front-end

Aplicacao web responsavel pelas telas publicas e administrativas. Contem a home, paginas institucionais, ajuda, noticias, pontos de coleta, login administrativo e paineis de gestao.

Documentacao especifica: `front-end/README.md`

### Back-end

API responsavel pelas regras de negocio, rotas REST, conexao com banco de dados, autenticacao de administradores e registros principais do sistema.

Documentacao especifica: `back-end/README.md`

### Microservicos

Servicos auxiliares independentes para conversao de tampinhas, estimativa de CO2 evitado, revisao de pontos de coleta e envio de token de recuperacao de senha por email.

Documentacao especifica: `microservice/README.md`

## Arquitetura da Solucao

O sistema e dividido em:

- Interface do usuario: visualizacao de dados, noticias, informacoes do projeto e pontos de coleta.
- Interface do administrador: gerenciamento completo de noticias, arrecadacoes, castracoes, pontos de coleta e administradores.
- Back-end/API: regras de negocio, validacoes, rotas REST e persistencia dos dados.
- Banco de dados: armazenamento de noticias, pontos de coleta, administradores, registros de animais e registros de tampinhas.
- Microservicos: funcionalidades complementares executadas de forma independente.

## Tecnologias Utilizadas

- Front-end: Next.js, React, TypeScript, Bootstrap, Tailwind CSS, Axios, Recharts, Lucide React
- Back-end: Node.js, Express, Prisma, Zod, Axios, bcrypt, express-session
- Microservicos: Node.js, Express, HTTP nativo e Nodemailer
- Banco de dados: banco relacional configurado via `DATABASE_URL`
- Documentacao de API: Postman
- Infraestrutura/deploy: Vercel
- Versionamento: Git e GitHub
- Gestao e prototipacao: Jira, Confluence e Figma

## Funcionalidades

- Login, logout e recuperacao de senha de administradores.
- Cadastro, edicao, listagem e exclusao de administradores.
- Cadastro publico de pontos de coleta.
- Aprovacao, reprovacao, edicao, listagem e exclusao de pontos de coleta.
- Listagem publica de pontos de coleta aprovados.
- Cadastro, edicao, listagem e exclusao de noticias.
- Registro de arrecadacao de tampinhas por data e quantidade em kg.
- Conversao de kg de tampinhas para quantidade estimada de tampinhas.
- Estimativa de reducao de CO2 com base na quantidade de tampinhas.
- Registro de castracoes por data, tipo de animal e quantidade.
- Healthchecks para API principal, APIs por dominio e microservicos.

## Portas Padrao

| Servico | Porta |
|---|---:|
| Front-end | `3000` |
| API principal | `5500` |
| API ponto de coleta | `5501` |
| API admin users | `5502` |
| API registros de animais | `5503` |
| API registros de tampinhas | `5504` |
| API noticias | `5505` |
| Microservico conversao de tampinhas | `5506` |
| Microservico revisao de pontos de coleta | `5507` |
| Microservico conversao de CO2 | `5508` |
| Microservico envio de token por email | `5509` |

## Documentacao do Projeto

- Confluence: https://projetointegradortampets.atlassian.net/wiki/spaces/PIT/overview
- Jira: https://meupi2026.atlassian.net/jira/software/projects/TP/summary
- Figma: https://www.figma.com/proto/mtIcD2QxLWZ79KkHnIds0n/Site?node-id=0-1&t=xRFWEgf0wMYKvXt2-1

## Documentacao Postman

A collection atualizada da API fica em:

```text
back-end/Tampets.postman_collection.json
```

Ela cobre API principal, APIs por dominio, healthchecks, admin users, pontos de coleta, noticias, registros de animais, registros de tampinhas, conversao de tampinhas, conversao de CO2 e envio de token de recuperacao.

## Como Executar o Produto

Consulte os READMEs especificos para rodar cada parte do projeto:

- `front-end/README.md`
- `back-end/README.md`
- `microservice/README.md`

Fluxo basico local:

```bash
cd back-end
npm install
npm run prisma:generate
npm run prisma:migrate:dev
npm start
```

```bash
cd front-end
npm install
npm run dev
```

## Resultados Esperados

- Reducao da quantidade de animais em situacao de rua.
- Melhor organizacao e controle do projeto beneficente.
- Maior transparencia dos dados de arrecadacao e castracao.
- Facilidade na gestao de pontos de coleta.
- Base escalavel para evolucao futura da solucao.
