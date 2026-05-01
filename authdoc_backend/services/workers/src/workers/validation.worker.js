import { Worker } from "bullmq"
import redis from "../config/redis.js"
import { ValidationService } from "../services/validation.service.js"

new Worker(
  "validation_queue",
  async job => {
    const { documentId } = job.data

    console.log("[VALIDATION] job:", documentId)

    await ValidationService.process(documentId)

    console.log("[VALIDATION] done:", documentId)
  },
  { connection: redis }
)