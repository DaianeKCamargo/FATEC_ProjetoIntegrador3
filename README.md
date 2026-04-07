# PROJETO BENEFICENTE TAMPETS 🐱🐶


<br>

## O Projeto
O projeto beneficente Tampets surgiu 2019 pela idealizadora Lia, a ideia surgiu com o foco em diminiur a quantidade de animais nas ruas, com isso, focando na diminuição da reprodução desses animais. Pensando nisso o projeto coleta tampinhas de garrafas pet e vende para arrecadar fundos, a qual todo o dinheiro arrecadado é voltado para fins da castração de animais sendo seu foco em gatos e cães. 

---

## Ação 
Começa com a interface do admin, aonde o admin vai ser o responsável por inserção dos dados do projeto. Tudo que o usuário lá na interface do usuário é vista de dados relevantes, é o admin que faz a inserção. O admin, ele vai possuir um acesso aonde ele vai entrar numa página para fazer o login. Ele vai ter um usuário fixo com uma senha aqui de determinar. Então vai ter então a questão da validação desse, do username com a senha, né? 

Daí após ele ao entrar dentro desse, dessa sua tela, ele vai ter as páginas onde ele vai inserir os dados, sendo que vai ter a página de relatórios, é aonde ele vai acessar pra fazer a inserção da de dados, né, de data e da quantidade em quilos de tampinha dentro da quantidade de tampinhas. E depois vai ter outra interface que ele vai ter que fazer inserção da data também, do tipo de animal e eh tipo de animal se é gato ou cachorro e a quantidade de animal castrado, tipo dizendo nessa data foi um, nessa data foi um cachorro e um gato, tipo assim, mostrando os, daí todos essas duas interfaces vai ter a visualização de um histórico e também uma outra visualização, tipo duas telas separadas do da visualização do total mensal dentro do mês até aquela até essa presente data que ela está inserindo os dados. Dentro disso, ela pode estar fazendo também essa questão de edição ou excluindo, caso um exemplo, ela colocou um dado errado ou ela ela quer não, ou o dado não é mais pertinente, então ela consegue fazer essa edição e exclusão de dados. E lógico também vai ter lá um campo pra ela adicionar o dado, né? Então tem a adição de dados, edição dos dados e a exclusão dos dados. 

Outra página é, no caso, vai ser a página de pontos de coleta, aonde na página do usuário, há um formulário aonde vai ser preenchido os dados de uma empresa que deseja fazer parte do do projeto. Após a inserção dos dados nesse formulário, os dados são enviados para o, primeiramente, para uma memória local, né, vamos dizer assim, que é onde vai ficar, vai diretamente para o administrador. O administrador vai ter acesso a esses dados. Ele vai conseguir visualizar os dados, consegue visualizar os dados. E ao visualizar os dados, ele tem a ação de editar ou de excluir e de aprovar. Antes de se caso, ele não faça essa aprovação, ele recusa, o sistema já não salva, né, a não ser no caso da aprovação. A partir do momento que ele for aprovado, ele entra para o banco de dados, que é onde vai armazenar a lista de todos os pontos de coleta. E essa lista na pós-futuro, né, que eu vou te passar, ele vai ser mostrado lá na interface do usuário, ao fazer filtragem, né, quando o usuário for fazer o filtro lá na página inicial. E dito isso também, quando ele recebe esse cadastro de lá da página do usuário, o próprio administrador recebe uma notificação de que há um novo cadastro para ser avaliado. E ao mesmo tempo, né, após a análise do administrador, quando for aprovado ou recusado, o próprio usuário que fez o cadastro recebe uma notificação no e-mail ou no telefone cadastrado, se seu cadastro está aprovado ou não.

nesse mesmo interface do admin, possui ainda uma página que ele pode inserir os dados, sendo os dados uma imagem, um título e o link de uma matéria. guardando, provavelmente não sei como seria o armazenamento, né? da imagem e do link no banco de dados, possivelmente. E depois de inserido, é, consiga mostrar lá na interface do usuário.

## Requisitos que devem ser seguido do projeto
1. A aplicação deverá ser hospedada no GitHub e ter sua documentação descrita no arquivo README. Não esqueça de incluir o nome dos integrantes do grupo; 
2. Desenvolvimento uma API RESTful completa que permita a realização das operações básicas: GET, POST, PUT e DELETE. Cada operação deve ser mapeada para as rotas apropriadas no seu servidor; 
3. Utilização da arquitetura MVC para desenvolvimento da aplicação; 
4. Deverá conter obrigatoriamente um microsserviço; 
5. Aplicação hospedada em nuvem, através de uma plataforma, por exemplo: Vercel