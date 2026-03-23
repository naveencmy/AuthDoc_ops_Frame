import { Worker } from "bullmq"
import redis from "../config/redis.js"
import { processZip } from "../services/zip.service.js"

new Worker(
  "zip_queue",
  async job => {
    const { batchId, zipPath } = job.data
    await processZip(batchId, zipPath)
  },
  { connection: redis }
)