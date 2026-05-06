import "dotenv/config"
import pg from "pg"

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false
  },

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000
})

pool.on("connect", () => {
  console.log("DB connected")
})

pool.on("error", err => {
  console.error("[Postgres] Pool error:", err.message)
})

export default pool