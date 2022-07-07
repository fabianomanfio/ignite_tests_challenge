
import request from "supertest"
import { Connection } from 'typeorm'
import { app } from "../../../../app";

import createConnection from '@database/index';

let connection: Connection

describe("Get balance", () => {
  beforeAll(async ()=> {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get user balance", async () => {
    await request(app)
    .post("/api/v1/users")
    .send({
      name: "User Balance",
      email: "user_balance@example.com",
      password: "123",
    });

    const responseToken = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "user_balance@example.com",
      password: "123"
    });

    const { token } = responseToken.body;

    const response = await request(app).get("/api/v1/statements/balance")
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(200);
  })
})
