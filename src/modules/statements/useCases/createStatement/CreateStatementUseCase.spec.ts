import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { CreateStatementError } from './CreateStatementError';
import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createStatementUseCase: CreateStatementUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create statement", () => {
  beforeEach(() =>{
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase( usersRepositoryInMemory, statementsRepositoryInMemory)
  });

  it("should be able to create a new statement", async () => {
    const user = {
      name: "Name Usuário",
      email: "email@example.com",
      password: "123",
    };
    const userCreated = await usersRepositoryInMemory.create(user);

    const user_id = userCreated.id as string;

    const statement = await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Test deposit"
    });

    expect(statement).toHaveProperty("id");

  });

  it("should not be able to create a new statement if user does not exists", async () => {
    async function test() {
      const statement = await createStatementUseCase.execute({
        user_id: "any_id",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Test deposit"
      });

      return statement;
    };

    expect(test()).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    // expect(test()).rejects.toEqual({"message": "User not found", "statusCode": 404})

  });

  it("should not be able to create a withdraw statement if the amount is greater than the balance", async () => {
    async function test() {
      const user = {
        name: "Name Usuário",
        email: "email@example.com",
        password: "123",
      };
      const userCreated = await usersRepositoryInMemory.create(user);

      const user_id = userCreated.id as string;

      await createStatementUseCase.execute({
        user_id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Test deposit"
      });

      const statement = await createStatementUseCase.execute({
        user_id,
        type: OperationType.WITHDRAW,
        amount: 200,
        description: "Test deposit"
      });

      return statement;
    };

    expect(test()).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    // expect(test()).rejects.toEqual({"message": "Insufficient funds", "statusCode": 400})

  });
})
