import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';


let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  })

  it("should be able to authenticate an user", async () => {
    const user = {
      name: "Name Usuário",
      email: "email@example.com",
      password: "123",
    };

    await createUserUseCase.execute(user);

    const authenticateReturn = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(authenticateReturn).toHaveProperty("token");
  });

  it("should not be able to authenticate an user if email is wrong", async () => {
    async function test() {
      const user = {
        name: "New Usuário",
        email: "new_email@example.com",
        password: "123",
      };

      await createUserUseCase.execute(user);

      const authenticateReturn = await authenticateUserUseCase.execute({
        email: "test@exemplo.com",
        password: user.password,
      });

      return authenticateReturn
    };

    await expect(test()).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    // await expect(test()).rejects.toEqual({"message": "Incorrect email or password", "statusCode": 401});
  })

  it("should not be able to authenticate an user if password is wrong", async () => {
    async function test() {
      const user = {
        name: "New Usuário",
        email: "new_email_2@example.com",
        password: "123",
      };

      await createUserUseCase.execute(user);

      const authenticateReturn = await authenticateUserUseCase.execute({
        email: user.email,
        password: "wrong_password",
      });

      return authenticateReturn
    };

    await expect(test()).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    // await expect(test()).rejects.toEqual({"message": "Incorrect email or password", "statusCode": 401});
  })

})
