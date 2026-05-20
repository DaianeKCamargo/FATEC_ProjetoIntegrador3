// aqui criar o menu com as opções de cadastro de ponto de coleta

// aprovar ou recusar cadastro que vier do formulários

// visualizar todos os cadastros, tanto os recusados quanto os aprovados eeeeeeeeeeeeeee 
// editar os que já estão aprovados



// APENAS PARA TESTE, AINDA NÃO IMPLEMENTADO NADA, SÓ PARA VER SE A ROTA ESTÁ FUNCIONANDO

'use client'

export default function CollectionPointAdminPage() {
    return (
        <div>
            <h1>Painel de Administração - Ponto de Coleta</h1>
            <p>Aqui você pode gerenciar os pontos de coleta cadastrados pelos usuários.</p>
            <p>Funcionalidades:</p>
            <ul>
                <li>Aprovar ou recusar novos cadastros de pontos de coleta</li> 
                <li>Visualizar todos os cadastros, tanto aprovados quanto recusados</li>
                <li>Editar informações dos pontos de coleta aprovados</li>
            </ul>
        </div>
    )
}