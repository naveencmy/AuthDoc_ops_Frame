import { Queue } from "bullmq"
import redis from "../config/redis.js"
import { QUEUES } from "../utils/constants.js"

const validationQueue = new Queue(
  QUEUES.VALIDATION,
  { connection:redis }
)
export async function addValidationJob(data){
  await validationQueue.add(
    "process_validation",
    data
  )
}