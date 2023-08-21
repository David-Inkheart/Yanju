// custom error handler that returns a JSON response

// usage: throw new BadRequestError();
// should be used in proper Json response format
// example:
// throw new BadRequestError('Invalid email or password');
// throw new BadRequestError('Invalid email or password', { email: 'Email is required' });
// throw new BadRequestError({ email: 'Email is required' });

import { Request, Response, NextFunction } from 'express';

class CustomError extends Error {
  statusCode: number;

  data: any;

  constructor(message: string, statusCode: number, data: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

// jwt error handler
const jwtErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed: Invalid token',
    });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed: Token expired',
    });
  }
  return next(err);
};

// how to use the error handler
// import { errorHandler } from './utils/error-handlers';
// app.use(errorHandler);
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message, data } = err;
  res.status(statusCode).json({
    success: false,
    message,
    data,
  });
  return next();
};

export { CustomError, errorHandler, jwtErrorHandler };
