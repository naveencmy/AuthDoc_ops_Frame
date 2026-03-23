import { Queue } from "bullmq"
import IORedis from "ioredis"
import { QUEUE_NAMES } from "../constants/queueNames.js"

const redis = new IORedis()
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