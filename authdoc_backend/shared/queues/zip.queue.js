import { Queue } from "bullmq"
import redis from "../../services/workers/src/config/redis.js"
import { QUEUE_NAMES } from "../constants/queueNames.js"

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