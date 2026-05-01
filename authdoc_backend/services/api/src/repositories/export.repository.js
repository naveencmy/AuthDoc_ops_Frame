import db from "../config/database.js"

export class ExportRepository {

  static async createExport(data) {
    const { rows } = await db.query(
      `INSERT INTO exports (batch_id, export_type, status)
       VALUES ($1,$2,'generating')
       RETURNING *`,
      [data.batch_id, data.export_type]
    )
    return rows[0]
  }

  static async getExportById(exportId) {
    const { rows } = await db.query(
      `SELECT * FROM exports WHERE export_id=$1`,
      [exportId]
    )
    return rows[0]
  }

  static async listExports(limit = 20, offset = 0) {
    const { rows } = await db.query(
      `SELECT *
       FROM exports
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )
    return rows
  }

  static async updateExportStatus(exportId, status, filePath = null) {
    const { rows } = await db.query(
      `UPDATE exports
       SET status=$1,
           file_path=$2,
           updated_at=NOW()
       WHERE export_id=$3
       RETURNING *`,
      [status, filePath, exportId]
    )
    return rows[0]
  }
}