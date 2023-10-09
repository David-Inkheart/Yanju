// main router for the app
import express from 'express';
// import busboy from 'connect-busboy';

// import multer from 'multer';
import authMiddleware from '../middleWares/authMiddleware';
import { changePasswordHandler, confirmResetPasswordHandler, loginHandler, registerHandler, resetPasswordHandler } from './routeHandlers/auth';
import { getHomeHandler } from './routeHandlers/home';
import { webhookHandler } from './routeHandlers/paystackWebhook';
import {
  deleteRecipientHandler,
  fundAccountHandler,
  getTransactionsHandler,
  listBanksHandler,
  transferTransactionHandler,
  verifyTransHandler,
  withdrawalHandler,
} from './routeHandlers/transaction';
import uploadFileHandler from './routeHandlers/upload';

// const storage = multer.memoryStorage(); // Store files in memory as buffers

// // Create a multer instance with the defined storage
// const upload = multer({ storage });

const router = express.Router();

router.get('/', getHomeHandler);
router.post('/auth/register', registerHandler);
router.post('/auth/login', loginHandler);
router.post('/auth/reset-password', resetPasswordHandler);
router.post('/auth/reset-password/confirm', confirmResetPasswordHandler);

router.post('/paystack-webhook', webhookHandler);
router.get('/verify-transaction', verifyTransHandler);
router.delete('/delete-recipient', deleteRecipientHandler);
router.get('/banks', listBanksHandler);

// use auth middleware to protect the routes below
router.use(authMiddleware);
router.post('/auth/change-password', changePasswordHandler);
router.post('/transfer/:recipientId', transferTransactionHandler);
router.get('/transactions', getTransactionsHandler);
router.post('/fund', fundAccountHandler);
router.post('/withdraw', withdrawalHandler);

// router.use(busboy({ immediate: true }));
router.post('/upload-file', uploadFileHandler);

export default router;
