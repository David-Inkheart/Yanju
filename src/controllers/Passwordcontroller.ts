import { findUser, updateUser } from '../repositories/db.user';
import { deleteResetToken, getResetToken, storeResetToken } from '../repositories/redis.user';
import { hashPassword, comparePasswords } from '../utils/passwordService';
import { UserId } from '../types/custom';
import { changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from '../utils/validators';
import { sendToQueue } from '../utils/rabbitMQ/producer';

class PasswordController {
  static async changePassword({ userId, currentPassword, newPassword }: { userId: UserId; currentPassword: string; newPassword: string }) {
    try {
      // validate the request body
      const { error } = changePasswordSchema.validate({ currentPassword, newPassword });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      const existingUser = await findUser({ id: userId });

      // compare old password with the one in the database
      const isPasswordValid = await comparePasswords(currentPassword, existingUser!.password);

      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Current password is incorrect',
        };
      }

      // hash the password
      const hashedPassword = await hashPassword(newPassword);

      // update the user's password
      await updateUser(userId, { password: hashedPassword });

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Could not change password',
      };
    }
  }

  static async resetPassword(email: string) {
    // validate the user input
    const { error } = forgotPasswordSchema.validate({ email });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // check if user already exists
    const existingUser = await findUser({ email });

    if (existingUser) {
      // generate a 5-digit code
      const passwordResetToken = Math.floor(10000 + Math.random() * 90000);

      // save the code to the Redis store with an expiration of 10 minutes
      const key = `password-reset-token-${existingUser.id}`;
      try {
        await storeResetToken(key, passwordResetToken.toString());
      } catch (err) {
        return {
          success: false,
          error: 'Could not cache the password reset token',
        };
      }

      try {
        sendToQueue({ recipientEmail: email, otp: passwordResetToken, purpose: 'password_reset', username: undefined });
      } catch (err) {
        return {
          success: false,
          error: 'Could not send the password reset code to your email address',
        };
      }
      console.log('Password reset code: ', passwordResetToken);
    }

    return {
      success: true,
      message: 'A 5-digit code has been sent to your email address to complete the password reset process',
    };
  }

  static async confirmResetPassword(email: string, code: string, newPassword: string) {
    // validate the user input
    const { error } = resetPasswordSchema.validate({ email, code, newPassword });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    // check if user already exists
    const existingUser = await findUser({ email });

    if (!existingUser) {
      return {
        success: false,
        error: 'User does not exist',
      };
    }

    // check if the newPassword is the same as the current password
    const isPasswordValid = await comparePasswords(newPassword, existingUser.password);

    if (isPasswordValid) {
      return {
        success: false,
        error: 'New password cannot be the same as the current password',
      };
    }
    // check if the code is valid
    const key = `password-reset-token-${existingUser.id}`;
    const cachedCode = await getResetToken(key);

    if (!cachedCode) {
      return {
        success: false,
        error: 'The code is invalid or has expired',
      };
    }

    if (cachedCode !== code) {
      return {
        success: false,
        error: 'The code is invalid or has expired',
      };
    }

    // hash the password
    const hashedPassword = await hashPassword(newPassword);

    // update the user's password
    await updateUser(existingUser.id, { password: hashedPassword });

    // delete the code from the Redis store
    await deleteResetToken(key);

    return {
      success: true,
      message: 'Password reset successful',
    };
  }
}

export default PasswordController;
