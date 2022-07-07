import request from "supertest"
import { Connection } from 'typeorm'
import { app } from "../../../../app";

import createConnection from '@database/index';

let connection: Connection

describe("Show user profile", () => {
  beforeAll(async ()=> {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show user profile", async () => {
    const user = {
      name: "User test Profile",
      email: "profile@example.com",
      password: "123"
    }

    await request(app).post("/api/v1/users").send(user);

    const responseToken = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "profile@example.com",
      password: "123"
    });

    const { token } = responseToken.body;

    const response = await request(app). get("/api/v1/profile")
    .set({Authorization: `Bearer ${token}`})

    expect(response.status).toBe(200);
  })

  it("should not be able to show user profile if token is invalid", async () => {
    const response = await request(app). get("/api/v1/profile")
    .set({Authorization: `Bearer 12345`})

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("JWT invalid token!");
  })
})
