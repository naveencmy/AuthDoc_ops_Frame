import "dotenv/config"
import IORedis from "ioredis"

const redis = new IORedis({
  host: process.env.REDIS_HOST,

  port: Number(process.env.REDIS_PORT || 6379),

  username: process.env.REDIS_USERNAME,

  password: process.env.REDIS_PASSWORD,

  tls: {},

  lazyConnect: false,

  maxRetriesPerRequest: null,

  enableReadyCheck: false,

  connectTimeout: 20000,

  retryStrategy(times) {
    return Math.min(times * 500, 5000)
  }
})

redis.on("connect", () => {
  console.log("Redis connected")
})

redis.on("ready", () => {
  console.log("Redis ready")
})

redis.on("error", err => {
  console.error("[Redis Error]", err.message)
})

redis.on("close", () => {
  console.warn("Redis connection closed")
})

export default redis