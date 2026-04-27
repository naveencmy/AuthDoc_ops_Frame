import { Queue } from "bullmq"
import redis from "../../services/workers/src/config/redis.js"
import { QUEUE_NAMES } from "../constants/queueNames.js"

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