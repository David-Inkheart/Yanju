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

export { loginSchema, registerSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema, idSchema, transferMoneySchema };
