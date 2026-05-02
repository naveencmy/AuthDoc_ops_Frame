import IORedis from "ioredis"

const redis = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),

  username: process.env.REDIS_USERNAME || "default",
  password: process.env.REDIS_PASSWORD,

  tls: process.env.REDIS_TLS === "true" ? {} : undefined,

  // 🔥 CRITICAL FIXES
  connectTimeout: 10000,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,

  retryStrategy(times) {
    const delay = Math.min(times * 200, 5000)
    console.log(`[Redis] retry attempt ${times}, delay=${delay}`)
    return delay
  },

  reconnectOnError(err) {
    console.error("[Redis] reconnectOnError:", err.message)
    return true
  }
})

redis.on("connect", () => {
  console.log(" Redis connected")
})

redis.on("ready", () => {
  console.log("Redis ready")
})

redis.on("error", err => {
  console.error("Redis error:", err.message)
})

redis.on("close", () => {
  console.warn("Redis connection closed")
})

export default redis