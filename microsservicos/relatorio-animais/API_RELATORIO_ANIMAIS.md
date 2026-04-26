# API - Microserviço Relatório de Animais

## Descrição

O microserviço **Relatório de Animais** é responsável pelo gerenciamento de registros relacionados aos animais cadastrados no sistema.  
Ele permite criar, listar, consultar, atualizar e remover relatórios de animais por meio de uma API RESTful.

---

## Base URL

http://localhost:5503

---

# Endpoints Disponíveis

## 1. Healthcheck

**Método:** GET  
**Rota:** /health  

**Descrição:** Verifica se o microserviço está ativo.

**Resposta de Sucesso:**

```json
{
  "status": "ok",
  "service": "ms-relatorio-animais"
}
```
## 2. Criar Relatório

**Método:** POST  
**Rota:** /api/relatorios-animais  

**Descrição:** Cria um novo relatório de animais.

**Body:**

```json
{
  "data": "2026-04-26",
  "tipoAnimal": "Bovino",
  "quantidade": 15
}
```

**Resposta de Sucesso:**

```json
{
  "id": 1,
  "data": "2026-04-26T00:00:00.000Z",
  "tipoAnimal": "Bovino",
  "quantidade": 15,
  "createdAt": "2026-04-26T16:05:39.953Z",
  "updatedAt": "2026-04-26T16:05:39.953Z"
}
```

---

## 3. Listar Relatórios

**Método:** GET  
**Rota:** /api/relatorios-animais  

**Descrição:** Retorna todos os relatórios cadastrados.

**Resposta de Sucesso:**

```json
[
  {
    "id": 1,
    "data": "2026-04-26T00:00:00.000Z",
    "tipoAnimal": "Bovino",
    "quantidade": 15,
    "createdAt": "2026-04-26T16:05:39.953Z",
    "updatedAt": "2026-04-26T16:05:39.953Z"
  }
]
```
## 4. Buscar Relatório por ID

**Método:** GET  
**Rota:** /api/relatorios-animais/:id  

**Descrição:** Retorna um relatório específico pelo ID.

**Exemplo:**

```text
/api/relatorios-animais/1
```

**Resposta de Sucesso:**

```json
{
  "id": 1,
  "data": "2026-04-26T00:00:00.000Z",
  "tipoAnimal": "Bovino",
  "quantidade": 15,
  "createdAt": "2026-04-26T16:05:39.953Z",
  "updatedAt": "2026-04-26T16:05:39.953Z"
}
```

**Resposta de Erro:**

```json
{
  "message": "Relatorio de animais nao encontrado"
}
```

---

## 5. Atualizar Relatório

**Método:** PUT  
**Rota:** /api/relatorios-animais/:id  

**Descrição:** Atualiza os dados de um relatório existente.

**Exemplo:**

```text
/api/relatorios-animais/1
```

**Body:**

```json
{
  "quantidade": 30
}
```

**Resposta de Sucesso:**

```json
{
  "id": 1,
  "data": "2026-04-26T00:00:00.000Z",
  "tipoAnimal": "Bovino",
  "quantidade": 30,
  "createdAt": "2026-04-26T16:05:39.953Z",
  "updatedAt": "2026-04-26T16:20:00.000Z"
}
```

---

## 6. Remover Relatório

**Método:** DELETE  
**Rota:** /api/relatorios-animais/:id  

**Descrição:** Remove um relatório pelo ID.

**Exemplo:**

```text
/api/relatorios-animais/1
```

**Resposta de Sucesso:**

```text
204 No Content
```