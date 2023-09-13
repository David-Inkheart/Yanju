import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { configDotenv } from 'dotenv';
import { fundingParams } from '../../types/custom';
import { sendSlackNotif } from '../slack/slackNotifs';

configDotenv();

const config = {
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
};

const baseUrl = `${process.env.PAYSTACK_BASE_URL}`;

const paystackClient = axios.create({ baseURL: baseUrl, headers: config.headers });

paystackClient.interceptors.response.use(
  (response) => {
    return response.data;
  },

  (error) => {
    sendSlackNotif(error.response.data);
    if (error.response.status >= 400 && error.response.status <= 499) {
      sendSlackNotif(error.response);
      return {
        success: false,
        message: 'Bad request: you probably sent an invalid request',
      };
    }
    throw new Error('Internal server error');
  },
);

export const initPay = async (data: fundingParams) => {
  const reference = uuid();
  return paystackClient.post('/transaction/initialize', { reference, ...data });
};

export const verifyPay = async (reference: string) => paystackClient.get(`/transaction/verify/${reference}`);

export const listBanks = async () => paystackClient.get('/bank');

export const createTransferRecipient = async ({ name, bankCode, accountNumber }: { bankCode: string; name: string; accountNumber: string }) => {
  const data = {
    type: 'nuban',
    name,
    account_number: accountNumber,
    bank_code: bankCode,
    currency: 'NGN',
  };
  return paystackClient.post('/transferrecipient', data);
};

export const deleteTransferRecipient = async (recipientCode: string) => paystackClient.delete(`/transferrecipient/${recipientCode}`);

export const transferInit = async ({
  amount,
  recipient,
  reference,
  reason,
}: {
  amount: number;
  recipient: string;
  reference: string;
  reason: string;
}) => {
  const data = {
    source: 'balance',
    amount,
    recipient,
    reason,
    reference,
  };
  return paystackClient.post('/transfer', data);
};

// export const transferFinalize = async (transferCode: string) => paystackClient.post('/transfer/finalize_transfer', transferCode);

export const transferStatus = async (transferCode: string) => paystackClient.get(`/transfer/${transferCode}`);

export const resolveAccount = async (accountNumber: string, bankCode: string) =>
  paystackClient.get(`/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`);
