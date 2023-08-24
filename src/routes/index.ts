// main router for the app
import express from 'express';

import authMiddleware from '../middleWares/authMiddleware';
import { changePasswordHandler, confirmResetPasswordHandler, loginHandler, registerHandler, resetPasswordHandler } from './routeHandlers/auth';
import { getHomeHandler } from './routeHandlers/home';
import { transferTransactionHandler } from './routeHandlers/transaction';

// instatiate router
const router = express.Router();

// get home page
router.get('/', getHomeHandler);
// POST: User signup
router.post('/auth/register', registerHandler);
// POST: User login
router.post('/auth/login', loginHandler);
// POST: Password reset request
router.post('/auth/reset-password', resetPasswordHandler);
// POST: Password reset confirmation
router.post('/auth/reset-password/confirm', confirmResetPasswordHandler);

// use auth middleware to protect the routes below
router.use(authMiddleware);
// POST: auth user change password
router.post('/auth/change-password', changePasswordHandler);
// POST: auth user transfer money
router.post('/transfer', transferTransactionHandler);

export default router;
