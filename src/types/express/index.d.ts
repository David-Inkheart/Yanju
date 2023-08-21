import { UserId } from '../custom';

export {};

declare global {
  namespace Express {
    export interface Request {
      userId?: UserId;
    }
  }
}
