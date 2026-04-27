import db from "../../../../shared/db/postgres.js"
import { extractFields } from "../utils/schema.mapper.js"
import { addValidationJob } from "../../../../shared/queues/validation.queue.js"

export async function processExtraction(documentId, rawText) {
  const schemaFields = await db.query(
    `SELECT * FROM schema_fields`
  )
  const fields = extractFields(rawText, schemaFields.rows)
  for (const f of fields) {
    await db.query(
      `INSERT INTO extracted_fields
       (document_id,field_name,field_value,confidence_score)
       VALUES($1,$2,$3,$4)`,
      [documentId, f.field_name, f.field_value, f.confidence_score]
    )
  }
  await addValidationJob({
    documentId
  })
}