import { debitAccount, findAccount, getSubType } from '../../repositories/db.account';
import { findTransaction, recordTransaction } from '../../repositories/db.transaction';
import prisma from '../db.server';
import { getTransferDetails } from '../../repositories/db.user';

export async function withdrawfromAccount(event: any) {
  const { amount, reference, status, reason } = event.data;
  if (status !== 'success') throw new Error('withdrawal not successful');

  const transaction = await findTransaction({ reference });

  if (!transaction) {
    // check if transfer attempt with reference exists in db
    const savedTransferDetails = await getTransferDetails({ reference });

    const userAccount = await findAccount({ id: savedTransferDetails?.sender_acc_id });

    const userBalance = Number(userAccount!.balance);

    const subType = await getSubType('WITHDRAWAL');

    if (!subType) throw new Error('Could not find subtype');

    await prisma.$transaction(async (tx) => {
      const { balance: UserUpdatedBalance } = await debitAccount({ amount, accountId: userAccount!.id, txn: tx });

      await recordTransaction(
        {
          amount,
          balanceAfter: Number(UserUpdatedBalance),
          balanceBefore: userBalance,
          type: 'DEBIT',
          reference,
          subTypeId: subType!.id,
          accountId: userAccount!.id,
          metadata: { reason },
        },
        tx,
      );
    });
  }
  return {
    success: true,
    message: 'withdrawal successful',
  };
}

export async function debitUserAccount({
  amount,
  accountId,
  accountBalance,
  reference,
  reason,
}: {
  amount: number;
  accountId: number;
  accountBalance: number;
  reference: string;
  reason: string;
}) {
  const subType = await getSubType('WITHDRAWAL');

  if (!subType) throw new Error('Could not find subtype');

  await prisma.$transaction(async (tx) => {
    const { balance: AccountUpdatedBalance } = await debitAccount({ amount, accountId, txn: tx });

    await recordTransaction(
      {
        amount,
        balanceAfter: Number(AccountUpdatedBalance),
        balanceBefore: accountBalance,
        type: 'DEBIT',
        reference,
        subTypeId: subType!.id,
        accountId,
        metadata: { reason },
      },
      tx,
    );
  });
  return {
    success: true,
    message: 'withdrawal successful',
  };
}
