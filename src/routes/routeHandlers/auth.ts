import { RequestHandler } from 'express';

import { UserId } from '../../types/custom';
import AuthController from '../../controllers/Authcontroller';
import PasswordController from '../../controllers/Passwordcontroller';

export const loginHandler: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await AuthController.login({ email, password });

    if (!response.success) {
      if (response.error?.includes('mismatch')) {
        return res.status(401).json({
          success: false,
          error: response.error,
        });
      }
      return res.status(400).json({
        success: false,
        error: response.error,
      });
    }

    return res.json({
      success: response.success,
      message: 'Login successful',
      data: { token: response.token },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const registerHandler: RequestHandler = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password } = req.body;

    const response = await AuthController.register({ firstName, lastName, phoneNumber, email, password });

    if (!response.success) {
      if (response.error?.includes('already exists')) {
        return res.status(409).json({
          success: false,
          error: response.error,
        });
      }
      return res.status(400).json({
        success: false,
        error: response.error,
      });
    }

    return res.json({
      success: response.success,
      message: 'User registered successfully',
      data: { token: response.token },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const changePasswordHandler: RequestHandler = async (req, res) => {
  try {
    const userId = req.userId as UserId;
    const { currentPassword, newPassword } = req.body;

    const response = await PasswordController.changePassword({
      userId,
      currentPassword,
      newPassword,
    });

    if (!response.success) {
      if (response.error?.includes('incorrect')) {
        return res.status(401).json({
          success: false,
          error: response.error,
        });
      }
      return res.status(400).json({
        success: false,
        error: response.error,
      });
    }

    return res.json({
      success: response.success,
      message: response.message,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const resetPasswordHandler: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    const response = await PasswordController.resetPassword(email);

    if (!response.success) {
      if (response.error?.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: response.error,
        });
      }
      return res.status(400).json({
        success: false,
        error: response.error,
      });
    }

    return res.json({
      success: response.success,
      message: response.message,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const confirmResetPasswordHandler: RequestHandler = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const response = await PasswordController.confirmResetPassword(email, code, newPassword);

    if (!response.success) {
      if (response.error?.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: response.error,
        });
      }
      return res.status(400).json({
        success: false,
        error: response.error,
      });
    }

    return res.json({
      success: response.success,
      message: response.message,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
