import db from "../config/database.js"

export class DocumentRepository {
  static async getById(documentId) {
    const query = `
      SELECT *
      FROM documents
      WHERE document_id = $1
    `
    const { rows } = await db.query(query, [documentId])
    return rows[0]
  }
  static async getByBatch(batchId, limit, offset) {
    const query = `
      SELECT *
      FROM documents
      WHERE batch_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `
    const { rows } = await db.query(query, [
      batchId,
      limit,
      offset
    ])
    return rows
  }

}