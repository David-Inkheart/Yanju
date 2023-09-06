import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '../utils/db.server';

export type PrismaTransaction = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export const findUser = (data: Prisma.UserWhereUniqueInput) => {
  return prisma.user.findUnique({ where: data });
};

export const getTransferDetails = (data: Prisma.TransferAttemptWhereInput) => {
  return prisma.transferAttempt.findFirst({ where: data });
};

export const saveTransferDetails = (data: Prisma.TransferAttemptCreateInput) => {
  return prisma.transferAttempt.create({ data });
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
