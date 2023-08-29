import { Account, Prisma } from '@prisma/client';
import prisma from '../utils/db.server';

export const createAccount = (userId: number) => {
  return prisma.account.create({
    data: {
      userId,
    },
  });
};

export const findAccountbyUserId = (userId: number, txn?: Prisma.TransactionClient) => {
  return txn
    ? txn.$queryRaw<Account[]>(Prisma.sql`SELECT * FROM "public"."Account" WHERE "userId" = ${userId} FOR UPDATE;`)
    : prisma.$queryRaw<Account[]>(Prisma.sql`SELECT * FROM "public"."Account" WHERE "userId" = ${userId} FOR UPDATE;`);
};

export const debitAccount = ({ amount, accountId, txn }: { amount: number; accountId: number; txn?: Prisma.TransactionClient }) =>
  txn
    ? txn.account.update({
        where: { id: accountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
        select: { balance: true },
      })
    : prisma.account.update({
        where: { id: accountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
        select: { balance: true },
      });

export const creditAccount = ({ amount, accountId, txn }: { accountId: number; amount: number; txn?: Prisma.TransactionClient }) =>
  txn
    ? txn.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: amount,
          },
        },
        select: { balance: true },
      })
    : prisma.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: amount,
          },
        },
        select: { balance: true },
      });

export const getSubType = (name: string) => prisma.transactionSubType.findFirst({ where: { name } });
