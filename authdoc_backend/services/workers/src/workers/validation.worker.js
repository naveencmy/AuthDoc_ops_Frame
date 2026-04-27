import { Worker } from "bullmq"
import redis from "../config/redis.js"
import { validateDocument } from "../services/validation.service.js"

const worker = new Worker(
  "validation_queue",
  async job => {
    console.log("[VALIDATION] picked job:", job.id, job.data)

    const { documentId } = job.data
    await validateDocument(documentId)

    console.log("[VALIDATION] completed job:", job.id)
  },
  { connection: redis }
)

worker.on("completed", job => {
  console.log("[VALIDATION] worker completed:", job.id)
})

worker.on("failed", (job, err) => {
  console.error("[VALIDATION] worker failed:", job?.id, err.message)
})

worker.on("error", err => {
  console.error("[VALIDATION] worker error:", err.message)
})