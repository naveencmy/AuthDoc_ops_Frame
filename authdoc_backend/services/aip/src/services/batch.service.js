import { BatchRepository } from "../repositories/batch.repository.js"
import { addZipJob } from "../jobs/zip.job.js"

export class BatchService {
  static async createBatch(data, zipPath) {
    const batch = await BatchRepository.createBatch(data)
    await addZipJob({
      batchId: batch.batch_id,
      zipPath
    })
    return batch
  }
  static async getBatch(batchId) {
    const batch = await BatchRepository.getBatchById(batchId)
    if (!batch) {
      throw new Error("Batch not found")
    }
    return batch
  }
  static async listBatches(limit, offset) {
    return BatchRepository.listBatches(limit, offset)
  }

}