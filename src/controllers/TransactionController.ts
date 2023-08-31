import { fundSchema, transactionHistorySchema, transferMoneySchema } from '../utils/validators';
import transfer from '../utils/transferService';
import { getTransactions } from '../repositories/db.transaction';
import hashArguments from '../utils/hash';
import isDuplicateTxn from '../utils/checkTransaction';
import { findAccountbyUserId } from '../repositories/db.account';
import { findUser } from '../repositories/db.user';
import { initPay } from '../services/paystack/paystack';
import { TransferParams } from '../types/custom';

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

    const [senderAccount, recipientAccount] = await Promise.all([findAccountbyUserId(senderId), findAccountbyUserId(recipientId)]);
    const hashedArgs = hashArguments(amount, senderAccount[0].id, recipientAccount[0].id);
    const isDuplicate = await isDuplicateTxn(senderAccount[0].id.toString(), hashedArgs);

    if (isDuplicate) {
      return {
        success: false,
        message: 'Duplicate transaction',
      };
    }

    const result = await transfer(senderId, recipientId, amount);

    return result;
  }

  static async getTransactionHistory({
    userId,
    limit,
    page,
    type,
    sub_type,
    from,
    to,
  }: {
    userId: number;
    limit?: number;
    page: number;
    type?: 'DEBIT' | 'CREDIT';
    sub_type?: string;
    from?: string;
    to?: string;
  }) {
    const { error } = transactionHistorySchema.validate({ limit, page, type, sub_type, from, to });
    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    const transactions = await getTransactions({ userId, limit, page, from, to, type, sub_type });

    return {
      success: true,
      message: 'Transactions fetched successfully',
      data: transactions,
    };
  }

  static async fundAccount(userId: number, amount: number) {
    const { error } = fundSchema.validate({ amount, userId });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    const user = await findUser({ id: userId });

    const result = await initPay({ email: user!.email, amount, metadata: {} });

    return result;
  }
}

export default TransactionController;
