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

// find account by id
export const findAccount = (data: Prisma.AccountWhereUniqueInput) => {
  return prisma.account.findUnique({ where: data });
};
