import { Queue } from "bullmq"
import IORedis from "ioredis"
import { QUEUE_NAMES } from "../constants/queueNames.js"

const redis = new IORedis()
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