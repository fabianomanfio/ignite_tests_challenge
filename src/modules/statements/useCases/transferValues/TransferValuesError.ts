import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferValuesError {
  export class SenderNotFound extends AppError {
    constructor() {
      super('Sender User not found', 404);
    }
  }

  export class ReceiverNotFound extends AppError {
    constructor() {
      super('Receiver User not found', 404);
    }
  }

  export class InsufficientValue extends AppError {
    constructor() {
      super('Insufficient Value', 400);
    }
  }
}
