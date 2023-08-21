import { faker } from '@faker-js/faker';
import { mocked } from 'jest-mock';

import AuthController from './Authcontroller';
import { createUser, findUser } from '../repositories/db.user';
import { comparePasswords } from '../utils/passwordService';

jest.mock('../repositories/db.user');
jest.mock('../utils/passwordService');

describe('AuthController', () => {
  describe('register', () => {
    it('should fail if validation fails', async () => {
      await expect(
        AuthController.register({
          username: faker.string.alphanumeric(),
          email: faker.internet.email(),
          password: faker.internet.password({ length: 3 }),
        }),
      ).resolves.toMatchObject({
        success: false,
      });
    });

    it('should fail if user already exists', async () => {
      const username = faker.internet.userName();
      const email = faker.internet.email();
      const password = faker.internet.password({ length: 8 });

      mocked(findUser).mockResolvedValueOnce({
        id: 1,
        username,
        email,
        password,
        createdAt: faker.date.past(),
      });
      await expect(
        AuthController.register({
          username,
          email,
          password,
        }),
      ).resolves.toMatchObject({
        success: false,
      });
    });

    it('should return success if user is created successfully', async () => {
      // alphanumeric username
      const username = faker.string.alphanumeric({ length: { min: 3, max: 20 } });
      const email = faker.internet.email();
      const password = faker.internet.password({ length: 8 });

      mocked(findUser).mockResolvedValueOnce(null);
      mocked(createUser).mockResolvedValueOnce({
        id: 1,
        username,
        email,
        password,
        createdAt: faker.date.anytime(),
      });
      await expect(
        AuthController.register({
          username,
          email,
          password,
        }),
      ).resolves.toMatchObject({
        success: true,
      });
    });
  });

  describe('login', () => {
    it('should fail if password validation fails', async () => {
      await expect(AuthController.login({ email: faker.internet.email(), password: faker.internet.password({ length: 3 }) })).resolves.toMatchObject({
        success: false,
      });
    });

    it('should return success if user exists and password is correct', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password({ length: 8 });

      mocked(findUser).mockResolvedValueOnce({
        id: 1,
        username: faker.internet.userName(),
        email,
        password,
        createdAt: faker.date.past(),
      });
      mocked(comparePasswords).mockResolvedValueOnce(true);
      await expect(
        AuthController.login({
          email,
          password,
        }),
      ).resolves.toMatchObject({
        success: true,
      });
    });

    it('should fail if user does not exist', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password({ length: 8 });

      mocked(findUser).mockResolvedValueOnce(null);
      await expect(
        AuthController.login({
          email,
          password,
        }),
      ).resolves.toMatchObject({
        success: false,
      });
    });

    it('should fail if user exist and password is incorrect', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password({ length: 8 });

      mocked(findUser).mockResolvedValueOnce({
        id: 1,
        username: faker.internet.userName(),
        email,
        password,
        createdAt: faker.date.past(),
      });
      mocked(comparePasswords).mockResolvedValueOnce(false);
      await expect(
        AuthController.login({
          email,
          password,
        }),
      ).resolves.toMatchObject({
        success: false,
      });
    });
  });
});
