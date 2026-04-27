import { BatchRepository } from "../repositories/batch.repository.js"
import { addZipJob } from "../jobs/zip.job.js"

export class BatchService {

  // Create batch + trigger worker
  static async createBatch(data, zipPath) {
    try {
      console.log("📦 [BATCH] Creating batch with data:", data)

      // Step 1: Create batch in DB
      const batch = await BatchRepository.createBatch(data)

      console.log("✅ [BATCH] Batch created:", batch)

      // Step 2: Add job to queue
      try {
        console.log("🚀 [BATCH] Sending job to ZIP queue...")

        await addZipJob({
          batchId: batch.batch_id,
          zipPath
        })

        console.log("✅ [BATCH] Job sent to queue successfully")

      } catch (jobError) {
        console.error("❌ [BATCH] Failed to send job:", jobError)
      }

      return batch

    } catch (error) {
      console.error("❌ [BATCH] Failed to create batch:", error)
      throw error
    }
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