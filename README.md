<h1>Desafio testes unitários</h1>

<h2>Testes desenvolvidos</h2>

<h3>Create user</h3>
- [x] should be able to create a new user<br />
- [x] should not be able to create a user with an existent email

<h3>Authenticate user</h3>
- [x] should be able to authenticate an user<br />
- [x] should not be able to authenticate an user if email is wrong<br />
- [x] should not be able to authenticate an user if password is wrong

<h3>Show user profile</h3>
- [x] should be able to show user profile<br />
- [x] should not be able to show user profile if the user does not exists

<h3>Create statement</h3>
- [x] should be able to create a new statement<br />
- [x] should not be able to create a new statement if user does not exists<br />
- [x] should not be able to create a withdraw statement if the amount is greater than the balance

<h3>Get balance</h3>
- [x] should be able to get user balance<br />
- [x] should not be able to get balance if user does not exists

<h3>Get statement operation</h3>
- [x] should be able to get an statement operation<br />
- [x] should not be able to get an statement operation if user does not exists<br />
- [x] should not be able to get an statement operation if statement does not exists

_______________________________________________________________________________

<h1>Desafio testes de integração</h1>

<h2>Testes desenvolvidos</h2>

<h3>Create user</h3>
- [x] should be able to create a new user<br />
- [x] should not be able to create a user with an existent email

<h3>Authenticate user</h3>
- [x] should be able to authenticate an user<br />
- [x] should not be able to authenticate an user if email is wrong<br />
- [x] should not be able to authenticate an user if password is wrong

<h3>Show user profile</h3>
- [x] should be able to show user profile<br />
- [x] should not be able to show user profile if token is invalid

<h3>Make statements</h3>
- [x] should be able to make a deposit<br />
- [x] should be able to make a withdraw<br />
- [x] should not be able to create a withdraw with insufficient funds

<h3>Get balance</h3>
- [x] should be able to get user balance

<h3>Get statement operation</h3>
- [x] should be able to get an statement operation<br />
- [x] should not be able to get an statement operation if statement does not exists

________________________________________________________________________________

<h1>Desafio Transferências com a FinAPI</h1>

<h2>Implementações</h2>

<h3>Database / Entities</h3>
- [x] na tabela 'statements' alterar coluna 'type'  - adicionar enum 'transfer'
- [x] na tabela 'statements' criar a coluna 'sender_id'
- [x] na tabela 'statements' criar foreignKey 'sender_id' => 'users'

<h3>Create transfer</h3>
- [x] implemntar funcionalidade de transferência de fundos entre contas
- [x] não deve ser possível transferir valores superiores ao disponível no saldo de uma conta
- [x] o balance deverá considerar também todos os valores transferidos ou recebidos através de transferências ao exibir o saldo de um usuário
- [x] criar a rota: post('/transfers/:user_id'
- [x] implementar testes


