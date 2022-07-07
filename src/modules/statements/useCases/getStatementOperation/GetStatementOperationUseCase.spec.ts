import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { GetStatementOperationError } from './GetStatementOperationError';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Get statement operation", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository, );
  })

  it("should be able to get an statement operation", async () => {
    const user = {
      name: "Name Usuário",
      email: "email@example.com",
      password: "123",
    };

    const userCreated = await inMemoryUsersRepository.create(user);

    const user_id = userCreated.id as string;

    const statementCreated = await inMemoryStatementsRepository.create({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Test deposit"
    });

    const statement_id = statementCreated.id as string;

    const statement = await getStatementOperationUseCase.execute({ user_id, statement_id})

    expect(statement).toHaveProperty("id");
  })

  it("should not be able to get an statement operation if user does not exists", async () => {
    async function test() {
      const statement = await getStatementOperationUseCase.execute({ user_id: "any_id", statement_id: "any_statement" });

      return statement
    };

    expect(test()).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    // expect(test()).rejects.toEqual({"message": "User not found", "statusCode": 404})
  })

  it("should not be able to get an statement operation if statement does not ", async () => {
    async function test() {
      const user = {
        name: "Name Usuário",
        email: "email@example.com",
        password: "123",
      };

      const userCreated = await inMemoryUsersRepository.create(user);

      const user_id = userCreated.id as string;

      const statement = await getStatementOperationUseCase.execute({ user_id: user_id, statement_id: "any_statement" });

      return statement
    };

    expect(test()).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    // expect(test()).rejects.toEqual({"message": "Statement not found", "statusCode": 404})
  })
})
