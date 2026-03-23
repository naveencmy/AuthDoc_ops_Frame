import { Worker } from "bullmq"
import redis from "../config/redis.js"
import { processExtraction } from "../services/extraction.service.js"

new Worker(
  "extraction_queue",
  async job => {
    const { documentId, rawText } = job.data
    await processExtraction(documentId, rawText)
  },
  { connection: redis }
)