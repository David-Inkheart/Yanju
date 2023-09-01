import { creditAccount, findAccountbyUserId, getSubType } from '../../repositories/db.account';
import { recordTransaction } from '../../repositories/db.transaction';
import { findUser } from '../../repositories/db.user';
import prisma from '../db.server';

async function fundAccount(event: any) {
  const { email } = event.data.customer;
  const { amount, reference, status, metadata } = event.data;
  if (status !== 'success') throw new Error('Transaction not successful');

  const user = await findUser({ email });

  const userAccount = await findAccountbyUserId(user!.id);

  if (!userAccount) {
    return {
      success: false,
      message: 'Account not found',
    };
  }

  const userBalance = Number(userAccount[0].balance);

  const subType = await getSubType('DEPOSIT');

  if (!subType) throw new Error('Could not find subtype');

  await prisma.$transaction(async (tx) => {
    const { balance: UserUpdatedBalance } = await creditAccount({ amount, accountId: userAccount[0].id, txn: tx });

    await recordTransaction(
      {
        amount,
        balanceAfter: Number(UserUpdatedBalance),
        balanceBefore: userBalance,
        type: 'CREDIT',
        reference,
        subTypeId: subType!.id,
        accountId: userAccount[0].id,
        metadata,
      },
      tx,
    );
  });
  return {
    success: true,
    message: 'Account funded successfully',
  };
}
export default fundAccount;
