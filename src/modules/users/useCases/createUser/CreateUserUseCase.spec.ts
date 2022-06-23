import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("should be able to create a new user", async () => {

    const user: ICreateUserDTO = await createUserUseCase.execute({
      name: "New User",
      email: "user@email.com",
      password: "1234",
    });

    const userCreated = await usersRepositoryInMemory.findByEmail(user.email);

    expect(userCreated).toHaveProperty("id");
  })

  it("should not be able to create a new user with an existent e-mail", async () => {    
    expect(async () => {
      const user = {
        name: "New User",
        email: "user@email.com",
        password: "1234",
      }
  
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });
      
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });
    }).rejects.toBeInstanceOf(CreateUserError);    
  })
})