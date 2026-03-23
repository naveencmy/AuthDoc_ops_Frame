import db from "../config/database.js"

export class DashboardService {
  static async getStats() {
    const batchCountQuery = `
      SELECT COUNT(*) AS total_batches
      FROM batches
    `
    const documentCountQuery = `
      SELECT COUNT(*) AS total_documents
      FROM documents
    `
    const verifiedQuery = `
      SELECT COUNT(*) AS verified_documents
      FROM documents
      WHERE validation_status = 'VERIFIED'
    `
    const flaggedQuery = `
      SELECT COUNT(*) AS flagged_documents
      FROM documents
      WHERE validation_status = 'FLAGGED'
    `
    const [
      batchCount,
      docCount,
      verified,
      flagged
    ] = await Promise.all([
      db.query(batchCountQuery),
      db.query(documentCountQuery),
      db.query(verifiedQuery),
      db.query(flaggedQuery)
    ])
    return {
      total_batches: batchCount.rows[0].total_batches,
      total_documents: docCount.rows[0].total_documents,
      verified_documents: verified.rows[0].verified_documents,
      flagged_documents: flagged.rows[0].flagged_documents
    }
  }
}