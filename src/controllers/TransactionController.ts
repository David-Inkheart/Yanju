import { transferMoneySchema } from '../utils/validators';
import transfer from '../utils/transferService';

interface TransferParams {
  amount: number;
  recipientId: number;
  senderId: number;
}

class TransactionController {
  static async transferMoney({ amount, recipientId, senderId }: TransferParams) {
    const { error } = transferMoneySchema.validate({ amount, recipientId, senderId });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (senderId === recipientId) {
      return {
        success: false,
        message: 'You cannot transfer money to yourself',
      };
    }

    const result = await transfer(senderId, recipientId, amount);

    return result;
  }
}

export default TransactionController;
