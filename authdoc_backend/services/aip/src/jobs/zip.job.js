import { Queue } from "bullmq"
import redis from "../config/redis.js"
import { QUEUES } from "../utils/constants.js"

const zipQueue = new Queue(
  QUEUES.ZIP,
  { connection:redis }
)

export async function addZipJob(data){
  await zipQueue.add(
    "process_zip",
    data,
    {
      attempts:5,
      backoff:{
        type:"exponential",
        delay:3000
      },
      removeOnComplete:true
    }
  )
}