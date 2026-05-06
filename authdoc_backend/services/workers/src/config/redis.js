import "dotenv/config"
import IORedis from "ioredis"

const redis = new IORedis({
  host: process.env.REDIS_HOST,
  port: 6379,

  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,

  tls:
    process.env.REDIS_TLS === "true"
      ? {}
      : undefined,

  connectTimeout: 20000,

  maxRetriesPerRequest: null,

  enableReadyCheck: false,

  retryStrategy(times) {
    const delay = Math.min(times * 500, 5000)

    console.log(`[Redis] retry ${times}`)

    return delay
  }
})

redis.on("connect", () => {
  console.log("Redis connected")
})

redis.on("ready", () => {
  console.log("Redis ready")
})

redis.on("close", () => {
  console.warn("Redis connection closed")
})

redis.on("error", err => {
  console.error("[Redis] error:", err.message)
})

export default redis