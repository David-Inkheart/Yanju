import { v4 as uuidv4 } from 'uuid';
import prisma from './db.server';
import { findUserWithOptionalTxn } from '../repositories/db.user';
import {
  findAccountbyUserId,
  getSubType,
  recordRecipientTransaction,
  recordSenderTransaction,
  updateRecipientAccountBalance,
  updateSenderAccountBalance,
} from '../repositories/db.account';

async function transfer(from: number, to: number, amount: number) {
  return prisma.$transaction(
    async (tx) => {
      const [sender, recipient] = await Promise.all([findUserWithOptionalTxn({ id: from }, tx), findUserWithOptionalTxn({ id: to }, tx)]);

      if (!sender || !recipient) {
        return {
          success: false,
          message: 'Account not found',
        };
      }

      const [senderAccount, recipientAccount] = await Promise.all([findAccountbyUserId(from, tx), findAccountbyUserId(to, tx)]);

      if (!senderAccount || !recipientAccount) {
        return {
          success: false,
          message: 'Account not found',
        };
      }

      const senderBalance = Number(senderAccount[0].balance);
      const recipientBalance = Number(recipientAccount[0].balance);

      if (senderBalance < amount) {
        return {
          success: false,
          message: 'Insufficient funds',
        };
      }

      await updateSenderAccountBalance(senderAccount[0].id, amount, tx);
      await updateRecipientAccountBalance(recipientAccount[0].id, amount, tx);

      const reference = uuidv4();

      const subType = await getSubType(tx);

      await recordSenderTransaction(
        {
          amount,
          senderBalance,
          senderAccountId: senderAccount[0].id,
          subTypeId: subType!.id,
          reference,
        },
        tx,
      );

      await recordRecipientTransaction(
        {
          amount,
          recipientBalance,
          recipientAccountId: recipientAccount[0].id,
          subTypeId: subType!.id,
          reference,
        },
        tx,
      );

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
