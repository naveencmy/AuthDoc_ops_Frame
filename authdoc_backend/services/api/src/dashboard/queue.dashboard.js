import { ExpressAdapter } from "@bull-board/express"
import { createBullBoard } from "@bull-board/api"
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter"

import { Queue } from "bullmq"
import redis from "../config/redis.js"
import { QUEUES } from "../utils/constants.js"

const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath("/admin/queues")

const queues = [
  new Queue(QUEUES.ZIP, { connection: redis }),
  new Queue(QUEUES.OCR, { connection: redis }),
  new Queue(QUEUES.EXTRACTION, { connection: redis }),
  new Queue(QUEUES.VALIDATION, { connection: redis }),
  new Queue(QUEUES.EXPORT, { connection: redis })
]

createBullBoard({
  queues: queues.map(q => new BullMQAdapter(q)),
  serverAdapter
})

export { serverAdapter }