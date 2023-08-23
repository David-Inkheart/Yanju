import { Prisma } from '@prisma/client';
import prisma from '../utils/db.server';

// create new account in db
export const createAccount = (userId: number) => {
  return prisma.account.create({
    data: {
      userId,
    },
  });
};

export const findAccountUser = (data: Prisma.UserWhereUniqueInput) => {
  return prisma.user.findUnique({ where: data, include: { accounts: true } });
};

export const updateAccountBalance = (senderData: Prisma.AccountUpdateArgs, recipientData: Prisma.AccountUpdateArgs) => {
  return prisma.$transaction([prisma.account.update(senderData), prisma.account.update(recipientData)]);
};

export const recordTransaction = (data: Prisma.TransactionCreateInput) => {
  return prisma.transaction.create({ data });
};
