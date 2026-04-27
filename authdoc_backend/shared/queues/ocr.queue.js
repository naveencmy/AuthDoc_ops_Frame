import { Queue } from "bullmq"
import redis from "../../services/workers/src/config/redis.js"
import { QUEUE_NAMES } from "../constants/queueNames.js"

export const ocrQueue = new Queue(
  QUEUE_NAMES.OCR,
  { connection: redis }
)

export async function addOCRJob(data) {
  await ocrQueue.add(
    "process_ocr",
    data,
    {
      attempts: 3,
      backoff: 2000
    }
  )
}