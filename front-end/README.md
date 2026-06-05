# Tampets Front-end

Aplicação web do projeto Tampets, responsável pelas telas públicas e administrativas do sistema.

## Funcao do Projeto

O front-end permite que usuários conhecam o projeto, acompanhem notícias, consultem pontos de coleta aprovados e acessem informações institucionais. Também oferece a área administrativa para gestão de notícias, pontos de coleta, registros de tampinhas, registros de animais e usuários administradores.

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

### Instalar dependências

```bash
cd front-end
npm install
```

### Rodar em desenvolvimento

```bash
npm run dev
```

A aplicação fica disponível em:

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

## Comunicação com o Back-end

O front-end se comunica com o back-end por meio dos arquivos em `front-end/services/`, principalmente:

- `services/apiBase.ts`: resolve a URL base da API.
- `services/api.ts`: configura clientes Axios para API geral e autenticacao.

Em desenvolvimento, a API principal normalmente roda em `http://localhost:5500`. Em produção, configure as URLs equivalentes nas variáveis de ambiente do Vercel.
