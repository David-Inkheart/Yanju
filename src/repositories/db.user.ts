import { Prisma } from '@prisma/client';
import prisma from '../utils/db.server';

export const findUser = (data: Prisma.UserWhereUniqueInput) => {
  return prisma.user.findUnique({ where: data });
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
