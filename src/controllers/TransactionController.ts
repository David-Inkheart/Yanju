import { configDotenv } from 'dotenv';

import { fundSchema, transactionHistorySchema, transferMoneySchema, withdrawSchema } from '../utils/validators';
import transfer from '../utils/transactions/transferService';
import { getTransactions } from '../repositories/db.transaction';
import hashArguments from '../utils/hash';
import isDuplicateTxn from '../utils/transactions/checkTransaction';
import { findAccountbyUserId } from '../repositories/db.account';
import { findUser } from '../repositories/db.user';
import { initPay, listBanks, transferRecipient, transferInit, transferFinalize } from '../services/paystack/paystack';
import { TransferParams } from '../types/custom';

configDotenv();

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

  static async fundAccountInit(userId: number, amount: number) {
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

  static async withdrawalInit(userId: number, amount: number, narration: string) {
    const { error } = withdrawSchema.validate({ amount, userId, narration });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    const user = await findUser({ id: userId });

    // "slug": "fidelity-bank",
    // "code": "070",
    // "longcode": "070150003",
    const banks = await listBanks(); // list of banks in Nigeria from paystack
    const userBank = banks.data.find((bank: any) => bank.slug === 'fidelity-bank');
    const name = `${user!.firstName} ${user!.lastName}`;
    // const account = await findAccountbyUserId(userId);
    const createPuser = await transferRecipient({ name, bankCode: userBank.code, accountNumber: process.env.ACCOUNT_NO as string });
    const recipientCode = createPuser.data.recipient_code;

    const response = await transferInit({ amount, recipient: recipientCode, reason: narration });

    const { transfer_code } = response.data;

    const result = await transferFinalize(transfer_code);
    console.log(result);
    return result;
  }
}

export default TransactionController;
