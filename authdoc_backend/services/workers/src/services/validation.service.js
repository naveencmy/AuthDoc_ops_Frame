import db from "../../../../shared/db/postgres.js"

export async function validateDocument(documentId) {
  const fields = await db.query(
    `SELECT * FROM extracted_fields
     WHERE document_id=$1`,
    [documentId]
  )
  let status = "VERIFIED"
  for (const f of fields.rows) {
    if (!f.field_value) {
      status = "MISSING"
      break
    }
    if (f.confidence_score < 0.7) {
      status = "LOW_CONFIDENCE"
    }
  }
  await db.query(
    `UPDATE documents
     SET validation_status=$1
     WHERE document_id=$2`,
    [status, documentId]
  )
}