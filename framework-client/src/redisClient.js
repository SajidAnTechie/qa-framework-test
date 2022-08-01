const redis = require('redis');

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';

const redisClient = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

redisClient.on('connect', () => {
  console.log(`Redis Client connected to ${REDIS_HOST}:${REDIS_PORT}`);
});

redisClient.on('error', (error) => {
  console.log(error);
});

redisClient.connect();

module.exports = redisClient;
