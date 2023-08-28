import { transactionHistorySchema, transferMoneySchema } from '../utils/validators';
import transfer from '../utils/transferService';
import { getTransactionsByType, getTransactionsByDate, getTransactionsBySubType, getTransactions } from '../repositories/db.account';

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
    startDate,
    endDate,
  }: {
    userId: number;
    limit?: number;
    offset?: number;
    type?: 'DEBIT' | 'CREDIT';
    sub_type?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const { error } = transactionHistorySchema.validate({ limit, offset, type, sub_type, startDate, endDate });
    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    let transactions = await getTransactions({ userId, limit, offset });

    if (type) {
      transactions = await getTransactionsByType({ userId, limit, offset, type });
    }

    if (sub_type) {
      transactions = await getTransactionsBySubType({ userId, limit, offset, subType: sub_type });
    }

    if (startDate && endDate) {
      transactions = await getTransactionsByDate({ userId, limit, offset, startDate, endDate });
    }
    // console.log(transactions!.map((txn) => txn.createdAt));

    return {
      success: true,
      message: 'Transactions fetched successfully',
      data: transactions,
    };
  }
}

export default TransactionController;
