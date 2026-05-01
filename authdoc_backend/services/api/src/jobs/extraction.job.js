import { Queue } from "bullmq"
import redis from "../config/redis.js"
import { QUEUES } from "../utils/constants.js"

const extractionQueue = new Queue(
  QUEUES.EXTRACTION,
  { connection:redis }
)

export async function addExtractionJob(data){
  await extractionQueue.add(
    "process_extraction",
    data
  )
}