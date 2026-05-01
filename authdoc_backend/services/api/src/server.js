import env from "./config/env.js"
import app from "./app.js"

import logger from "./config/logger.js"
import db from "./config/database.js"

const server = app.listen(process.env.PORT, () => {
  logger.info(`AuthDoc API running on port ${process.env.PORT}`)
})

// graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("Shutting down...")
  await db.end()
  server.close(() => process.exit(0))
})