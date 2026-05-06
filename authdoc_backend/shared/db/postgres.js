import "dotenv/config"
import pg from "pg"

const { Pool } = pg

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL missing")
}

const pool = new Pool({
  connectionString: DATABASE_URL,

  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
})

pool.on("connect", () => {
  console.log("DB connected")
})

pool.on("error", err => {
  console.error("[POSTGRES ERROR]:", err.message)
})

export default pool