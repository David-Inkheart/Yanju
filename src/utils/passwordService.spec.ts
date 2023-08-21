import { faker } from '@faker-js/faker';
import { mocked } from 'jest-mock';

import bcrypt from 'bcrypt';
import { hashPassword, comparePasswords } from './passwordService';

jest.mock('bcrypt');

describe('passwordService', () => {
  describe('hashPassword', () => {
    it('should return hashed password', async () => {
      const password = faker.internet.password();
      const hashedPassword = faker.internet.password();

      mocked(bcrypt.hash).mockResolvedValueOnce(hashedPassword as never);

      await expect(hashPassword(password)).resolves.toBe(hashedPassword);
    });
  });

  describe('comparePasswords', () => {
    it('should return true when passwords match', async () => {
      const plainTextPassword = faker.internet.password();
      const hashedPassword = faker.internet.password();

      mocked(bcrypt.compare).mockResolvedValueOnce(true as never);

      await expect(comparePasswords(plainTextPassword, hashedPassword)).resolves.toBe(true);
    });

    it('should return false when passwords do not match', async () => {
      const plainTextPassword = faker.internet.password();
      const hashedPassword = faker.internet.password();

      mocked(bcrypt.compare).mockResolvedValueOnce(false as never);

      await expect(comparePasswords(plainTextPassword, hashedPassword)).resolves.toBe(false);
    });
  });
});
