import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({statement, balance}: { statement: Statement[], balance: number}) {
    const parsedStatement = statement.map(({
      id,
      amount,
      description,
      type,
      sender_id,
      created_at,
      updated_at
    }) => {
      const statements = {
        id,
        amount: Number(amount),
        description,
        type,
        sender_id,
        created_at,
        updated_at
      }
      if (!sender_id) {
        delete statements.sender_id
      }

      return statements
    }
    );

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
