import { Worker } from "bullmq"
import redis from "../config/redis.js"
import { validateDocument } from "../services/validation.service.js"

new Worker(
  "validation_queue",
  async job => {
    const { documentId } = job.data
    await validateDocument(documentId)
  },
  { connection: redis }
)