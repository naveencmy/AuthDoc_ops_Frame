import IORedis from "ioredis"
import env from "./env.js"

const redis = new IORedis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null
})

export default redis