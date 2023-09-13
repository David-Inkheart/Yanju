import { RequestHandler } from 'express';
import hashedAuth from '../../services/paystack/authHash';
import fundAccount from '../../utils/transactions/fundAccService';
import { withdrawfromAccount } from '../../utils/transactions/withdrawalService';
import { sendSlackNotif } from '../../services/slack/slackNotifs';

export const webhookHandler: RequestHandler = async (req, res) => {
  const hash = hashedAuth(req.body);
  if (hash === req.headers['x-paystack-signature']) {
    // get event from request body
    const event = req.body;
    // do something with event
    try {
      let response;
      if (event.event === 'charge.success') {
        response = await fundAccount(event);
      }
      if (event.event === 'transfer.success') {
        response = await withdrawfromAccount(event);
      }
      if (event.event === 'transfer.failed') {
        response = 'transfer failed, please try again';
      }
      sendSlackNotif(response);
    } catch (error) {
      sendSlackNotif(error);
    }
  }
  res.sendStatus(200);
};
