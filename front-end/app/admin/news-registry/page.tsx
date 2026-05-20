// Criar aqui o formulário de registro de notícias
// Fazer uma view das notícias cadastradas e adicionar a opção de edição
// Fazer a comunicação com o banco de dados
// GET (Listar notícias)
// POST (Registrar nova notícia)
// PUT (Editar notícia)
// DELETE (Remover notícia)





// APENAS PARA TESTE, AINDA NÃO IMPLEMENTADO NADA, SÓ PARA VER SE A ROTA ESTÁ FUNCIONANDO

'use client'

export default function newsRegistryAdminPage() {
    return (
        <div>
            <h1>Painel de Administração - Registro de Notícias</h1>
            <p>Aqui você pode gerenciar as notícias cadastradas pelos usuários.</p>
            <p>Funcionalidades:</p>
            <ul>
                <li>Registrar novas notícias</li>
                <li>Visualizar todas as notícias</li>
                <li>Editar informações das notícias</li>
                <li>Remover notícias</li>
            </ul>
        </div>
    )
}
