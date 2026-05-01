import IORedis from "ioredis"

const redis = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,

  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,

  tls: process.env.REDIS_TLS === "true" ? {} : undefined,

  maxRetriesPerRequest: null,
  enableReadyCheck: false
})

redis.on("connect", () => {
  console.log("Redis connected")
})

redis.on("error", (err) => {
  console.error("Redis error:", err.message)
})

export default redis