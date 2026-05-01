// services/export.service.js
import db from "../config/database.js"
import { ExportRepository } from "../repositories/export.repository.js"
import { addExportJob } from "../jobs/export.job.js"

export class ExportService {

  static async createExport(data) {

    const { rows } = await db.query(
      `SELECT batch_id FROM batches WHERE batch_id=$1`,
      [data.batch_id]
    )

    if (!rows.length) {
      throw new Error("Invalid batch_id")
    }
    const existing = await db.query(
      `SELECT * FROM exports
       WHERE batch_id=$1 AND status='generating'`,
      [data.batch_id]
    )

    if (existing.rows.length) {
      return existing.rows[0]
    }

    const record = await ExportRepository.createExport(data)
    await addExportJob({
      exportId: record.export_id,
      batchId: record.batch_id
    })
    return record
  }
  static async getExport(exportId) {
    const record = await ExportRepository.getExportById(exportId)
    if (!record) throw new Error("Export not found")
    return record
  }

  static async listExports(limit, offset) {
    return ExportRepository.listExports(limit, offset)
  }
}