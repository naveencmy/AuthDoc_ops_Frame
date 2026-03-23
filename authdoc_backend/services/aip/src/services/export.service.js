import { ExportRepository } from "../repositories/export.repository.js"
import { addExportJob } from "../jobs/export.job.js"

export class ExportService {
  static async createExport(data) {
    const record = await ExportRepository.createExport(data)
    await addExportJob({
      exportId: record.export_id,
      batchId: record.batch_id
    })
    return record
  }

  static async getExport(exportId) {
    const record = await ExportRepository.getExportById(exportId)
    if (!record) {
      throw new Error("Export not found")
    }
    return record
  }
}