import { Redis } from "ioredis";
import { promisify } from "util";

const redisClient: Redis = new Redis();

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

const redisGet = promisify(redisClient.get).bind(redisClient);
const redisSet = promisify(redisClient.set).bind(redisClient);
const redisExpire = promisify(redisClient.expire).bind(redisClient);
const redisIncrement = promisify(redisClient.incr).bind(redisClient);
const redisDecrement = promisify(redisClient.decr).bind(redisClient);

export {
  redisClient,
  redisGet,
  redisSet,
  redisExpire,
  redisIncrement,
  redisDecrement,
};
