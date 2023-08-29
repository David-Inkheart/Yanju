/* eslint-disable no-nested-ternary */
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
    type: 'DEBIT' | 'CREDIT';
    reference: string;
    subTypeId: number;
    accountId: number;
    metadata?: { [key: string]: string | number };
  },
  txn?: Prisma.TransactionClient,
) => {
  return txn
    ? txn.transaction.create({
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
      })
    : prisma.transaction.create({
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
};

// export const getTransactions = ({
//   userId,
//   limit,
//   page,
//   from,
//   to,
//   type,
//   sub_type,
// }: {
//   userId: number;
//   limit?: number;
//   page?: number;
//   from?: string;
//   to?: string;
//   type?: 'DEBIT' | 'CREDIT';
//   sub_type?: string;
// }) => {
//   return prisma.account
//     .findFirst({
//       where: { userId },
//       include: { _count: { select: { transactions: true } } },
//     })
//     .transactions({
//       take: limit || 10,
//       skip: page ? (page - 1) * limit! : 0,
//       orderBy: {
//         createdAt: 'desc',
//       },
//       where: {
//         AND: [
//           {
//             createdAt: {
//               gte: from ? new Date(from).toISOString() : undefined,
//               lte: to ? new Date(to).toISOString() : undefined,
//             },
//             type: type || undefined,
//             subType: {
//               name: sub_type || undefined,
//             },
//           },
//         ],
//       },
//       include: { subType: true },
//     });
// };

export const getTransactions = async ({
  userId,
  limit,
  page,
  from,
  to,
  type,
  sub_type,
}: {
  userId: number;
  limit?: number;
  page?: number;
  from?: string;
  to?: string;
  type?: 'DEBIT' | 'CREDIT';
  sub_type?: string;
}) => {
  const account = await prisma.account.findFirst({ where: { userId } });
  const data = await prisma.$transaction([
    prisma.transaction.count({
      where: {
        accountId: account!.id,
        createdAt: {
          gte: from ? new Date(from).toISOString() : undefined,
          lte: to ? new Date(to).toISOString() : undefined,
        },
        type: type || undefined,
        subType: {
          name: sub_type || undefined,
        },
      },
    }),

    prisma.transaction.findMany({
      take: limit || 10,
      skip: page ? (page - 1) * limit! : 0,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        accountId: account!.id,
        createdAt: {
          gte: from ? new Date(from).toISOString() : undefined,
          lte: to ? new Date(to).toISOString() : undefined,
        },
        type: type || undefined,
        subType: {
          name: sub_type || undefined,
        },
      },
      include: { subType: true },
    }),
  ]);

  const [totalRecords, transactions] = data;

  return {
    totalRecords,
    transactions,
  };
};
