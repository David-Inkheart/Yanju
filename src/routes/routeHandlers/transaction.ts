import { RequestHandler } from 'express';
import { UserId } from '../../types/custom';
import TransactionController from '../../controllers/TransactionController';

export const transferTransactionHandler: RequestHandler = async (req, res) => {
  try {
    const { amount } = req.body;
    const senderId = req.userId as UserId;
    const { recipientId } = req.params;

    const response = await TransactionController.transferMoney({ amount, recipientId: Number(recipientId), senderId });

    if (!response.success) {
      return res.status(400).json({
        success: response.success,
        message: response.message,
      });
    }

    return res.json({
      success: response.success,
      message: response.message,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getTransactionsHandler: RequestHandler = async (req, res) => {
  try {
    const userId = req.userId as UserId;
    const { limit, offset, type, sub_type, from, to } = req.query;

    const transactions = await TransactionController.getTransactionHistory({
      userId,
      limit: Number(limit),
      offset: Number(offset),
      type: type as 'DEBIT' | 'CREDIT',
      sub_type: sub_type as string,
      from: from ? (from as string) : undefined,
      to: to ? (to as string) : undefined,
    });

    if (!transactions.success) {
      return res.status(400).json({
        success: false,
        message: transactions.message,
      });
    }

    return res.json({
      success: true,
      message: transactions.message,
      data: transactions.data || [],
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
    });
  }
};
