import { debitAccount, findAccountbyUserId, getSubType } from '../../repositories/db.account';
import { findUserByNames } from '../../repositories/db.user';
import { recordTransaction } from '../../repositories/db.transaction';
import { transferStatus } from '../../services/paystack/paystack';
import prisma from '../db.server';

async function withdrawfromAccount(event: any) {
  const { amount, reference, status, reason, transfer_code } = event.data;
  if (status !== 'success') throw new Error('withdrawal not successful');

  const transferDetails = await transferStatus(transfer_code);
  // console.log('transferdetails: ', transferDetails);

  const firstName = transferDetails.data.recipient.name.split(' ')[0];
  const lastName = transferDetails.data.recipient.name.split(' ')[1];
  // console.log('firstname: ', firstName, 'lastname: ', lastName);

  const user = await findUserByNames({ firstName, lastName });

  const userAccount = await findAccountbyUserId(user!.id);

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
export default withdrawfromAccount;
