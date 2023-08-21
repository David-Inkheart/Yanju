import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import router from './routes/index';
import { jwtErrorHandler } from './middleWares/error-handlers';

const app = express();

const Port = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// ... REST API routes will go here
app.use('/', router);

// Not found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
  });
});

// Error Handling to catch any unhandled error during req processing
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'JsonWebTokenError') {
    return jwtErrorHandler(err, req, res, next);
  }
  if (err.name === 'TokenExpiredError') {
    return jwtErrorHandler(err, req, res, next);
  }
  return res.status(500).json({
    success: false,
    message: 'There was a problem processing your request, please try again later',
  });
});

app.listen(Port, () => {
  // eslint-disable-next-line no-console
  console.log(`REST API server is running on http://localhost:${Port}`);
});

export default app;
