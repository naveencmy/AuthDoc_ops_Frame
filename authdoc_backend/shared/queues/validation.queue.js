import { Queue } from "bullmq"
import redis from "../../services/workers/src/config/redis.js"
import { QUEUE_NAMES } from "../constants/queueNames.js"

export const validationQueue = new Queue(
  QUEUE_NAMES.VALIDATION,
  { connection: redis }
)

export async function addValidationJob(data) {
  await validationQueue.add(
    "process_validation",
    data
  )
}