# Guia Postman - Tampets

Este guia descreve como testar todos os endpoints com exemplos usando as colecoes Postman do projeto.

## Colecoes disponiveis

- `Tampets.postman_collection.json`: colecao consolidada da app principal e dos microservicos.
- `microsservicos/ponto-coleta/ponto-coleta.postman_collection.json`: colecao dedicada ao microservico de ponto de coleta.

## Pre-requisitos

- Dependencias instaladas com `npm install`.
- Servicos iniciados para teste local completo:
	- `npm run start:app`
	- `npm run start:ms:ponto-coleta`
	- `npm run start:ms:autenticacao`
	- `npm run start:ms:relatorio-animais`
	- `npm run start:ms:relatorio-tampinhas`
	- `npm run start:ms:noticias`

## Variaveis da colecao consolidada

- `app`: `http://localhost:5500`
- `msPontoColeta`: `http://localhost:5501`
- `msAutenticacao`: `http://localhost:5502`
- `msRelatorioAnimais`: `http://localhost:5503`
- `msRelatorioTampinhas`: `http://localhost:5504`
- `msNoticias`: `http://localhost:5505`

## Como importar no Postman

1. Abra o Postman.
2. Clique em Import.
3. Selecione `Tampets.postman_collection.json`.
4. Confira as variaveis da colecao e ajuste portas/hosts se necessario.

## Roteiro de testes com exemplos

## 1) Healthchecks

Execute as requests da pasta `Healthchecks`.

Resultado esperado:

- Status 200 para app principal e microsservicos com endpoint `/health`.
- `msNoticias` nao possui endpoint `/health` atualmente.

## 2) App Principal - Usuarios

Sequencia recomendada:

1. `Criar Usuario`
2. `Listar Usuarios`
3. `Buscar Usuario por ID`
4. `Atualizar Usuario`
5. `Remover Usuario`

Payload exemplo para criar:

{
	"nome": "Usuario Exemplo",
	"email": "usuario.exemplo@email.com"
}

Esperado:

- Criacao: 201
- Listagem e busca: 200
- Atualizacao: 200
- Remocao: 204

Teste de erro sugerido:

- Enviar `Criar Usuario` sem `nome` ou sem `email` para validar retorno 400.

## 3) App Principal - Pontos de Coleta

Sequencia recomendada:

1. `Criar Ponto de Coleta`
2. `Listar Pontos de Coleta`
3. `Buscar Ponto de Coleta por ID`
4. `Atualizar Ponto de Coleta`
5. `Remover Ponto de Coleta`

Payload exemplo para criar:

{
	"nomeEmpresa": "Empresa Exemplo",
	"endereco": "Rua Exemplo, 100",
	"aprovado": true
}

Esperado:

- Criacao: 201
- Listagem e busca: 200
- Atualizacao: 200
- Remocao: 204

Teste de erro sugerido:

- Enviar sem `nomeEmpresa` ou sem `endereco` para validar retorno 400.

## 4) App Principal - Noticias

Sequencia recomendada:

1. `Criar Noticia`
2. `Listar Noticias`
3. `Buscar Noticia por ID`
4. `Atualizar Noticia`
5. `Remover Noticia`

Payload exemplo para criar:

{
	"titulo": "Campanha local",
	"link": "https://exemplo.com/campanha",
	"imagem": "https://exemplo.com/imagem.jpg"
}

Esperado:

- Criacao: 201
- Listagem e busca: 200
- Atualizacao: 200
- Remocao: 204

Teste de erro sugerido:

- Enviar sem `titulo` ou sem `link` para validar retorno 400.

## 5) MS Ponto Coleta

Sequencia recomendada:

1. `Criar Solicitacao de Ponto`
2. `Listar Solicitacoes`
3. `Buscar Solicitacao por ID`
4. `Atualizar Solicitacao`
5. `Aprovar Solicitacao` ou `Recusar Solicitacao`
6. `Listar Aprovados` (apos aprovar)

