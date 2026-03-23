import pkg from "pg"
import env from "./env.js"

const { Pool } = pkg
export const db = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})
db.on("connect", () => {
  console.log("PostgreSQL connected")
})
db.on("error", (err) => {
  console.error("PostgreSQL error", err)
})
export default db