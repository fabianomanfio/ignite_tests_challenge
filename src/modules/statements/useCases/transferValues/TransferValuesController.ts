import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { TransferValuesUseCase } from './TransferValuesUseCase';


  export class TransferValuesController {
    async execute(request: Request, response: Response) {
      const { id: sender_id } = request.user;
      const { user_id: receiver_id } = request.params;
      const { amount, description } = request.body;

      const transferValuesUseCase = container.resolve(TransferValuesUseCase);

      const transfer = await transferValuesUseCase.execute({
        sender_id,
        receiver_id,
        amount,
        description,
      });

      return response.status(201).json(transfer)
    }
  }
