# PROJETO INTEGRADOR: TAMPETS 🐱🐶

Solução de Software end-to-end para arrecadação de fundos e apoio à castração de animais em situação de rua.

## Integrantes:

Daiane Kelly de Almeida Camargo;
Maria Eduarda Moreno Lopes;
Nícolas de Oliveira Dias;
Nicole Janine Bolzani Oliveira;
Sabrina Sant'Ana da Silva Alves;



## Visão Geral

Este projeto tem como objetivo desenvolver uma solução completa de software, abrangendo todo o ciclo de vida de desenvolvimento: desde o levantamento de requisitos até a implementação, testes e disponibilização da aplicação.

A solução foi projetada para resolver um problema real de negócio, utilizando boas práticas de engenharia de software, arquitetura escalável e tecnologias modernas de desenvolvimento.

O projeto beneficente Tampets surgiu em 2019 pela idealizadora Lia, com o objetivo de diminuir a quantidade de animais nas ruas, focando na redução da reprodução de cães e gatos por meio da castração. 


## Problema de Negócio

O crescimento da população de animais em situação de rua é um problema recorrente, causado principalmente pela reprodução descontrolada, abandono e falta de conscientização. Esse cenário impacta tanto os animais quanto organizações e protetores que atuam no resgate e cuidado.

Projetos beneficentes, como o Tampets, buscam arrecadar recursos para custear castrações — uma das principais formas de controle populacional. No entanto, a gestão dessas iniciativas, incluindo o controle de arrecadações, registro de castrações e organização de pontos de coleta, pode se tornar ineficiente quando realizada sem um sistema estruturado.

Dessa forma, surge a necessidade de uma solução digital que centralize essas informações, otimize a gestão do projeto e aumente a transparência das ações realizadas.


## Solução Proposta

A solução proposta consiste em um sistema web integrado a uma API RESTful, desenvolvido para atender tanto usuários quanto administradores. Entre suas principais funcionalidades, destacam-se o registro da arrecadação de tampinhas, o controle das castrações realizadas, o cadastro e a aprovação de pontos de coleta, além da exibição de notícias e informações relevantes sobre o projeto.

No que se refere às tecnologias e à arquitetura adotada, o sistema será estruturado seguindo o padrão MVC (Model-View-Controller), com a implementação de uma API REST que permitirá a realização das operações básicas (GET, POST, PUT e DELETE).

Como diferencial, a solução promove a integração entre a arrecadação de recursos e o impacto social gerado, oferecendo também um sistema de notificações para usuários e administradores, além de um controle administrativo completo que garante maior eficiência na gestão do projeto.


## Arquitetura da Solução

O sistema será dividido em:

- Interface do Usuário: visualização de dados, cadastro de pontos de coleta
- Interface do Admin: gerenciamento completo dos dados
- Backend/API: regras de negócio e validações
- Banco de Dados: armazenamento das informações


## Documentação do Projeto

- Link do [Confluence](https://projetointegradortampets.atlassian.net/wiki/spaces/PIT/overview)
- Link do Jira: [Adicionar]
- Link para o documento de requisitos: [Adicionar]



## Sprints

| Nº Sprint |      Objetivo     | Data Início | Data Término |
|---|---|---|---|
| 1         | Back-end Parte 1  | 01/04/2026  | 22/04/2026   |


## Técnologias Utilizadas

- Linguagem: [A definir]
- Frontend: [A definir]
- Backend: [A definir]
- Banco de Dados: [A definir]
- Infraestrutura: Vercel
- Versionamento: Git / GitHub
- Gestão: Confluence, Jira



## Funcionalidades

F1: Login de administrador com credenciais fixas;
F2: Cadastro, edição e exclusão de dados;
F3: Registro de relatórios de tampinhas (data e peso);
F4: Registro de castrações (data, tipo de animal, quantidade);
F5: Visualização de histórico e totais mensais;
F6: Cadastro de pontos de coleta por usuários;
F7: Aprovação/reprovação de cadastros pelo administrador;
F8: Notificações para admin e usuários;
F9: Cadastro de notícias (imagem, título e link);


## Resultados Esperados

- Redução da quantidade de animais em situação de rua;
- Melhor organização e controle do projeto beneficente;
- Maior transparência dos dados;
- Facilidade na gestão de pontos de coleta;
- Base escalável para evolução futura do sistema;



## Como Executar o Produto
- [Ex: Node.js / Python / Java instalado]
- Gerenciador de pacotes (npm, pip, etc.)


## Instalação

### Clonar o repositório
<code>git clone FATEC_ProjetoIntegrador3</code>

### Acessar a pasta do projeto
<code>cd FATEC_ProjetoIntegrador3</code>

### Instalar dependências
<code>npm install</code>

### Rodar aplicação
<code>npm start </code> - app principal <br>
<code>npm run start:ms:ponto-coleta</code> - ponto de coleta <br>
<code>npm run start:ms:autenticacao</code> - autenticação login <br>
<code>npm run start:ms:relatorio-animais</code> - relatorio animais <br>
<code>npm run start:ms:relatorio-tampinhas</code> - relatório tampinhas <br>

## Documentacao Postman

Para validar os endpoints da aplicacao e dos microservicos, use as colecoes Postman do repositorio.

### Arquivos de colecao

- `Tampets.postman_collection.json` (colecao consolidada da app principal + microservicos)
- `microsservicos/ponto-coleta/ponto-coleta.postman_collection.json` (colecao dedicada do microservico de ponto de coleta)

### Variaveis usadas na colecao principal

- `app`: `http://localhost:5500`
- `msPontoColeta`: `http://localhost:5501`
- `msAutenticacao`: `http://localhost:5502`
- `msRelatorioAnimais`: `http://localhost:5503`
- `msRelatorioTampinhas`: `http://localhost:5504`
- `msNoticias`: `http://localhost:5505`

### Como importar no Postman

1. Abra o Postman.
2. Clique em **Import**.
3. Selecione o arquivo `Tampets.postman_collection.json`.
4. Ajuste as variaveis de URL se alguma porta estiver diferente no seu ambiente.

### Cobertura da colecao principal

- Healthchecks dos servicos ativos
- CRUD da app principal: usuarios, pontos de coleta e noticias
- Fluxo do ms ponto-coleta: requests, review e approved
- CRUD do ms autenticacao
- CRUD do ms relatorio-animais
- CRUD do ms relatorio-tampinhas
- CRUD do ms noticias

### Roteiro completo com exemplos

- Consulte `postman/README_POSTMAN.md` para executar testes completos com payloads de exemplo, status esperados e casos de erro.