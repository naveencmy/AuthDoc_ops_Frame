import db from "../config/database.js"

export class DocumentRepository {
  static async getById(documentId) {
    const { rows } = await db.query(
      `SELECT * FROM documents WHERE document_id=$1`,
      [documentId]
    )
    return rows[0]
  }
  static async getByBatch(batchId, limit, offset) {
    const { rows } = await db.query(
      `SELECT * FROM documents
       WHERE batch_id=$1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [batchId, limit, offset]
    )
    return rows
  }
  static async listDocuments(filters) {
    const conditions = []
    const values = []
    let i = 1
    if (filters.type) {
      conditions.push(`document_type = $${i++}`)
      values.push(filters.type)
    }
    if (filters.language) {
      conditions.push(`language_detected = $${i++}`)
      values.push(filters.language)
    }
    if (filters.status) {
      conditions.push(`validation_status = $${i++}`)
      values.push(filters.status)
    }
    if (filters.minConfidence) {
      conditions.push(`confidence_score >= $${i++}`)
      values.push(filters.minConfidence)
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""
    const query = `
      SELECT *
      FROM documents
      ${where}
      ORDER BY created_at DESC
      LIMIT $${i++} OFFSET $${i}
    `
    values.push(filters.limit, filters.offset)
    const { rows } = await db.query(query, values)
    return rows
  }
}