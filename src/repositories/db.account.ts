import { Account, Prisma } from '@prisma/client';
import prisma from '../utils/db.server';

// create new account in db
export const createAccount = (userId: number) => {
  return prisma.account.create({
    data: {
      userId,
    },
  });
};

// export const findAccountUser = (data: Prisma.UserWhereUniqueInput) => {
//   return prisma.user.findUnique({ where: data, include: { accounts: true } });
// };

// export const updateAccountBalance = (senderData: Prisma.AccountUpdateArgs, recipientData: Prisma.AccountUpdateArgs) => {
//   return prisma.$transaction([prisma.account.update(senderData), prisma.account.update(recipientData)]);
// };

// export const recordTransaction = (data: Prisma.TransactionCreateInput) => {
//   return prisma.transaction.create({ data });
// };

export const findAccountbyUserId = (userId: number, txn: Prisma.TransactionClient) => {
  return txn.$queryRaw<Account[]>(Prisma.sql`SELECT * FROM "public"."Account" WHERE "userId" = ${userId} FOR UPDATE;`);
};

export const updateSenderAccountBalance = (senderAccountId: number, amount: number, txn: Prisma.TransactionClient) => {
  return txn.account.update({
    where: { id: senderAccountId },
    data: {
      balance: {
        decrement: amount,
      },
    },
  });
};

export const updateRecipientAccountBalance = (recipientAccountId: number, amount: number, txn: Prisma.TransactionClient) => {
  return txn.account.update({
    where: { id: recipientAccountId },
    data: {
      balance: {
        increment: amount,
      },
    },
  });
};

export const getSubType = (txn: Prisma.TransactionClient) => {
  return txn.transactionSubType.findFirst({
    where: { name: 'TRANSFER' },
  });
};

// export const recordTransaction = (data: Prisma.TransactionCreateArgs, txn: Prisma.TransactionClient) => {
//   return txn.transaction.create(data);
// };

export const recordSenderTransaction = (
  {
    amount,
    senderBalance,
    senderAccountId,
    subTypeId,
    reference,
  }: { amount: number; senderBalance: number; senderAccountId: number; subTypeId: number; reference: string },
  txn: Prisma.TransactionClient,
) => {
  return txn.transaction.create({
    data: {
      amount,
      type: 'DEBIT',
      bal_before: senderBalance,
      bal_after: senderBalance - amount,
      reference,
      accountId: senderAccountId,
      transactionSubTypeId: subTypeId,
    },
  });
};

export const recordRecipientTransaction = (
  {
    amount,
    recipientBalance,
    recipientAccountId,
    subTypeId,
    reference,
  }: { amount: number; recipientBalance: number; recipientAccountId: number; subTypeId: number; reference: string },
  txn: Prisma.TransactionClient,
) => {
  return txn.transaction.create({
    data: {
      amount,
      type: 'CREDIT',
      bal_before: recipientBalance,
      bal_after: recipientBalance + amount,
      reference,
      accountId: recipientAccountId,
      transactionSubTypeId: subTypeId,
    },
  });
};
