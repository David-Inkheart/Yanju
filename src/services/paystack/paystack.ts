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
