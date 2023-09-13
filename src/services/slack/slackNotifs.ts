import axios from 'axios';
import { configDotenv } from 'dotenv';

configDotenv();

const url = `${process.env.SLACK_WEBHOOK_URL}`;

// const slackClient = axios.create({ baseURL, headers: config.headers });

export const sendSlackNotif = async (data: any) => {
  const postData = { text: JSON.stringify(data) };
  return axios.post(url, postData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
