import { Queue } from "bullmq"
import IORedis from "ioredis"
import { QUEUE_NAMES } from "../constants/queueNames.js"

const redis = new IORedis()
export const extractionQueue = new Queue(
  QUEUE_NAMES.EXTRACTION,
  { connection: redis }
)

export async function addExtractionJob(data) {
  await extractionQueue.add(
    "process_extraction",
    data
  )
}