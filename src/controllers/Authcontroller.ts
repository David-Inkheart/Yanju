import jwt from 'jsonwebtoken';
import { hashPassword, comparePasswords } from '../utils/passwordService';
import { registerSchema, loginSchema } from '../utils/validators';
import { createUser, findUser } from '../repositories/db.user';
import { sendToQueue } from '../utils/rabbitMQ/producer';

class AuthController {
  static async register({ username, email, password }: { username: string; email: string; password: string }) {
    // validate user input
    const { error } = registerSchema.validate({ username, email, password });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // check if user is already existing email or username
    const existingUser = (await findUser({ email })) || (await findUser({ username }));

    if (existingUser) {
      return {
        success: false,
        error: 'User with same email or username already exists',
      };
    }

    // hash the password
    const hashedPassword = await hashPassword(password);

    // save user to db
    const newUser = await createUser({
      username,
      email,
      password: hashedPassword,
    });

    // generate jwt Token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    sendToQueue({ recipientEmail: email, purpose: 'welcome', username, otp: undefined });
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
