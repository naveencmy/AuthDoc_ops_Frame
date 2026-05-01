// batch.service.js
import fs from "fs"
import path from "path"
import { BatchRepository } from "../repositories/batch.repository.js"
import { addZipJob } from "../jobs/zip.job.js"
import { getBatchStoragePath } from "../utils/file.utils.js"

export class BatchService {
  static async createBatch(data, zipPath) {

    const batch = await BatchRepository.createBatch(data)
    const batchDir = getBatchStoragePath(batch.batch_id)
    const newZipPath = path.join(batchDir, "input.zip")
    fs.renameSync(zipPath, newZipPath)
    await addZipJob({
      batchId: batch.batch_id,
      zipPath: newZipPath
    })
    return batch
  }catch (error) {
    console.error("[BATCH] ERROR:", error)
    throw error
    }
  }