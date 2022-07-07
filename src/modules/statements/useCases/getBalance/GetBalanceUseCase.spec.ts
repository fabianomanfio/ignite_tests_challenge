import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { GetBalanceError } from './GetBalanceError';
import { GetBalanceUseCase } from './GetBalanceUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Get balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  })

  it("should be able to get user balance", async () => {
    const user = {
      name: "Name Usuário",
      email: "email@example.com",
      password: "123",
    };

    const userCreated = await inMemoryUsersRepository.create(user);

    const user_id = userCreated.id as string;

    await inMemoryStatementsRepository.create({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Test deposit"
    });

    const balance = await getBalanceUseCase.execute({ user_id})

    expect(balance).toHaveProperty("balance");

  });

  it ("should not be able to get balance if user does not exist", async () => {
    async function test() {
      const balance = await getBalanceUseCase.execute({ user_id: "any_id" });

      return balance
    };

    expect(test()).rejects.toBeInstanceOf(GetBalanceError);
    // expect(test()).rejects.toEqual({"message": "User not found", "statusCode": 404})
  })
})
