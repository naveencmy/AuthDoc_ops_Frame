import pkg from "pg"

const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 50,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})
pool.on("connect", () => {
  console.log("PostgreSQL connected")
})

pool.on("error", (err) => {
  console.error("PostgreSQL error", err)
})
export default pool