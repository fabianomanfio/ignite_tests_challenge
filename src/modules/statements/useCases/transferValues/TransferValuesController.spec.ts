import request from "supertest"
import { Connection } from 'typeorm'
import { app } from "../../../../app";
import { v4 as uuidV4 } from "uuid";

import createConnection from '@database/index';

let connection: Connection

describe("Transfer Values", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to do a transfer value", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Sender",
        email: "user_sender@example.com",
        password: "123",
      });

    await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Receiver",
        email: "user_receiver@example.com",
        password: "123",
      });

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user_sender@example.com",
        password: "123",
      });

    const { token, user: userSender } = responseToken.body;

    const receiverToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user_receiver@example.com",
        password: "123",
      });

    const { user: userReceiver } = receiverToken.body;

    const statement = await request(app).post("/api/v1/statements/deposit")
      .send({
        amount: 500,
        description: "deposit"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    const transfer = await request(app).post(
      `/api/v1/statements/transfers/${userReceiver.id}`
    )
      .send({
        amount: 100,
        description: "Teste Transferência",

      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const Balance = await request(app).get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { sender_id, amount, description, type } = transfer.body
    const { balance } = Balance.body

    expect(transfer.statusCode).toBe(201)
    expect(transfer.body).toHaveProperty('sender_id')
    expect(amount).toBe(100)
    expect(description).toBe('Teste Transferência')
    expect(type).toBe("transfer")
    expect(sender_id).toBe(userSender.id)
    expect(balance).toBe(400)
  });

  it("should not be able to do a transfer that have Insufficient Value", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Sender Insufficient",
        email: "user_sender_insufficient@example.com",
        password: "123",
      });

    await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Receiver Insufficient",
        email: "user_receiver_insufficient@example.com",
        password: "123",
      });

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user_sender_insufficient@example.com",
        password: "123",
      });

    const { token } = responseToken.body;

    const receiver_insufficient_Token = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user_receiver_insufficient@example.com",
        password: "123",
      });

    const { user: userReceiver_insufficient } = receiver_insufficient_Token.body;

    const statement = await request(app).post("/api/v1/statements/deposit")
      .send({
        amount: 500,
        description: "deposit"
      })
      .set({
        Authorization: `Bearer ${token}`
      });


    const transfer = await request(app).post(
      `/api/v1/statements/transfers/${userReceiver_insufficient.id}`
    )
      .send({
        amount: 5000,
        description: "Teste Transferência",

      })
      .set({
        Authorization: `Bearer ${token}`,
      });

      expect(transfer.statusCode).toBe(400)
      expect(transfer.body).toHaveProperty('message')
  });

  it("should not be able to do a transfer value that user receiver not found", async () => {
    const fakeReceiver = uuidV4()
    const fakeSender = uuidV4()

    await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Sender Found",
        email: "user_sender_found@example.com",
        password: "123",
      });

    await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Receiver Found",
        email: "user_receiver_found@example.com",
        password: "123",
      });

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user_sender_found@example.com",
        password: "123",
      });

    const { token } = responseToken.body;

    const receiver_found_Token = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user_receiver_found@example.com",
        password: "123",
      });

    const { user: userReceiver_found } = receiver_found_Token.body;

    const statement = await request(app).post("/api/v1/statements/deposit")
      .send({
        amount: 500,
        description: "deposit"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    const transfer_receiver_notfound = await request(app).post(
      `/api/v1/statements/transfers/${fakeReceiver}`
    )
      .send({
        amount: 100,
        description: "Teste Transferência",

      })
      .set({
        Authorization: `Bearer ${token}`,
      });


    const transfer_sender_notfound = await request(app).post(
      `/api/v1/statements/transfers/${userReceiver_found.id}`
    )
      .send({
        amount: 100,
        description: "Teste Transferência",

      })
      .set({
        Authorization: `Bearer ${fakeSender}`,
      });

    expect(transfer_receiver_notfound.statusCode).toBe(404)
    expect(transfer_receiver_notfound.body).toHaveProperty('message')
    expect(transfer_sender_notfound.statusCode).toBe(401)
    expect(transfer_sender_notfound.body).toHaveProperty('message')
  });

})
