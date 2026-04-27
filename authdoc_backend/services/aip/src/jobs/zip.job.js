import { Queue } from "bullmq"
import redis from "../config/redis.js"
import { QUEUES } from "../utils/constants.js"

// Create queue
const zipQueue = new Queue(
  QUEUES.ZIP,
  { connection: redis }
)

// Add job to queue
export async function addZipJob(data) {
  try {
    console.log("🚀 [ZIP JOB] Adding job to queue:", data)

    const job = await zipQueue.add(
      "process_zip",
      data,
      {
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 3000
        },
        removeOnComplete: true
      }
    )

    console.log("✅ [ZIP JOB] Job added successfully. Job ID:", job.id)

    return job
  } catch (error) {
    console.error("❌ [ZIP JOB] Failed to add job:", error)
    throw error
  }
}