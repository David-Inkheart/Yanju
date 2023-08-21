import { Prisma } from '@prisma/client';
import prisma from '../utils/db.server';

export const findUser = (data: Prisma.UserWhereUniqueInput) => {
  return prisma.user.findUnique({ where: data });
};

export const createUser = (data: Prisma.UserCreateInput) => {
  return prisma.user.create({ data });
};

export const updateUser = (id: number, data: Prisma.UserUpdateInput) => {
  return prisma.user.update({ where: { id }, data });
};

export const createProfile = ({ userId, bio }: { userId: number; bio: string }) => {
  return prisma.profile.create({
    data: {
      bio,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

export const updateTheProfile = ({ userId, bio }: { userId: number; bio: string }) => {
  return prisma.profile.update({
    where: {
      userId,
    },
    data: {
      bio,
    },
  });
};
