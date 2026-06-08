const Redis = require("ioredis");
const {RateLimiterRedis} = require("rate-limiter-flexible");



const redisClient = new Redis({
  host : process.env.REDIS_HOST,
  port : process.env.REDIS_PORT,
  enableOfflineQueue : false,
});

redisClient.on("connect", ()=>{
  console.log("Redis is connected")
});

redisClient.on("error", (err)=>{
  console.log("Redis error: ",err);
});

const authLimiter = new RateLimiterRedis({
  storeClient : redisClient,
  prefix : "auth",
  points : 10,
  duration : 60,
});

const transactionLimiter = new RateLimiterRedis({
  storeClient : redisClient,
  prefix  : "transaction",
  points : 20,
  duration : 60
});

module.exports = {authLimiter , transactionLimiter};