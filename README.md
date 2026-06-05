# PROJETO INTEGRADOR: TAMPETS

Solução de software end-to-end para apoiar o projeto beneficente Tampets na arrecadação de tampinhas, gestão de pontos de coleta, da visibilidade do projeto na mídia e atrair mais voluntários para o projeto.

## Integrantes

- Daiane Kelly de Almeida Camargo
- Maria Eduarda Moreno Lopes
- Nicolas de Oliveira Dias
- Nicole Janine Bolzani Oliveira
- Sabrina Sant'Ana da Silva Alves

## Visao Geral

O projeto beneficente Tampets surgiu em 2019 com o objetivo de diminuir a quantidade de animais em situação de rua, apoiando a castração de cães e gatos por meio da arrecadacão de tampinhas plásticas.

Este repositório contém a solução completa desenvolvida para o Projeto Integrador do 3° Semestre. A aplicação possuí uma interface web para usuários e administradores, uma API principal, APIs por domínio e microserviços auxiliares. O objetivo é centralizar os dados do projeto, facilitar a gestão das informações e melhorar a transparência das ações realizadas.

## Problema de Negócio

O crescimento da populacão de animais em situacão de rua é um problema recorrente, causado principalmente pela reprodução descontrolada, abandono e falta de conscientização. Projetos beneficentes atuam na arrecadação de recursos para castrações, mas a gestão manual de pontos de coleta, arrecadações, notícias e registros de animais pode gerar retrabalho, perda de informação e baixa visibilidade dos resultados.

Dessa forma, existe a necessidade de uma solução digital que organize os processos do projeto Tampets e facilite o acompanhamento das ações por administradores, voluntários, parceiros e comunidade.

## Solução Proposta

A solução proposta e um sistema web integrado a uma API RESTful. O sistema permite que usuários consultem informações do projeto, vejam pontos de coleta aprovados e acompanhem notícias. A área administrativa permite gerenciar notícias, registros de tampinhas, castrações, pontos de coleta e usuários administradores.

O back-end concentra as regras de negócio, persistência dos dados e integrações com microserviços. Os microserviços complementam a aplicação com conversões ambientais, revisão de pontos de coleta e envio de token para recuperacão de senha.

## Estrutura do Repositório

```text
FATEC_ProjetoIntegrador3/
  front-end/        Aplicacao web em Next.js para usuarios e administradores
  back-end/         API principal, APIs por dominio, Prisma e collection Postman
  microservice/     Microservicos auxiliares do projeto
```

## Partes do Projeto

### Front-end

Aplicação web responsável pelas telas públicas e administrativas. Contém a home, páginas institucionais, ajuda, notícias, pontos de coleta, login administrativo e paineis de gestão.

Documentacao especifica: `front-end/README.md`

### Back-end

API responsavel pelas regras de negocio, rotas REST, conexao com banco de dados, autenticacao de administradores e registros principais do sistema.

Documentacao especifica: `back-end/README.md`

### Microservicos

Servicos auxiliares independentes para conversao de tampinhas, estimativa de CO2 evitado, revisao de pontos de coleta e envio de token de recuperacao de senha por email.

Documentacao especifica: `microservice/README.md`

## Arquitetura da Solução

O sistema é dividido em:

- Interface do usuário: visualização de dados, notícias, informações do projeto e pontos de coleta.
- Interface do administrador: gerenciamento completo de notícias, arrecadacões, castrações, pontos de coleta e administradores.
- Back-end/API: regras de negocio, validações, rotas REST e persistência dos dados.
- Banco de dados: armazenamento de notícias, pontos de coleta, administradores, registros de animais e registros de tampinhas.
- Microserviços: funcionalidades complementares executadas de forma independente.

## Tecnologias Utilizadas

- Front-end: Next.js, React, TypeScript, Bootstrap, Tailwind CSS, Axios, Recharts, Lucide React
- Back-end: Node.js, Express, Prisma, Zod, Axios, bcrypt, express-session
- Microserviços: Node.js, Express, HTTP nativo e Nodemailer
- Banco de dados: banco relacional configurado via `DATABASE_URL`
- Documentação de API: Postman
- Infraestrutura/deploy: Vercel
- Versionamento: Git e GitHub
- Gestão e prototipação: Jira, Confluence e Figma

## Funcionalidades

- Login, logout e recuperação de senha de administradores.
- Cadastro, edição, listagem e exclusão de administradores.
- Cadastro público de pontos de coleta.
- Aprovação, reprovação, edição, listagem e exclusão de pontos de coleta.
- Listagem pública de pontos de coleta aprovados.
- Cadastro, edição, listagem e exclusão de notícias.
- Registro de arrecadação de tampinhas por data e quantidade em kg.
- Conversão de kg de tampinhas para quantidade estimada de tampinhas.
- Estimativa de redução de CO2 com base na quantidade de tampinhas.
- Registro de castracões por data, tipo de animal e quantidade.
- Healthchecks para API principal, APIs por domínio e microserviços.

## Portas Padrao

| Serviço | Porta |
|---|---:|
| Front-end | `3000` |
| API principal | `5500` |
| API ponto de coleta | `5501` |
| API admin users | `5502` |
| API registros de animais | `5503` |
| API registros de tampinhas | `5504` |
| API noticias | `5505` |
| Microserviço conversão de tampinhas | `5506` |
| Microserviço revisão de pontos de coleta | `5507` |
| Microserviço conversão de CO2 | `5508` |
| Microserviço envio de token por email | `5509` |

## Documentação do Projeto

- Confluence: https://projetointegradortampets.atlassian.net/wiki/spaces/PIT/overview
- Jira: https://meupi2026.atlassian.net/jira/software/projects/TP/summary
- Figma: https://www.figma.com/proto/mtIcD2QxLWZ79KkHnIds0n/Site?node-id=0-1&t=xRFWEgf0wMYKvXt2-1

## Documentacão Postman

A collection atualizada da API fica em:

```text
back-end/Tampets.postman_collection.json
```

Ela cobre API principal, APIs por domínio, healthchecks, admin users, pontos de coleta, notícias, registros de animais, registros de tampinhas, conversão de tampinhas, conversão de CO2 e envio de token de recuperação.

## Como Executar o Produto

Consulte os READMEs específicos para rodar cada parte do projeto:

- `front-end/README.md`
- `back-end/README.md`
- `microservice/README.md`

Fluxo básico local:

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

- Redução da quantidade de animais em situacao de rua.
- Melhor organização e controle do projeto beneficente.
- Maior transparência dos dados de arrecadação e castração.
- Facilidade na gestão de pontos de coleta.
- Base escalavel para evolução futura da solução.
