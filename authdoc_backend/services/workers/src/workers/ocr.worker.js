import { Worker } from "bullmq"
import redis from "../config/redis.js"
import { processOCR } from "../services/ocr.service.js"

new Worker(
  "ocr_queue",
  async job => {
    const { documentId, imagePath } = job.data
    await processOCR(documentId, imagePath)
  },
  { connection: redis }
)