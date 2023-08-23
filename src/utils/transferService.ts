import { v4 as uuidv4 } from 'uuid';
import prisma from './db.server';

async function transfer(from: number, to: number, amount: number) {
  return prisma.$transaction(async (tx) => {
    const [sender, recipient] = await Promise.all([
      tx.user.findUnique({ where: { id: from }, include: { accounts: true } }),
      tx.user.findUnique({ where: { id: to }, include: { accounts: true } }),
    ]);

    if (!sender || !recipient) {
      return {
        success: false,
        message: 'Account not found',
      };
    }

    const senderAccount = sender.accounts[0];
    const recipientAccount = recipient.accounts[0];

    const senderBalance = Number(senderAccount.balance);
    const recipientBalance = Number(recipientAccount.balance);

    if (senderBalance < amount) {
      return {
        success: false,
        message: 'Insufficient funds',
      };
    }

    await tx.account.update({
      where: { id: senderAccount.id },
      data: { balance: senderBalance - amount },
    });

    await tx.account.update({
      where: { id: recipientAccount.id },
      data: { balance: recipientBalance + amount },
    });

    const reference = uuidv4();

    await tx.transaction.create({
      data: {
        amount,
        type: 'DEBIT',
        bal_before: senderBalance,
        bal_after: senderBalance - amount,
        reference,
        account: {
          connect: {
            id: senderAccount.id,
          },
        },
        subType: {
          create: {
            name: 'TRANSFER',
          },
        },
      },
    });

    await tx.transaction.create({
      data: {
        amount,
        type: 'CREDIT',
        bal_before: recipientBalance,
        bal_after: recipientBalance + amount,
        reference,
        account: {
          connect: {
            id: recipientAccount.id,
          },
        },
        subType: {
          create: {
            name: 'TRANSFER',
          },
        },
      },
    });

    return {
      success: true,
      message: 'Money transfer successful',
    };
  });
}

export default transfer;
