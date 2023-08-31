import { RequestHandler } from 'express';
import hashedAuth from '../../services/paystack/authHash';

export const webhookHandler: RequestHandler = async (req, res) => {
  const hash = hashedAuth(req.body);
  if (hash === req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    const event = req.body;
    // Do something with event
    console.log(event);
  }
  res.sendStatus(200);
};
