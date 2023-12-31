import joi from 'joi';

const registerSchema = joi.object({
  firstName: joi.string().min(3).max(20).alphanum().required(),
  lastName: joi.string().min(3).max(20).alphanum().required(),
  phoneNumber: joi.string().min(10).max(15).required(),
  email: joi.string().email().lowercase().required(),
  password: joi.string().min(8).required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

const idSchema = joi.number().integer().min(1).required();

const changePasswordSchema = joi.object({
  currentPassword: joi.string().min(8).required(),
  newPassword: joi.string().min(8).required().disallow(joi.ref('currentPassword')),
});

const forgotPasswordSchema = joi.object({
  email: joi.string().email().required(),
});

const resetPasswordSchema = joi.object({
  email: joi.string().email().required(),
  newPassword: joi.string().min(8).required(),
  code: joi.string().required().length(5),
});

const transferMoneySchema = joi.object({
  amount: joi.number().positive().required(),
  recipientId: idSchema,
  senderId: idSchema,
});

const fundSchema = joi.object({
  amount: joi.number().integer().min(100).required(),
  userId: idSchema,
});

const withdrawSchema = joi.object({
  accountNumber: joi.number().integer().min(10).required(),
  bankCode: joi.number().integer().min(3).required(),
  amount: joi.number().integer().min(10000).required(),
  narration: joi.string().required(),
  userId: idSchema,
});

const transactionHistorySchema = joi
  .object({
    limit: joi.number().integer().min(1),
    page: joi.number().integer().min(1),
    type: joi.string().valid('DEBIT', 'CREDIT'),
    sub_type: joi.string().valid('TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'BANK_CHARGE', 'POS_TRANSACTION'),
    from: joi.date().iso(),
    to: joi.date().iso(),
  })
  .with('limit', 'page')
  .with('startDate', 'endDate');

const verifyPaySchema = joi.object({
  reference: joi.string().uuid().required(),
});

const deleteRecipientSchema = joi.object({
  // RCP_2x5j67tnnw1t98k
  recipientCode: joi.string().min(19).max(20).required(),
});

const downloadSchema = joi.object({
  fileName: joi.string().min(5).max(100).required(),
});

export {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  idSchema,
  transferMoneySchema,
  transactionHistorySchema,
  fundSchema,
  verifyPaySchema,
  withdrawSchema,
  deleteRecipientSchema,
  downloadSchema,
};
