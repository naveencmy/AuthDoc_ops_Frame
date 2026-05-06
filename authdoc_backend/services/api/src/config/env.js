import dotenv from "dotenv"
dotenv.config()

function required(name) {
  if (!process.env[name]) {
    throw new Error(`Missing required env: ${name}`)
  }
  return process.env[name]
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "4000", 10),

  DATABASE_URL: required("DATABASE_URL"),
  OCR_SERVICE_URL: required("OCR_SERVICE_URL"),

  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: parseInt(process.env.REDIS_PORT || "6379", 10),

  STORAGE_PATH: process.env.STORAGE_PATH || "./storage"
}

export default env
