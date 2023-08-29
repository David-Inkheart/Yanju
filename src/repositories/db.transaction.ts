import { Prisma } from '@prisma/client';
import { startOfDay, endOfDay } from 'date-fns';
import prisma from '../utils/db.server';

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

export const getTransactions = async ({
  userId,
  limit = 10,
  page = 1,
  from,
  to,
  type,
  sub_type,
}: {
  userId: number;
  limit?: number;
  page: number;
  from?: string;
  to?: string;
  type?: 'DEBIT' | 'CREDIT';
  sub_type?: string;
}) => {
  const account = await prisma.account.findFirst({ where: { userId } });

  const StartDate = from ? startOfDay(new Date(from)) : undefined;
  const EndDate = to ? endOfDay(new Date(to)) : undefined;

  const data = await prisma.$transaction([
    prisma.transaction.count({
      where: {
        accountId: account!.id,
        createdAt: {
          ...(from && { gte: StartDate }),
          ...(to && { lte: EndDate }),
        },
        ...(type && { type }),
        ...(sub_type && { subType: { name: sub_type } }),
      },
    }),

    prisma.transaction.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        accountId: account!.id,
        createdAt: {
          ...(from && { gte: StartDate }),
          ...(to && { lte: EndDate }),
        },
        ...(type && { type }),
        ...(sub_type && { subType: { name: sub_type } }),
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
