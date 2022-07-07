import request from "supertest"
import { Connection } from 'typeorm'
import { app } from "../../../../app";

import createConnection from '@database/index';

let connection: Connection

describe("Create user controller", () => {
  beforeAll(async ()=> {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should not be able to create a user with an existent email", async() => {
    const response = await request(app)
    .post("/api/v1/users")
    .send({
      name: "Name Usuário",
      email: "email@example.com",
      password: "123",
    });

    expect(response.status).toBe(201)
  });

  it("should not be able to create a user with an existent email", async() => {
    const response = await request(app)
    .post("/api/v1/users")
    .send({
      name: "Name Usuário",
      email: "email@example.com",
      password: "123",
    });

    expect(response.status).toBe(400)
    expect(response.body.message).toEqual("User already exists")
  });
})
