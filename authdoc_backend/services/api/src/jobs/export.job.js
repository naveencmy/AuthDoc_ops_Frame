import { Queue } from "bullmq"
import redis from "../config/redis.js"
import { QUEUES } from "../utils/constants.js"

const exportQueue = new Queue(
  QUEUES.EXPORT,
  { connection:redis }
)

export async function addExportJob(data){
  await exportQueue.add(
    "generate_export",
    data,
    {
      attempts:3,
      backoff:5000
    }
  )
}