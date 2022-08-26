import { inject, injectable } from 'tsyringe';

import { ICreateStatementDTO } from '../createStatement/ICreateStatementDTO';
import { Statement } from '@modules/statements/entities/Statement';
import { TransferValuesError } from './TransferValuesError';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

interface IRequest {
  sender_id: string,
  receiver_id: string,
  amount: number;
  description: string
}

@injectable()
export class TransferValuesUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
    ) {}

  async execute({ sender_id, receiver_id, amount, description }: IRequest): Promise<Statement> {
    const userSender = await this.usersRepository.findById(sender_id);
    const userReceiver = await this.usersRepository.findById(receiver_id);

    if (!userSender) {
      throw new TransferValuesError.SenderNotFound();
    }

    if (!userReceiver) {
      throw new TransferValuesError.ReceiverNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new TransferValuesError.InsufficientValue()
    }

    const statementTransfer = await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.TRANSFER,
      user_id: userReceiver.id,
      sender_id
    })

    return statementTransfer;
  }
}
