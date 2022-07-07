
import request from "supertest"
import { Connection } from 'typeorm'
import { app } from "../../../../app";

import createConnection from '@database/index';

let connection: Connection

describe("Make statements", () => {
  beforeAll(async ()=> {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to make a deposit", async () => {
    await request(app)
    .post("/api/v1/users")
    .send({
      name: "User",
      email: "user@example.com",
      password: "123",
    });

    const responseToken = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "user@example.com",
      password: "123"
    });

    const { token } = responseToken.body;

    const response = await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 500,
      description: "deposit"
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201);
  });

  it("should be able to make a withdraw", async () => {

    const responseToken = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "user@example.com",
      password: "123"
    });

    const { token } = responseToken.body;

    const response = await request(app).post("/api/v1/statements/withdraw")
    .send({
      amount: 100,
      description: "withdraw"
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201);
  });

  it("should not be able to make a withdraw with insufficient funds", async () => {

    const responseToken = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "user@example.com",
      password: "123"
    });

    const { token } = responseToken.body;

    const response = await request(app).post("/api/v1/statements/withdraw")
    .send({
      amount: 600,
      description: "withdraw"
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Insufficient funds");
  });

})
