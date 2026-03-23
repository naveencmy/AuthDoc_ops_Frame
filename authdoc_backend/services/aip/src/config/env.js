import dotenv from "dotenv"

dotenv.config()

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "4000", 10),
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: parseInt(process.env.REDIS_PORT || "6379", 10),
  STORAGE_PATH: process.env.STORAGE_PATH || "./storage",
  OCR_SERVICE_URL: process.env.OCR_SERVICE_URL
}
export default env