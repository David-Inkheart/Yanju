import { creditAccount, findAccount, getSubType } from '../../repositories/db.account';
import { findTransaction, recordTransaction } from '../../repositories/db.transaction';
import { getTransferDetails } from '../../repositories/db.user';
import { sendSlackNotif } from '../../services/slack/slackNotifs';
import prisma from '../db.server';

interface TransferEvent {
  data: {
    amount: number;
    reference: string;
    status: string;
    recipient: {
      recipient_code: string;
      details: {
        account_number: string;
        account_name: string;
        bank_code: string;
        bank_name: string;
      };
    };
  };
}

export async function reverseTransferDebit(event: TransferEvent) {
  try {
    const { amount, reference, status, recipient } = event.data;
    if (status !== 'failed') throw new Error('transfer did not fail');

    const transaction = await findTransaction({ reference });
    // This means the account was debited even if the transfer failed
    if (transaction) {
      // check if transfer attempt with reference exists in db
      const savedTransferDetails = await getTransferDetails({ reference });

      const userAccount = await findAccount({ id: savedTransferDetails!.sender_acc_id });
      if (!userAccount) throw new Error('Could not find user account');

      const userBalance = Number(userAccount.balance);

      const subType = await getSubType('REVERSAL');
      if (!subType) throw new Error('Could not find subtype');

      const newReference = `${reference}-reversal`;

      await prisma.$transaction(async (tx) => {
        const { balance: UserUpdatedBalance } = await creditAccount({
          amount,
          accountId: userAccount.id,
          txn: tx,
        });

        await recordTransaction(
          {
            amount,
            balanceAfter: Number(UserUpdatedBalance),
            balanceBefore: userBalance,
            type: 'CREDIT',
            reference: newReference,
            subTypeId: subType.id,
            accountId: userAccount.id,
            metadata: { reason: `Transfer reversal from ${recipient.details.account_name}` },
          },
          tx,
        );
      });
    }
  } catch (error: any) {
    await sendSlackNotif(error);
  }
  return {
    success: true,
    message: 'transfer reversal successful',
  };
}
