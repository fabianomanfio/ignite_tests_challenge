import request from "supertest"
import { Connection } from 'typeorm'
import { app } from "../../../../app";

import createConnection from '@database/index';

let connection: Connection

describe("Authenticate user", () => {
  beforeAll(async ()=> {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {
    const user = {
      name: "Test Token Usuário",
      email: "test_token@example.com",
      password: "123",
    }

    await request(app).post("/api/v1/users").send(user);

    const response = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: user.email,
      password: user.password
    })

    expect(response.status).toBe(200);
  });

  it("should not be able to authenticate an user if email is wrong", async () => {
    const response = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "wrong_email@exemple.com",
      password: "123"
    })

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Incorrect email or password");
  });

  it("should not be able to authenticate an user if password is wrong", async () => {
    const response = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "test_token@example.com",
      password: "wrong_password"
    })

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Incorrect email or password");
  });
})
