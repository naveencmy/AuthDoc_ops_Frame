import db from "../config/database.js"

export class ExportRepository {
  static async createExport(data) {
    const query = `
      INSERT INTO exports
      (batch_id, export_type, status)
      VALUES ($1,$2,'generating')
      RETURNING *
    `
    const values = [
      data.batch_id,
      data.export_type
    ]
    const { rows } = await db.query(query, values)
    return rows[0]
  }
  static async updateExportStatus(exportId, status, filePath) {

  const query = `
    UPDATE exports
    SET status = $1,
        file_path = $2
    WHERE export_id = $3
    RETURNING *
  `

  const { rows } = await db.query(query,[status,filePath,exportId])

  return rows[0]

}

}
