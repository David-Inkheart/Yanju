import { RequestHandler } from 'express';
import { UserId } from '../../types/custom';
import TransactionController from '../../controllers/TransactionController';

export const transferTransactionHandler: RequestHandler = async (req, res) => {
  try {
    const { amount } = req.body;
    const recipientId = Number(req.params.id);
    const senderId = req.userId as UserId;

    const response = await TransactionController.transferMoney({ amount, recipientId, senderId });

    if (!response.success) {
      return res.status(400).json({
        success: response.success,
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
