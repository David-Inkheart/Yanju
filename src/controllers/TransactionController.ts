import { configDotenv } from 'dotenv';
import { v4 as uuid } from 'uuid';

import { fundSchema, transactionHistorySchema, transferMoneySchema, withdrawSchema } from '../utils/validators';
import transfer from '../utils/transactions/transferService';
import { getTransactions } from '../repositories/db.transaction';
import hashArguments from '../utils/hash';
import isDuplicateTxn from '../utils/transactions/checkTransaction';
import { findAccountbyUserId } from '../repositories/db.account';
import { findUser, getTransferDetails, saveTransferDetails } from '../repositories/db.user';
import { initPay, createTransferRecipient, transferInit, resolveAccount } from '../services/paystack/paystack';
import { TransferParams } from '../types/custom';
import { debitUserAccount } from '../utils/transactions/withdrawalService';

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

  static async withdrawalInit({
    userId,
    accountNumber,
    bankCode,
    amount,
    narration,
  }: {
    userId: number;
    accountNumber: string;
    bankCode: string;
    amount: number;
    narration: string;
  }) {
    const { error } = withdrawSchema.validate({ amount, userId, narration, accountNumber, bankCode });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    const reference = uuid();
    const senderAccount = await findAccountbyUserId(userId);

    let recipientCode: string | undefined;
    let accountName: string | undefined;

    const savedTransferDetails = await getTransferDetails({ account_number: accountNumber, bank_code: bankCode });

    if (savedTransferDetails) {
      recipientCode = savedTransferDetails.recipient_code;
      accountName = savedTransferDetails.account_name;
      // console.log('Transfer recipient from db: ', savedTransferDetails);
    } else {
      const resolvedAccountDetails = await resolveAccount(accountNumber, bankCode);

      accountName = resolvedAccountDetails.data.account_name;

      // console.log('Resolved account details: ', resolvedAccountDetails.data);

      const transferRecipientResult = await createTransferRecipient({
        name: accountName!,
        bankCode,
        accountNumber,
      });

      recipientCode = transferRecipientResult.data.recipient_code;

      // console.log('Transfer recipient from paystack: ', transferRecipientResult.data);
    }

    await saveTransferDetails({
      account_name: accountName!,
      account_number: accountNumber,
      bank_code: bankCode,
      recipient_code: recipientCode!,
      reference,
      sender_acc_id: senderAccount[0].id,
    });

    await debitUserAccount({
      amount,
      accountId: senderAccount[0].id,
      accountBalance: Number(senderAccount[0].balance),
      reference,
      reason: narration,
    });
    await transferInit({ amount, recipient: recipientCode!, reference, reason: narration });

    return {
      success: true,
      message: 'Withdrawal initiated successfully',
    };
  }
}

export default TransactionController;
