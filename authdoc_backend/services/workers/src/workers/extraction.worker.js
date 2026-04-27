import { Worker } from "bullmq"
import redis from "../config/redis.js"
import { processExtraction } from "../services/extraction.service.js"

const worker = new Worker(
  "extraction_queue",
  async job => {
    console.log("[EXTRACTION] picked job:", job.id, job.data)

    const { documentId, rawText } = job.data
    await processExtraction(documentId, rawText)

    console.log("[EXTRACTION] completed job:", job.id)
  },
  { connection: redis }
)

worker.on("completed", job => {
  console.log("[EXTRACTION] worker completed:", job.id)
})

worker.on("failed", (job, err) => {
  console.error("[EXTRACTION] worker failed:", job?.id, err.message)
})

worker.on("error", err => {
  console.error("[EXTRACTION] worker error:", err.message)
})