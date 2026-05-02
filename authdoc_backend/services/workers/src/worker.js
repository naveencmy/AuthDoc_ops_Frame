import "../../api/src/config/env.js"
import "./workers/zip.worker.js"
import "./workers/ocr.worker.js"
import "./workers/validation.worker.js"
import "./workers/export.worker.js"

console.log("AuthDoc Workers started")
console.log("Configuration loaded:")
console.log("   OCR Service:", process.env.OCR_SERVICE_URL)
console.log("   Database:", process.env.DATABASE_URL?.substring(0, 50) + "...")
console.log("   Redis:", `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`)
console.log("")
console.log("All workers are listening for jobs...")

// Global error handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason)
})

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error)
  process.exit(1)
})
