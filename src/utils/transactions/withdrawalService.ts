import { debitAccount, findAccountbyUserId, getSubType } from '../../repositories/db.account';
import { findTransaction, recordTransaction } from '../../repositories/db.transaction';
import prisma from '../db.server';
import { transferStatus } from '../../services/paystack/paystack';

export async function withdrawfromAccount(event: any) {
  const { amount, reference, status, reason, transfer_code } = event.data;
  if (status !== 'success') throw new Error('withdrawal not successful');

  // check if reference exists in db
  const transaction = await findTransaction({ reference });

  if (!transaction) {
    // if it doesn't exits, use transfer code to confirm transfer and get details
    const transferDetails = await transferStatus(transfer_code);

    // get senderId from metadata (appended to transfer recipient when created)
    const userId = transferDetails.recipient.metadata.senderId;
    console.log('senderId: ', userId);

    const userAccount = await findAccountbyUserId(userId);

    if (!userAccount) throw new Error('Account not found');

    const userBalance = Number(userAccount[0].balance);

    const subType = await getSubType('WITHDRAWAL');

    if (!subType) throw new Error('Could not find subtype');

    await prisma.$transaction(async (tx) => {
      const { balance: UserUpdatedBalance } = await debitAccount({ amount, accountId: userAccount[0].id, txn: tx });

      await recordTransaction(
        {
          amount,
          balanceAfter: Number(UserUpdatedBalance),
          balanceBefore: userBalance,
          type: 'DEBIT',
          reference,
          subTypeId: subType!.id,
          accountId: userAccount[0].id,
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

export async function debitUserAccount({ amount, userId, reference, reason }: { amount: number; userId: number; reference: string; reason: string }) {
  const userAccount = await findAccountbyUserId(userId);

  if (!userAccount) {
    return {
      success: false,
      message: 'Account not found',
    };
  }

  const userBalance = Number(userAccount[0].balance);

  const subType = await getSubType('WITHDRAWAL');

  if (!subType) throw new Error('Could not find subtype');

  await prisma.$transaction(async (tx) => {
    const { balance: UserUpdatedBalance } = await debitAccount({ amount, accountId: userAccount[0].id, txn: tx });

    await recordTransaction(
      {
        amount,
        balanceAfter: Number(UserUpdatedBalance),
        balanceBefore: userBalance,
        type: 'DEBIT',
        reference,
        subTypeId: subType!.id,
        accountId: userAccount[0].id,
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
