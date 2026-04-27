import { Worker } from "bullmq"
import redis from "../config/redis.js"
import { processOCR } from "../services/ocr.service.js"

const worker = new Worker(
  "ocr_queue",
  async job => {
    console.log("[OCR] picked job:", job.id, job.data)

    const { documentId, imagePath } = job.data
    await processOCR(documentId, imagePath)

    console.log("[OCR] completed job:", job.id)
  },
  { connection: redis }
)

worker.on("completed", job => {
  console.log("[OCR] worker completed:", job.id)
})

worker.on("failed", (job, err) => {
  console.error("[OCR] worker failed:", job?.id, err.message)
})

worker.on("error", err => {
  console.error("[OCR] worker error:", err.message)
})