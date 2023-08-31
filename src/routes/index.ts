// main router for the app
import express from 'express';

import authMiddleware from '../middleWares/authMiddleware';
import { changePasswordHandler, confirmResetPasswordHandler, loginHandler, registerHandler, resetPasswordHandler } from './routeHandlers/auth';
import { getHomeHandler } from './routeHandlers/home';
import { fundAccountHandler, getTransactionsHandler, transferTransactionHandler } from './routeHandlers/transaction';
import { webhookHandler } from './routeHandlers/paystackWebhook';

// instatiate router
const router = express.Router();

router.get('/', getHomeHandler);
router.post('/auth/register', registerHandler);
router.post('/auth/login', loginHandler);
router.post('/auth/reset-password', resetPasswordHandler);
router.post('/auth/reset-password/confirm', confirmResetPasswordHandler);

router.post('/paystack-webhook', webhookHandler);

// use auth middleware to protect the routes below
router.use(authMiddleware);
router.post('/auth/change-password', changePasswordHandler);
router.post('/transfer/:recipientId', transferTransactionHandler);
router.get('/transactions', getTransactionsHandler);
router.post('/fund', fundAccountHandler);

export default router;
