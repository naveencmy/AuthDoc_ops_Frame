import { Queue } from "bullmq"
import redis from "../config/redis.js"
import { QUEUES } from "../utils/constants.js"

const ocrQueue = new Queue(
  QUEUES.OCR,
  { connection:redis }
)
export async function addOCRJob(data){

  await ocrQueue.add(
    "process_ocr",
    data,
    {
      attempts:3,
      backoff:2000
    }
  )

}