import { Worker } from "bullmq"
import redis from "../config/redis.js"
import { processZip } from "../services/zip.service.js"

const worker = new Worker(
  "zip_queue",
  async job => {
    console.log("[ZIP] picked job:", job.id, job.data)

    const { batchId, zipPath } = job.data
    await processZip(batchId, zipPath)

    console.log("[ZIP] completed job:", job.id)
  },
  { connection: redis }
)

worker.on("completed", job => {
  console.log("[ZIP] worker completed:", job.id)
})

worker.on("failed", (job, err) => {
  console.error("[ZIP] worker failed:", job?.id, err.message)
})

worker.on("error", err => {
  console.error("[ZIP] worker error:", err.message)
})