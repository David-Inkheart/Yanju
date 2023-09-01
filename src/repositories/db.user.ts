import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '../utils/db.server';

export type PrismaTransaction = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export const findUser = (data: Prisma.UserWhereUniqueInput) => {
  return prisma.user.findUnique({ where: data });
};

export const findUserByNames = (data: Prisma.UserWhereInput) => {
  return prisma.user.findFirst({ where: data });
};

export const findUserWithOptionalTxn = (data: Prisma.UserWhereUniqueInput, txn?: PrismaTransaction) => {
  return txn ? txn.user.findUnique({ where: data }) : prisma.user.findUnique({ where: data });
};

// create user with an account
export const createUser = (data: Prisma.UserCreateInput) => {
  return prisma.user.create({
    data: {
      ...data,
      accounts: {
        create: {},
      },
    },
  });
};

export const updateUser = (id: number, data: Prisma.UserUpdateInput) => {
  return prisma.user.update({ where: { id }, data });
};
