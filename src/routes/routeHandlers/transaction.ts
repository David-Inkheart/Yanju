import { RequestHandler } from 'express';
import { UserId } from '../../types/custom';
import TransactionController from '../../controllers/TransactionController';
import paginate from '../../utils/pagination';
import { verifyPay } from '../../services/paystack/paystack';
import { verifyPaySchema } from '../../utils/validators';

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

    const Page = Number(page);
    const Limit = Number(limit);

    const response = await TransactionController.getTransactionHistory({
      userId,
      limit: Limit,
      page: Page,
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
      page: Page,
      limit: Limit,
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
    });
  }
};

export const fundAccountHandler: RequestHandler = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.userId as UserId;

    const response = await TransactionController.fundAccountInit(userId, amount);

    if (!response.status) {
      return res.status(400).json({
        success: response.status,
        message: response.message,
      });
    }

    return res.json({
      success: response.status,
      message: response.message,
      data: response.data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const verifyTransHandler: RequestHandler = async (req, res) => {
  try {
    const { reference } = req.query;
    const { error } = verifyPaySchema.validate({ reference });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const response = await verifyPay(reference as string);

    if (!response.status) {
      return res.status(400).json({
        success: response.status,
        message: response.message,
      });
    }

    return res.json({
      success: response.status,
      message: response.message,
      data: response.data,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      // error: err.message,
    });
  }
};

export const withdrawalHandler: RequestHandler = async (req, res) => {
  try {
    const { amount, narration } = req.body;
    const userId = req.userId as UserId;

    const response = await TransactionController.withdrawalInit(userId, amount, narration);

    if (!response.status) {
      return res.status(400).json({
        success: response.status,
        message: response.message,
      });
    }

    return res.json({
      success: response.status,
      message: response.message,
      data: response.data,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'internal server error',
      error: err.message,
    });
  }
};
