import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { configDotenv } from 'dotenv';
import { fundingParams } from '../../types/custom';

configDotenv();

// const data = {
//   email: 'okoliedave1@gmail.com',
//   amount: 10000,
//   reference: '7PVGX8MEk85tgeEpVDtD',
//   metadata: {},
// };

const config = {
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
};

const baseUrl = `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`;

const reference = uuid();

export const initPay = async (data: fundingParams) => {
  try {
    const response = await axios.post(baseUrl, { reference, ...data }, config);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    // console.error(error);
    return error;
  }
};
