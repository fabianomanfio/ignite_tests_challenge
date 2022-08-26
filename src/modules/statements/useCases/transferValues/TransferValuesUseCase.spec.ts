import { Statement } from '@modules/statements/entities/Statement';
import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { TransferValuesError } from './TransferValuesError';
import { TransferValuesUseCase } from './TransferValuesUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

let createStatementUseCase: CreateStatementUseCase;
let transferValuesUseCase: TransferValuesUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Transfer Values", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
    transferValuesUseCase = new TransferValuesUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
  });

  it("should be able to do a transfer value", async () => {
    const sender = {
      name: "Sender Usuário",
      email: "sender@example.com",
      password: "123",
    };

    const userSender = await usersRepositoryInMemory.create(sender);

    const receiver = {
      name: "Receiver Usuário",
      email: "receiver@example.com",
      password: "123",
    };

    const userReceiver = await usersRepositoryInMemory.create(receiver);

    await createStatementUseCase.execute({
      user_id: userSender.id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: "Deposit"
    });

    const transfer = await transferValuesUseCase.execute({
      sender_id: userSender.id,
      receiver_id: userReceiver.id,
      amount: 100,
      description: "Descrição da transferência"
    });

    const balanceSender = await statementsRepositoryInMemory.getUserBalance({
      user_id: userSender.id,
      with_statement: true
    }) as { balance: number, statement: Statement[] }

    const balanceReceiver = await statementsRepositoryInMemory.getUserBalance({
      user_id: userReceiver.id,
      with_statement: true
    }) as { balance: number, statement: Statement[] }

    // console.log(balanceSender, balanceReceiver);

    expect(transfer).toHaveProperty("id");

    expect(transfer).toMatchObject({
      sender_id: userSender.id,
      user_id: userReceiver.id,
      amount: 100,
      description: 'Descrição da transferência',
      type: OperationType.TRANSFER
    });

    expect(balanceSender.balance).toBe(400)
    expect(balanceSender.statement.length).toBe(2)

    expect(balanceReceiver.balance).toBe(100)
    expect(balanceReceiver.statement.length).toBe(1)
  });

  it("should not be able to do a transfer that have Insufficient Value", async () => {
    const sender = {
      name: "Sender Usuário",
      email: "sender@example.com",
      password: "123",
    };

    const userSender = await usersRepositoryInMemory.create(sender);

    const receiver = {
      name: "Receiver Usuário",
      email: "receiver@example.com",
      password: "123",
    };

    const userReceiver = await usersRepositoryInMemory.create(receiver);

    await createStatementUseCase.execute({
      user_id: userSender.id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: "Deposit"
    });

    await expect(async () => {
      await transferValuesUseCase.execute({
        sender_id: userSender.id,
        receiver_id: userReceiver.id,
        amount: 1000,
        description: 'Teste Insufficient Value'
      })
    }).rejects.toBeInstanceOf(TransferValuesError.InsufficientValue)
  });

  it("should not be able to do a transfer value that user not found", async () => {
    const sender = {
      name: "Sender Usuário",
      email: "sender@example.com",
      password: "123",
    };

    const userSender = await usersRepositoryInMemory.create(sender);

    const receiver = {
      name: "Receiver Usuário",
      email: "receiver@example.com",
      password: "123",
    };

    const userReceiver = await usersRepositoryInMemory.create(receiver);

    await expect(async () => {
      await transferValuesUseCase.execute({
        sender_id: 'Sender',
        receiver_id: userReceiver.id,
        amount: 1000,
        description: 'Teste Sender not found'
      })
    }).rejects.toBeInstanceOf(TransferValuesError.SenderNotFound)

    await expect(async () => {
      await transferValuesUseCase.execute({
        sender_id: userSender.id,
        receiver_id: 'Receiver',
        amount: 1000,
        description: 'Teste Receiver not found'
      })
    }).rejects.toBeInstanceOf(TransferValuesError.ReceiverNotFound)

  });
});
