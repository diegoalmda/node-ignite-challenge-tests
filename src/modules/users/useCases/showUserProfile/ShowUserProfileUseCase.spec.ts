import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory); 
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to show user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "New User",
      email: "user@email.com",
      password: "1234",
    });

    const userToVerify = await showUserProfileUseCase.execute(user.id as string);

    expect(userToVerify).toHaveProperty("id");
  });
  
  it("should be not be able to show user profile from a non-existing user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("fakeid");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});