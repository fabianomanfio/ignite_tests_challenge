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
