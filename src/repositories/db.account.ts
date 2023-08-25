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

export const findAccountbyUserId = (userId: number, txn: Prisma.TransactionClient) => {
  return txn.$queryRaw<Account[]>(Prisma.sql`SELECT * FROM "public"."Account" WHERE "userId" = ${userId} FOR UPDATE;`);
};

export const debitAccount = ({ amount, accountId, txn }: { amount: number; accountId: number; txn: Prisma.TransactionClient }) =>
  txn.account.update({
    where: { id: accountId },
    data: {
      balance: {
        decrement: amount,
      },
    },
    select: { balance: true },
  });

export const creditAccount = ({ amount, accountId, txn }: { amount: number; accountId: number; txn: Prisma.TransactionClient }) =>
  txn.account.update({
    where: { id: accountId },
    data: {
      balance: {
        increment: amount,
      },
    },
    select: { balance: true },
  });

export const getSubType = (name: string) => prisma.transactionSubType.findFirst({ where: { name } });

export const recordTransaction = (
  {
    amount,
    balanceBefore,
    balanceAfter,
    type,
    subTypeId,
    accountId,
    reference,
    metadata,
  }: {
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    subTypeId: number;
    type: 'DEBIT' | 'CREDIT';
    reference: string;
    accountId: number;
    metadata?: { [key: string]: string | number };
  },
  txn: Prisma.TransactionClient,
) =>
  txn.transaction.create({
    data: {
      amount,
      type,
      bal_before: balanceBefore,
      bal_after: balanceAfter,
      reference,
      accountId,
      transactionSubTypeId: subTypeId,
      metadata,
    },
  });
