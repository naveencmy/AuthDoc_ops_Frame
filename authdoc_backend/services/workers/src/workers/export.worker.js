import { Worker } from "bullmq"
import redis from "../config/redis.js"
import { generateBatchExport } from "../services/export.service.js"

new Worker(
  "export_queue",
  async job => {
    const { exportId, batchId } = job.data
    await generateBatchExport(exportId, batchId)
  },
  { connection: redis }
)