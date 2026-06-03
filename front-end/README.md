# Tampets Front-end

Aplicacao web do projeto Tampets, responsavel pelas telas publicas e administrativas do sistema.

## Funcao do Projeto

O front-end permite que usuarios conhecam o projeto, acompanhem noticias, consultem pontos de coleta aprovados e acessem informacoes institucionais. Tambem oferece a area administrativa para gestao de noticias, pontos de coleta, registros de tampinhas, registros de animais e usuarios administradores.

## Ferramentas Utilizadas

- Next.js
- React
- TypeScript
- Bootstrap
- Bootstrap Icons
- Tailwind CSS
- Axios
- Recharts
- Framer Motion
- Lucide React
- React Icons
- ESLint

## Estrutura Principal

```text
front-end/
  app/             Rotas e paginas da aplicacao Next.js
  components/      Componentes reutilizaveis
  services/        Configuracao de comunicacao com APIs
  styles/          Arquivos CSS e modulos de estilo
  public/          Assets publicos
```


## Como Rodar

### Instalar dependencias

```bash
cd front-end
npm install
```

### Rodar em desenvolvimento

```bash
npm run dev
```

A aplicacao fica disponivel em:

```text
http://localhost:3000
```

### Gerar build

```bash
npm run build
```

### Rodar build local

```bash
npm start
```

### Verificar lint

```bash
npm run lint
```

## Comunicacao com o Back-end

O front-end se comunica com o back-end por meio dos arquivos em `front-end/services/`, principalmente:

- `services/apiBase.ts`: resolve a URL base da API.
- `services/api.ts`: configura clientes Axios para API geral e autenticacao.

Em desenvolvimento, a API principal normalmente roda em `http://localhost:5500`. Em producao, configure as URLs equivalentes nas variaveis de ambiente do Vercel.
