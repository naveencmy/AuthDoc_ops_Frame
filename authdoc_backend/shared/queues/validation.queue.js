import { Queue } from "bullmq"
import IORedis from "ioredis"
import { QUEUE_NAMES } from "../constants/queueNames.js"

const redis = new IORedis()
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