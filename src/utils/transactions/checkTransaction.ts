import { storeTxnArgs, getTxnArgs } from '../../repositories/redis.txn';

export default async function isDuplicateTxn(key: string, hash: string) {
  const result = await getTxnArgs(key);
  if (result === hash) {
    return true;
  }
  storeTxnArgs(key, hash);
  return false;
}
