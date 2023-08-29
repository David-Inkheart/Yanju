import { v4 as uuidv4 } from 'uuid';
import prisma from './db.server';
import { findUserWithOptionalTxn } from '../repositories/db.user';
import { creditAccount, debitAccount, findAccountbyUserId } from '../repositories/db.account';
import { recordTransaction, getSubType } from '../repositories/db.transaction';

async function transfer(from: number, to: number, amount: number) {
  const recipient = await findUserWithOptionalTxn({ id: to });

  if (!recipient) {
    return {
      success: false,
      message: 'Account not found',
    };
  }

  const reference = uuidv4();

  const subType = await getSubType('TRANSFER');

  if (!subType) throw new Error('Could not find subtype');

  return prisma.$transaction(
    async (tx) => {
      const [senderAccount, recipientAccount] = await Promise.all([findAccountbyUserId(from, tx), findAccountbyUserId(to, tx)]);

      if (!senderAccount || !recipientAccount) throw new Error('Could not find account');

      const senderBalance = Number(senderAccount[0].balance);
      const recipientBalance = Number(recipientAccount[0].balance);

      if (senderBalance < amount) {
        return {
          success: false,
          message: 'Insufficient funds',
        };
      }

      const { balance: recipientUpdtedBalance } = await creditAccount({ amount, accountId: recipientAccount[0].id, txn: tx });
      const { balance: senderUpdatedBalance } = await debitAccount({ amount, accountId: senderAccount[0].id, txn: tx });

      await Promise.all([
        recordTransaction(
          {
            amount,
            balanceAfter: Number(senderUpdatedBalance),
            balanceBefore: senderBalance,
            type: 'DEBIT',
            reference,
            subTypeId: subType!.id,
            accountId: senderAccount[0].id,
          },
          tx,
        ),

        recordTransaction(
          {
            amount,
            balanceAfter: Number(recipientUpdtedBalance),
            balanceBefore: recipientBalance,
            type: 'CREDIT',
            reference,
            subTypeId: subType!.id,
            accountId: recipientAccount[0].id,
          },
          tx,
        ),
      ]);

      return {
        success: true,
        message: 'Money transfer successful',
      };
    },
    {
      maxWait: 5000, // default is 2000
      timeout: 10000, // default is 5000
    },
  );
}

export default transfer;
