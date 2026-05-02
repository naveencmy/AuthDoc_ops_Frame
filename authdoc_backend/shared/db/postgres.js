import pkg from "pg"
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
})

pool.on("connect", () => {
  console.log("DB connected")
})

pool.on("error", err => {
  console.error("DB error", err.message)
})

export default pool