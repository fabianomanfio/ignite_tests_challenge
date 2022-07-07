import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create a user", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async() => {
    const user =await createUserUseCase.execute({
      name: "Name Usuário",
      email: "email@example.com",
      password: "123",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user with an existent email", async() => {
    async function test() {
      await createUserUseCase.execute({
        name: "Name Usuário",
        email: "email@example.com",
        password: "123",
      });

      const result = await createUserUseCase.execute({
        name: "Name Usuário",
        email: "email@example.com",
        password: "123",
      });

      return result
    };

    await expect(test()).rejects.toBeInstanceOf(CreateUserError);
    // await expect(test()).rejects.toEqual({"message": "User already exists", "statusCode": 400});
  });
});
