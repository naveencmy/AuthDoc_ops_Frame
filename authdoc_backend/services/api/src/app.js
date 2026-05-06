import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { randomUUID } from "crypto"
import fs from "fs"
import path from "path"
import redis from "./config/redis.js"

import { requestLogger } from "./middleware/request.logger.js"
import { errorMiddleware } from "./middleware/error.middleware.js"
import { serverAdapter } from "./dashboard/queue.dashboard.js"
import batchRoutes from "./routes/batch.routes.js"
import documentRoutes from "./routes/document.routes.js"
import schemaRoutes from "./routes/schema.routes.js"
import exportRoutes from "./routes/export.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"
import settingsRoutes from "./routes/settings.routes.js"

const app = express()

// security
app.use(helmet())
app.use(cors())

// request id (for tracing)
app.use((req, res, next) => {
  req.id = randomUUID()
  next()
})

// rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}))

// body parser
app.use(express.json({ limit: "10mb" }))

// logging
app.use(requestLogger)

// health
app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

// routes
app.use("/api/batches", batchRoutes)
app.use("/api/documents", documentRoutes)
app.use("/api/schemas", schemaRoutes)
app.use("/api/exports", exportRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/settings", settingsRoutes)

app.use("/admin/queues", serverAdapter.getRouter())
app.use(errorMiddleware)

const dirs = ["storage/uploads", "storage/extracted", "storage/exports"]
await redis.ping()
dirs.forEach(dir => {
  const fullPath = path.resolve(dir)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
  }
})
export default app