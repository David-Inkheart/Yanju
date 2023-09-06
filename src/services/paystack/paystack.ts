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

export const initPay = async (data: fundingParams) => {
  const reference = uuid();
  const response = await axios.post(`${baseUrl}/transaction/initialize`, { reference, ...data }, config);
  return response.data;
};

export const verifyPay = async (reference: string) => {
  const response = await axios.get(`${baseUrl}/transaction/verify/${reference}`, config);
  return response.data;
};

export const listBanks = async () => {
  const response = await axios.get(`${baseUrl}/bank`, config);
  return response.data;
};

export const createTransferRecipient = async ({ name, bankCode, accountNumber }: { bankCode: string; name: string; accountNumber: string }) => {
  const data = {
    type: 'nuban',
    name,
    account_number: accountNumber,
    bank_code: bankCode,
    currency: 'NGN',
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
  const response = await axios.post(`${baseUrl}/transfer`, data, config);
  return response.data;
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
