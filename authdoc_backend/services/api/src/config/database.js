import pkg from "pg"
import env from "./env.js"

const { Pool } = pkg

const db = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
})
console.log("USING DB:", env.DATABASE_URL)
db.connect()
  .then(client => {
    console.log(" DB CONNECTED")
    client.release()
  })
  .catch(err => {
    console.error("DB CONNECTION FAILED:", err)
  })
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err)
})

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err)
})

export default db