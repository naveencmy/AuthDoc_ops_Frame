import { Queue } from "bullmq"
import IORedis from "ioredis"
import { QUEUE_NAMES } from "../constants/queueNames.js"

const redis = new IORedis()
export const zipQueue = new Queue(
  QUEUE_NAMES.ZIP,
  { connection: redis }
)

export async function addZipJob(data) {
  await zipQueue.add(
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
}