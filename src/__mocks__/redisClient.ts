import redis from 'redis-mock';
import { mockDeep } from 'jest-mock-extended';

const newClient = redis.createClient();
const client = mockDeep<typeof newClient>();

export default client;
