projeto-tampets/
│
├── README.md
│
├── app/                # Serviço principal
│   ├── controllers/
│   │   ├── usuarioController.js
│   │   ├── pontoColetaController.js   # Controlador de pontos de coleta
│   │   └── noticiaController.js    # Novo controlador de notícias
│   ├── models/
│   │   ├── usuarioModel.js
│   │   ├── pontoColetaModel.js    # Modelo de pontos de coleta
│   │   └── noticiaModel.js    # Novo modelo de notícias
│   ├── routes/
│   │   ├── usuarioRoutes.js
│   │   ├── pontoColetaRoutes.js   # Rotas de pontos de coleta
│   │   └── noticiaRoutes.js   # Rotas de notícias
│   ├── views/              # Pastas de templates ou componentes
│   │   ├── loginView.ejs
│   │   ├── relatorioTampinhasView.ejs
│   │   ├── relatorioAnimaisView.ejs
│   │   ├── pontoColetaView.ejs   # Template de pontos de coleta
│   │   └── noticiaView.ejs       # Template de notícias
│   ├── services/ (chamadas aos microserviços)
│   └── app.js
│
├── microsservicos/
│   ├── autenticacao/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   │
│   ├── relatorio-tampinhas/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   │
│   ├── relatorio-animais/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   │
│   └── ponto-coleta/   # Microserviço de pontos de coleta
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── app.js
│
│   └── notificacao/   # (Opcional) Microserviço de notificações (admin e usuário)
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── app.js
│
└── package.json