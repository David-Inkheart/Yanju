import { recordTransaction } from '../repositories/db.account';

interface recordParams {
  account: any;
  amount: number;
  transactionType: 'DEBIT' | 'CREDIT';
  newBalance: number;
  reference: string;
}

async function record({ account, amount, transactionType, newBalance, reference }: recordParams) {
  await recordTransaction({
    amount,
    type: transactionType,
    bal_before: account.balance,
    reference,
    bal_after: newBalance,
    account: {
      connect: {
        id: account.id,
      },
    },
    subType: {
      create: {
        name: 'TRANSFER',
      },
    },
  });
}

export default record;

// await record(senderAccount, amount, 'DEBIT');
// await record(recipientAccount, amount, 'CREDIT');
