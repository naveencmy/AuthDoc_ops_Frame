import { Queue } from "bullmq"
import redis from "../../services/workers/src/config/redis.js"
import { QUEUE_NAMES } from "../constants/queueNames.js"

export const exportQueue = new Queue(
  QUEUE_NAMES.EXPORT,
  { connection: redis }
)

export async function addExportJob(data) {
  await exportQueue.add(
    "generate_export",
    data,
    {
      attempts: 3,
      backoff: 5000
    }
  )
}