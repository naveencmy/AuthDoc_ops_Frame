import IORedis from "ioredis"

const redis = new IORedis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false
})
redis.on("connect", () => {
  console.log("Redis connected")
})
redis.on("ready", () => {
  console.log(" Redis ready")
})
redis.on("error", (err) => {
  console.error(" Redis error:", err.message)
})
export default redis