import db from "../config/database.js"

export class BatchRepository {
  static async createBatch(data) {
    const query = `
      INSERT INTO batches
      (
        batch_name,
        document_type,
        priority,
        total_documents,
        processed_documents,
        error_count,
        status
      )
      VALUES ($1,$2,$3,0,0,0,'queued')
      RETURNING *
    `
    const values = [
      data.batch_name,
      data.document_type,
      data.priority
    ]
    const { rows } = await db.query(query, values)
    return rows[0]
  }
  
  static async getBatchById(batchId) {
    const query = `
      SELECT *
      FROM batches
      WHERE batch_id = $1
    `
    const { rows } = await db.query(query,[batchId])
    return rows[0]
  }

  static async listBatches(limit, offset) {
    const query = `
      SELECT *
      FROM batches
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `
    const { rows } = await db.query(query,[limit,offset])
    return rows
  }
}