Payload exemplo para criar:

{
	"opensPc": true,
	"nameUser": "Daiane Camargo",
	"linkPhoto": "https://images.example.com/ponto-centro.jpg",
	"cpfUser": "11144477735",
	"cpnjPoint": "11222333000181",
	"emailUser": "daiane@email.com",
	"celUser": "11988887777",
	"namePoint": "Ponto Centro",
	"hourInit": "08:00",
	"hour": "18:00",
	"address": {
		"street": "Rua das Flores",
		"number": "100",
		"complement": "Sala 2",
		"district": "Centro",
		"city": "Sao Paulo",
		"postCode": "01001000"
	}
}

Payload exemplo para revisao:

{
	"decision": "APPROVE",
	"reason": "Documentacao validada"
}

Esperado:

- Criacao: 201
- Listagem e busca: 200
- Atualizacao: 200
- Revisao: 200

Testes de erro sugeridos:

- `decision` diferente de `APPROVE` ou `REJECT` retorna 400.
- Atualizar request ja revisada pode retornar 409.

## 6) MS Autenticacao

Sequencia recomendada:

1. `Criar Credencial`
2. `Listar Credenciais`
3. `Buscar Credencial por ID`
4. `Atualizar Credencial`
5. `Login`
6. `Remover Credencial`

Payload exemplo para criar:

{
	"usuario": "admin.exemplo",
	"senha": "123456",
	"ativo": true
}

Payload exemplo para login:

{
	"usuario": "admin.exemplo",
	"senha": "novaSenha123"
}

Esperado:

- Criacao: 201
- Listagem e busca: 200
- Atualizacao: 200
- Login valido: 200
- Remocao: 204

Testes de erro sugeridos:

- Login com senha incorreta retorna 401.
- Criar usuario duplicado retorna 409.

## 7) MS Relatorio Animais

Sequencia recomendada:

1. `Criar Relatorio Animal`
2. `Listar Relatorios Animais`
3. `Buscar Relatorio Animal por ID`
4. `Atualizar Relatorio Animal`
5. `Remover Relatorio Animal`

Payload exemplo para criar:

{
	"data": "2026-04-07",
	"tipoAnimal": "gato",
	"quantidade": 3
}

Esperado:

- Criacao: 201
- Listagem e busca: 200
- Atualizacao: 200
- Remocao: 204

Teste de erro sugerido:

- Enviar sem `data`, `tipoAnimal` ou `quantidade` para validar retorno 400.

## 8) MS Relatorio Tampinhas

Sequencia recomendada:

1. `Criar Relatorio Tampinhas`
2. `Listar Relatorios Tampinhas`
3. `Buscar Relatorio Tampinhas por ID`
4. `Atualizar Relatorio Tampinhas`
5. `Remover Relatorio Tampinhas`

Payload exemplo para criar:

{
	"data": "2026-04-07",
	"quantidadeKg": 12.5
}

Esperado:

- Criacao: 201
- Listagem e busca: 200
- Atualizacao: 200
- Remocao: 204

Teste de erro sugerido:

- Enviar `quantidadeKg` menor ou igual a zero para validar retorno 400.

## 9) MS Noticias

Sequencia recomendada:

1. `Criar Noticia`
2. `Listar Noticias`
3. `Buscar Noticia por ID`
4. `Atualizar Noticia`
5. `Remover Noticia`

Payload exemplo para criar:

{
	"titulo": "Campanha de arrecadacao",
	"link": "https://exemplo.com/noticia",
	"imagem": "https://exemplo.com/imagens/noticia.jpg"
}

Esperado:

- Criacao: 201
- Listagem e busca: 200
- Atualizacao: 200
- Remocao: 204

## Observacoes de deploy

- O deploy em `https://fatec-projeto-integrador3.vercel.app` responde atualmente ao microservico de autenticacao.
- Para testar tudo, use ambiente local com todos os servicos ativos.
