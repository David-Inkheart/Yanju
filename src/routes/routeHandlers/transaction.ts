import { RequestHandler } from 'express';
import { UserId } from '../../types/custom';
import TransactionController from '../../controllers/TransactionController';
import paginate from '../../utils/pagination';

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
    const { limit = 10, page = 1, type, sub_type, from, to } = req.query;

    const response = await TransactionController.getTransactionHistory({
      userId,
      limit: limit as unknown as number,
      page: page as unknown as number,
      type: type as 'DEBIT' | 'CREDIT',
      sub_type: sub_type as string,
      from: from as string,
      to: to as string,
    });

    if (!response.success) {
      return res.status(400).json({
        success: false,
        message: response.message,
      });
    }

    const paginatedTransactions = paginate({
      records: response.data?.transactions || [],
      totalItems: response.data?.totalRecords || 0,
      page: Number(page),
      limit: Number(limit),
    });

    return res.json({
      success: true,
      message: response.message,
      data: paginatedTransactions,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
    });
  }
};
