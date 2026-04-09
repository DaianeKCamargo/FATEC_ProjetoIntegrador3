# PROJETO INTEGRADOR: TAMPETS 🐱🐶

Solução de Software end-to-end para arrecadação de fundos e apoio à castração de animais em situação de rua.

## Integrantes:

Daiane Kelly de Almeida Camargo;
Maria Eduarda Moreno Lopes;
Nícolas de Oliveira Dias;
Nicole Janine Bolzani Oliveira;
Sabrina Sant'Ana da Silva Alves;

---

## Visão Geral

Este projeto tem como objetivo desenvolver uma solução completa de software, abrangendo todo o ciclo de vida de desenvolvimento: desde o levantamento de requisitos até a implementação, testes e disponibilização da aplicação.

A solução foi projetada para resolver um problema real de negócio, utilizando boas práticas de engenharia de software, arquitetura escalável e tecnologias modernas de desenvolvimento.

O projeto beneficente Tampets surgiu em 2019 pela idealizadora Lia, com o objetivo de diminuir a quantidade de animais nas ruas, focando na redução da reprodução de cães e gatos por meio da castração. 

---

## Problema de Negócio

O crescimento da população de animais em situação de rua é um problema recorrente, causado principalmente pela reprodução descontrolada, abandono e falta de conscientização. Esse cenário impacta tanto os animais quanto organizações e protetores que atuam no resgate e cuidado.

Projetos beneficentes, como o Tampets, buscam arrecadar recursos para custear castrações — uma das principais formas de controle populacional. No entanto, a gestão dessas iniciativas, incluindo o controle de arrecadações, registro de castrações e organização de pontos de coleta, pode se tornar ineficiente quando realizada sem um sistema estruturado.

Dessa forma, surge a necessidade de uma solução digital que centralize essas informações, otimize a gestão do projeto e aumente a transparência das ações realizadas.

---

## Solução Proposta

A solução proposta consiste em um sistema web integrado a uma API RESTful, desenvolvido para atender tanto usuários quanto administradores. Entre suas principais funcionalidades, destacam-se o registro da arrecadação de tampinhas, o controle das castrações realizadas, o cadastro e a aprovação de pontos de coleta, além da exibição de notícias e informações relevantes sobre o projeto.

No que se refere às tecnologias e à arquitetura adotada, o sistema será estruturado seguindo o padrão MVC (Model-View-Controller), com a implementação de uma API REST que permitirá a realização das operações básicas (GET, POST, PUT e DELETE).

Como diferencial, a solução promove a integração entre a arrecadação de recursos e o impacto social gerado, oferecendo também um sistema de notificações para usuários e administradores, além de um controle administrativo completo que garante maior eficiência na gestão do projeto.

---

## Arquitetura da Solução

O sistema será dividido em:

- Interface do Usuário: visualização de dados, cadastro de pontos de coleta
- Interface do Admin: gerenciamento completo dos dados
- Backend/API: regras de negócio e validações
- Banco de Dados: armazenamento das informações

---

## Documentação do Projeto

- Link do confluence: [Adicionar]
- Link do Jira: [Adicionar]
- Link para o documento de requisitos: [Adicionar]

---

## Sprints

| nº Sprint | objetivo  | Data Início | Data Término |
| _________ | _________ | ___________ | ____________ |

| 1         | [Definir] | [Definir]   | [Definir]    |

---

## Técnologias Utilizadas

- Linguagem: [A definir]
- Frontend: [A definir]
- Backend: [A definir]
- Banco de Dados: [A definir]
- Infraestrutura: Cloud (ex: Vercel)
- Versionamento: Git / GitHub
- Gestão: [Jira / Trello / outro]

---

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

---

## Resultados Esperados

- Redução da quantidade de animais em situação de rua;
- Melhor organização e controle do projeto beneficente;
- Maior transparência dos dados;
- Facilidade na gestão de pontos de coleta;
- Base escalável para evolução futura do sistema;

---

## Como Executar o Produto
- [Ex: Node.js / Python / Java instalado]
- Gerenciador de pacotes (npm, pip, etc.)

---
## Instalação

# Clonar o repositório
git clone [URL_DO_REPOSITORIO]

# Acessar a pasta do projeto
cd [NOME_DO_PROJETO]

# Instalar dependências
npm install

# Rodar aplicação
npm start