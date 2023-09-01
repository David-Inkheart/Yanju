import { RequestHandler } from 'express';
import hashedAuth from '../../services/paystack/authHash';
import fundAccService from '../../utils/transactions/fundAccService';

export const webhookHandler: RequestHandler = async (req, res) => {
  const hash = hashedAuth(req.body);
  if (hash === req.headers['x-paystack-signature']) {
    // get event from request body
    const event = req.body;
    // do something with event
    // console.log(event);
    try {
      const response = await fundAccService(event);
      console.log(event);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  res.sendStatus(200);
};
