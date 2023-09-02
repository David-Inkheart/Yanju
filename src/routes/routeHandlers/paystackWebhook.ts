import { RequestHandler } from 'express';
import hashedAuth from '../../services/paystack/authHash';
import fundAccount from '../../utils/transactions/fundAccService';
import { withdrawfromAccount } from '../../utils/transactions/withdrawalService';

export const webhookHandler: RequestHandler = async (req, res) => {
  const hash = hashedAuth(req.body);
  if (hash === req.headers['x-paystack-signature']) {
    // get event from request body
    const event = req.body;
    // do something with event
    // console.log(event);
    try {
      let response;
      if (event.event === 'charge.success') {
        response = await fundAccount(event);
      }
      if (event.event === 'transfer.success') {
        response = await withdrawfromAccount(event);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  res.sendStatus(200);
};
