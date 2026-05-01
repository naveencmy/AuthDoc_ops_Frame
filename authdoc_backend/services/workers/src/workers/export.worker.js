// workers/export.worker.js
import { Worker } from "bullmq"
import redis from "../config/redis.js"
import { generateBatchExport } from "../services/export.service.js"

new Worker(
  "export_queue",
  async job => {
    console.log("[EXPORT] job:", job.id)
    const { exportId, batchId } = job.data
    await generateBatchExport(exportId, batchId)
    console.log("[EXPORT] completed:", job.id)
  },
  { connection: redis }
)