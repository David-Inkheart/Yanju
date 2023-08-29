import { transactionHistorySchema, transferMoneySchema } from '../utils/validators';
import transfer from '../utils/transferService';
import { getTransactions } from '../repositories/db.account';

interface TransferParams {
  amount: number;
  recipientId: number;
  senderId: number;
}

class TransactionController {
  static async transferMoney({ amount, recipientId, senderId }: TransferParams) {
    const { error } = transferMoneySchema.validate({ amount, recipientId, senderId });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (senderId === recipientId) {
      return {
        success: false,
        message: 'You cannot transfer money to yourself',
      };
    }

    const result = await transfer(senderId, recipientId, amount);

    return result;
  }

  static async getTransactionHistory({
    userId,
    limit,
    offset,
    type,
    sub_type,
    from,
    to,
  }: {
    userId: number;
    limit?: number;
    offset?: number;
    type?: 'DEBIT' | 'CREDIT';
    sub_type?: string;
    from?: string;
    to?: string;
  }) {
    const { error } = transactionHistorySchema.validate({ limit, offset, type, sub_type, from, to });
    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    const transactions = await getTransactions({ userId, limit, offset, from, to, type, sub_type });

    return {
      success: true,
      message: 'Transactions fetched successfully',
      data: transactions,
    };
  }
}

export default TransactionController;
