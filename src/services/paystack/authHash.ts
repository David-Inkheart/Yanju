import crypto = require('crypto');
import { configDotenv } from 'dotenv';

configDotenv();

const secret = process.env.PAYSTACK_SECRET_KEY as string;

export default function hashedAuth(param: any) {
  const stringParam = JSON.stringify(param);
  const hash = crypto.createHmac('sha512', secret);
  hash.update(stringParam);
  return hash.digest('hex');
}
