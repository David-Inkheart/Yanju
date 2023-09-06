import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { configDotenv } from 'dotenv';
import { fundingParams } from '../../types/custom';

configDotenv();

const config = {
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
};

const baseUrl = `${process.env.PAYSTACK_BASE_URL}`;

const PaystackClient = axios.create({ baseURL: baseUrl, headers: config.headers });

PaystackClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // TODO: send internal notification
    if (error.response.status >= 400 && error.response.status <= 499) {
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
  return PaystackClient.post('/transaction/initialize', { reference, ...data });
};

export const verifyPay = async (reference: string) => {
  const response = await axios.get(`${baseUrl}/transaction/verify/${reference}`, config);
  return response.data;
};

export const listBanks = async () => {
  const response = await axios.get(`${baseUrl}/bank`, config);
  return response.data;
};

export const createTransferRecipient = async ({
  name,
  bankCode,
  accountNumber,
  senderId,
}: {
  bankCode: string;
  name: string;
  accountNumber: string;
  senderId: number;
}) => {
  const data = {
    type: 'nuban',
    name,
    account_number: accountNumber,
    bank_code: bankCode,
    currency: 'NGN',
    metadata: {
      senderId,
    },
  };
  const response = await axios.post(`${baseUrl}/transferrecipient`, data, config);
  return response.data;
};

export const deleteTransferRecipient = async (recipientCode: string) => {
  const response = await axios.delete(`${baseUrl}/transferrecipient/${recipientCode}`, config);
  return response.data;
};

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
  return PaystackClient.post(`/transfer`, data);
};

export const transferFinalize = async (transferCode: string) => {
  const data = {
    transferCode,
  };
  const response = await axios.post(`${baseUrl}/transfer/finalize_transfer`, data, config);
  return response.data;
};

export const transferStatus = async (transferCode: string) => {
  const response = await axios.get(`${baseUrl}/transfer/${transferCode}`, config);
  return response.data;
};

export const resolveAccount = async (accountNumber: string, bankCode: string) => {
  const response = await axios.get(`${baseUrl}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, config);
  return response.data;
};
