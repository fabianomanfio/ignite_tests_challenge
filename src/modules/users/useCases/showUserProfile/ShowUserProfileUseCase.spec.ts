import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ShowUserProfileError } from './ShowUserProfileError';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Show user profile", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it("should be able to show user profile", async() => {
    const user = {
      name: "Name Usuário",
      email: "email@example.com",
      password: "123"
    }

    const userCreated = await usersRepositoryInMemory.create(user);

    const user_id = userCreated.id as string;

    const userProfile = await showUserProfileUseCase.execute(user_id);

    expect(userProfile).toHaveProperty("id");
  });

  it("should not be able to show user profile if the user does not exists", async() => {
    async function test() {
      const userProfile = await showUserProfileUseCase.execute("any_id");

      return userProfile;
    }

    expect(test()).rejects.toBeInstanceOf(ShowUserProfileError);
    // expect(test()).rejects.toEqual({"message": "User not found", "statusCode": 404})
  });
})
