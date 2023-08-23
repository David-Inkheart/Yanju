import { v4 as uuidv4 } from 'uuid';
import { findAccountUser, updateAccountBalance } from '../repositories/db.account';
import { transferMoneySchema } from '../utils/validators';
import record from '../utils/transactionService';

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
        error: error.message,
      };
    }

    if (senderId === recipientId) {
      return {
        success: false,
        error: 'You cannot transfer money to yourself',
      };
    }

    const [sender, recipient] = await Promise.all([findAccountUser({ id: senderId }), findAccountUser({ id: recipientId })]);

    if (!recipient || !sender) {
      return {
        success: false,
        error: 'Account not found',
      };
    }
    // get account of sender and recipient
    const senderAccount = sender.accounts[0];
    const recipientAccount = recipient.accounts[0];

    const senderBalance = Number(senderAccount.balance);
    const recipientBalance = Number(recipientAccount.balance);

    if (senderBalance < amount) {
      return {
        success: false,
        error: 'Insufficient funds',
      };
    }

    const newSenderBalance = senderBalance - amount;
    const newRecipientBalance = recipientBalance + amount;

    await updateAccountBalance(
      {
        where: { id: senderAccount.id },
        data: { balance: newSenderBalance },
      },
      {
        where: { id: recipientAccount.id },
        data: { balance: newRecipientBalance },
      },
    );

    const ref = uuidv4();

    await record({
      account: senderAccount,
      amount,
      transactionType: 'DEBIT',
      newBalance: newSenderBalance,
      reference: ref,
    });

    await record({
      account: recipientAccount,
      amount,
      transactionType: 'CREDIT',
      newBalance: newRecipientBalance,
      reference: ref,
    });

    // await recordTransaction({
    //   amount,
    //   type: 'DEBIT',
    //   bal_before: senderAccount.balance,
    //   reference: ref,
    //   bal_after: newSenderBalance,
    //   account: {
    //     connect: {
    //       id: senderAccount!.id,
    //     },
    //   },
    //   subType: {
    //     create: {
    //       name: 'TRANSFER',
    //     },
    //   },
    // });

    // // record transaction for recipient
    // await recordTransaction({
    //   amount,
    //   type: 'CREDIT',
    //   bal_before: recipientAccount.balance,
    //   reference: ref,
    //   bal_after: newRecipientBalance,
    //   account: {
    //     connect: {
    //       id: recipientAccount!.id,
    //     },
    //   },
    //   subType: {
    //     create: {
    //       name: 'TRANSFER',
    //     },
    //   },
    // });

    return {
      success: true,
      message: 'Money transfer successful',
    };
  }
}

export default TransactionController;
