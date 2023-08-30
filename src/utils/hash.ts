import crypto = require('crypto');
import { configDotenv } from 'dotenv';

configDotenv();

const key = process.env.HASH_SECRET as string;

export default function hashArguments(...parameters: any[]) {
  const concatenatedRequest = parameters.join('');
  const hash = crypto.createHmac('sha512', key);
  hash.update(concatenatedRequest);
  return hash.digest('hex');
}
