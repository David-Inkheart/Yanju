import jwt from 'jsonwebtoken';
import { hashPassword, comparePasswords } from '../utils/passwordService';
import { registerSchema, loginSchema } from '../utils/validators';
import { createUser, findUser } from '../repositories/db.user';

class AuthController {
  static async register({
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
  }) {
    // validate user input
    const { error } = registerSchema.validate({ firstName, lastName, phoneNumber, email, password });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    // check if user is already existing email or username
    const existingUser = await findUser({ email });

    if (existingUser) {
      return {
        success: false,
        error: 'User with same email or names already exists',
      };
    }
    // hash the password
    const hashedPassword = await hashPassword(password);

    // create user and account
    const newUser = await createUser({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
    });

    // generate jwt Token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return {
      success: true,
      message: 'User registered successfully',
      token,
    };
  }

  static async login({ email, password }: { email: string; password: string }) {
    // validate user input
    const { error } = loginSchema.validate({ email, password });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    // Find the user by email
    const user = await findUser({ email });
    if (!user) {
      return {
        success: false,
        error: 'Email/password mismatch',
      };
    }
    // Compare the password
    const isMatch = await comparePasswords(password, user.password);

    if (!isMatch) {
      return {
        success: false,
        error: 'Email/password mismatch',
      };
    }
    // Generate JWT token that expires in 1 hour
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return {
      success: true,
      message: 'User logged in successfully',
      token,
    };
  }
}

export default AuthController;
