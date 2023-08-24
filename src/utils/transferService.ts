import { v4 as uuidv4 } from 'uuid';
import { Prisma, Account } from '@prisma/client';
import prisma from './db.server';
import { findUserWithOptionalTxn } from '../repositories/db.user';

async function transfer(from: number, to: number, amount: number) {
  return prisma.$transaction(async (tx) => {
    const [sender, recipient] = await Promise.all([findUserWithOptionalTxn({ id: from }, tx), findUserWithOptionalTxn({ id: to }, tx)]);
    // const [sender, recipient] = await Promise.all([tx.user.findUnique({ where: { id: from } }), tx.user.findUnique({ where: { id: to } })]);

    if (!sender || !recipient) {
      return {
        success: false,
        message: 'Account not found',
      };
    }

    const [senderAccount, recipientAccount] = await Promise.all([
      tx.$queryRaw<Account[]>(Prisma.sql`SELECT * FROM "public"."Account" WHERE "userId" = ${from} FOR UPDATE;`),
      tx.$queryRaw<Account[]>(Prisma.sql`SELECT * FROM "public"."Account" WHERE "userId" = ${to} FOR UPDATE;`),
    ]);

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

    await tx.account.update({
      where: { id: senderAccount[0].id },
      data: { balance: { decrement: amount } },
    });

    await tx.account.update({
      where: { id: recipientAccount[0].id },
      data: { balance: { increment: amount } },
    });

    const reference = uuidv4();

    const subTypes = await tx.transactionSubType.findFirst({ where: { name: 'transfer' } });

    await tx.transaction.create({
      data: {
        amount,
        type: 'DEBIT',
        bal_before: senderBalance,
        bal_after: senderBalance - amount,
        reference,
        accountId: senderAccount[0].id,
        transactionSubTypeId: subTypes!.id,
      },
    });

    await tx.transaction.create({
      data: {
        amount,
        type: 'CREDIT',
        bal_before: recipientBalance,
        bal_after: recipientBalance + amount,
        reference,
        accountId: recipientAccount[0].id,
        transactionSubTypeId: subTypes!.id,
      },
    });

    return {
      success: true,
      message: 'Money transfer successful',
    };
  });
}

export default transfer;
