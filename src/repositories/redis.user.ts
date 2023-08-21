import redisClient from '../redisClient';

export const storeResetToken = (key: string, value: string) => {
  return redisClient.setEx(key, 600, value);
};

export const getResetToken = (key: string) => {
  return redisClient.get(key);
};

export const deleteResetToken = (key: string) => {
  return redisClient.del(key);
};
