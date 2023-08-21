import { faker } from '@faker-js/faker';
import { mocked } from 'jest-mock';

import PasswordController from './Passwordcontroller';
import { findUser, updateUser } from '../repositories/db.user';
import { storeResetToken, getResetToken } from '../repositories/redis.user';
import { comparePasswords } from '../utils/passwordService';

jest.mock('../repositories/db.user');
jest.mock('../repositories/redis.user');
jest.mock('../utils/passwordService');
jest.mock('../redisClient');

describe('PasswordController', () => {
  describe('changePassword', () => {
    it('should fail if validation fails', async () => {
      await expect(
        PasswordController.changePassword({
          userId: 1,
          currentPassword: faker.internet.password({ length: 3 }),
          newPassword: faker.internet.password({ length: 3 }),
        }),
      ).resolves.toMatchObject({
        success: false,
      });
    });

    it('should fail if user does not exist', async () => {
      mocked(findUser).mockResolvedValueOnce(null);
      await expect(
        PasswordController.changePassword({
          userId: 1,
          currentPassword: faker.internet.password({ length: 8 }),
          newPassword: faker.internet.password({ length: 8 }),
        }),
      ).resolves.toMatchObject({
        success: false,
      });
    });

    it('should fail if current password is incorrect', async () => {
      const currentPassword = faker.internet.password({ length: 8 });
      const newPassword = faker.internet.password({ length: 8 });

      mocked(findUser).mockResolvedValueOnce({
        id: 1,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
        createdAt: faker.date.past(),
      });
      mocked(comparePasswords).mockResolvedValueOnce(false);
      await expect(
        PasswordController.changePassword({
          userId: 1,
          currentPassword,
          newPassword,
        }),
      ).resolves.toStrictEqual({
        success: false,
        error: 'Current password is incorrect',
      });
    });

    it('should return success if password is changed successfully', async () => {
      const currentPassword = faker.internet.password({ length: 8 });
      const newPassword = faker.internet.password({ length: 8 });

      mocked(findUser).mockResolvedValueOnce({
        id: 1,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
        createdAt: faker.date.past(),
      });
      mocked(comparePasswords).mockResolvedValueOnce(true);
      mocked(updateUser).mockResolvedValueOnce({
        id: 1,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
        createdAt: faker.date.past(),
      });
      await expect(
        PasswordController.changePassword({
          userId: 1,
          currentPassword,
          newPassword,
        }),
      ).resolves.toStrictEqual({
        success: true,
        message: 'Password changed successfully',
      });
    });

    it('should fail if password could not be changed', async () => {
      const currentPassword = faker.internet.password({ length: 8 });
      const newPassword = faker.internet.password({ length: 8 });

      mocked(findUser).mockResolvedValueOnce({
        id: 1,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
        createdAt: faker.date.past(),
      });
      mocked(comparePasswords).mockResolvedValueOnce(true);
      mocked(updateUser).mockRejectedValueOnce(new Error('Could not change password'));
      await expect(
        PasswordController.changePassword({
          userId: 1,
          currentPassword,
          newPassword,
        }),
      ).resolves.toStrictEqual({
        success: false,
        error: 'Could not change password',
      });
    });
  });

  describe('resetPassword', () => {
    it('should fail if validation fails', async () => {
      await expect(PasswordController.resetPassword('')).resolves.toMatchObject({
        success: false,
      });
    });

    it('should still send success if user does not exist', async () => {
      mocked(findUser).mockResolvedValueOnce(null);
      await expect(PasswordController.resetPassword(faker.internet.email())).resolves.toStrictEqual({
        success: true,
        message: 'A 5-digit code has been sent to your email address to complete the password reset process',
      });
    });

    it('should fail if redis could not store the reset token', async () => {
      mocked(findUser).mockResolvedValueOnce({
        id: 1,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
        createdAt: faker.date.past(),
      });
      mocked(storeResetToken).mockRejectedValueOnce(new Error('Could not store reset token'));
      await expect(PasswordController.resetPassword(faker.internet.email())).resolves.toMatchObject({
        success: false,
      });
    });
  });

  describe('confirm reset password', () => {
    it('should fail if validation fails', async () => {
      await expect(PasswordController.confirmResetPassword('', '', faker.internet.password())).resolves.toMatchObject({
        success: false,
      });
    });

    it('should fail if user does not exist', async () => {
      mocked(findUser).mockResolvedValueOnce(null);
      await expect(
        PasswordController.confirmResetPassword(faker.internet.email(), faker.string.numeric({ length: 5 }), faker.internet.password()),
      ).resolves.toStrictEqual({
        success: false,
        error: 'User does not exist',
      });
    });

    it('should fail if redis could not get the reset token', async () => {
      mocked(findUser).mockResolvedValueOnce({
        id: 1,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
        createdAt: faker.date.past(),
      });
      mocked(getResetToken).mockResolvedValueOnce(null);
      await expect(
        PasswordController.confirmResetPassword(faker.internet.email(), faker.string.numeric({ length: 5 }), faker.internet.password()),
      ).resolves.toStrictEqual({
        success: false,
        error: 'The code is invalid or has expired',
      });
    });

    it('should fail if the password is the same as the current password', async () => {
      mocked(findUser).mockResolvedValueOnce({
        id: 1,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
        createdAt: faker.date.past(),
      });
      mocked(getResetToken).mockResolvedValueOnce('12345');
      mocked(comparePasswords).mockResolvedValueOnce(true);
      await expect(
        PasswordController.confirmResetPassword(faker.internet.email(), '12345', faker.internet.password({ length: 8 })),
      ).resolves.toStrictEqual({
        success: false,
        error: 'New password cannot be the same as the current password',
      });
    });

    it('should pass if the password resets successfully', async () => {
      mocked(findUser).mockResolvedValueOnce({
        id: 1,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
        createdAt: faker.date.past(),
      });
      mocked(getResetToken).mockResolvedValueOnce('12345');
      mocked(comparePasswords).mockResolvedValueOnce(false);
      mocked(updateUser).mockResolvedValueOnce({
        id: 1,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
        createdAt: faker.date.past(),
      });
      await expect(
        PasswordController.confirmResetPassword(faker.internet.email(), '12345', faker.internet.password({ length: 8 })),
      ).resolves.toMatchObject({
        success: true,
      });
    });
  });
});
