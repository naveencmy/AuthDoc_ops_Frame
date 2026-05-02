import { runOCR } from "../utils/ocr.client.js"
import db from "../../../../shared/db/postgres.js"
import { addValidationJob } from "../../../../shared/queues/validation.queue.js"

const MAX_OCR_RETRIES = 3
export async function processOCR(documentId, imagePath) {
  console.log("[OCR] Processing:", documentId)
  const existing = await db.query(
    `SELECT processing_status FROM documents WHERE document_id=$1`,
    [documentId]
  )
  if (!existing.rows.length) {
    throw new Error("Document not found")
  }
  const status = existing.rows[0].processing_status
  if (status === "OCR_DONE") {
    console.log("[OCR] Skipping already processed:", documentId)
    return
  }

  const batchRes = await db.query(
    `SELECT b.batch_id, b.document_type, b.schema_version
     FROM documents d
     JOIN batches b ON d.batch_id = b.batch_id
     WHERE d.document_id=$1`,
    [documentId]
  )
  if (!batchRes.rows.length) {
    throw new Error("Batch not found")
  }
  const { batch_id, document_type, schema_version } = batchRes.rows[0]
  
  console.log("[OCR] Looking up schema:", { document_type, schema_version })
  
  let schemaRes = await db.query(
    `SELECT sf.field_name, sf.data_type, sf.required, sf.confidence_min
     FROM schema_fields sf
     JOIN schema_definitions sd
     ON sf.schema_id = sd.schema_id
     WHERE sd.document_type=$1
     AND sd.language=$2
     AND sd.version=$3
     ORDER BY sf.field_name ASC`,
    [document_type, "default", schema_version]
  )
  
  // Fallback: try without language filter if not found
  if (!schemaRes.rows.length) {
    console.warn("[OCR] Schema not found with language 'default', trying without language filter")
    schemaRes = await db.query(
      `SELECT sf.field_name, sf.data_type, sf.required, sf.confidence_min
       FROM schema_fields sf
       JOIN schema_definitions sd
       ON sf.schema_id = sd.schema_id
       WHERE sd.document_type=$1
       AND sd.version=$2
       ORDER BY sf.field_name ASC`,
      [document_type, schema_version]
    )
  }
  
  // Final fallback: try any schema for this document type
  if (!schemaRes.rows.length) {
    console.warn("[OCR] Schema not found with version, trying latest for document type")
    schemaRes = await db.query(
      `SELECT sf.field_name, sf.data_type, sf.required, sf.confidence_min
       FROM schema_fields sf
       JOIN schema_definitions sd
       ON sf.schema_id = sd.schema_id
       WHERE sd.document_type=$1
       ORDER BY sd.version DESC, sf.field_name ASC
       LIMIT 100`,
      [document_type]
    )
  }
  
  if (!schemaRes.rows.length) {
    throw new Error(`Schema not found for document_type=${document_type}, version=${schema_version}`)
  }
  
  // Build complete schema with all available fields
  const schema = schemaRes.rows.map(f => ({
    field_name: f.field_name,
    data_type: f.data_type,
    required: f.required,
    confidence_threshold: f.confidence_min
  }))
  
  console.log("[OCR] Total schema fields from DB:", schema.length)
  console.log("[OCR] Sending fields to OCR:", JSON.stringify(schema, null, 2))
  
  let lastError = null

  for (let attempt = 1; attempt <= MAX_OCR_RETRIES; attempt++) {
    try {
      console.log(`[OCR] Attempt ${attempt} for ${documentId}`)
      const result = await runOCR(imagePath, schema)
      if (!result?.fields || typeof result.fields !== "object") {
        throw new Error("Invalid OCR structure")
      }
      const normalized = normalizeFields(result.fields)
      await db.query(
        `UPDATE documents
         SET extracted_data = $1,
             processing_status = 'OCR_DONE',
             updated_at = NOW()
         WHERE document_id = $2`,
        [normalized, documentId]
      )
      console.log("[OCR] SUCCESS:", documentId)
      await db.query(
        `UPDATE batches
         SET processed_documents = processed_documents + 1,
             updated_at = NOW()
         WHERE batch_id = $1`,
        [batch_id]
      )
      await addValidationJob({ documentId })
      return
    } catch (err) {
      lastError = err
      console.warn(`[OCR] Attempt ${attempt} failed:`, err.message)
      
      // Don't retry on non-recoverable errors
      const nonRecoverable = [
        "Schema not found",
        "Document not found",
        "Batch not found",
        "Invalid OCR structure"
      ]
      const isNonRecoverable = nonRecoverable.some(msg => err.message?.includes(msg))
      
      if (isNonRecoverable) {
        console.error("[OCR] Non-recoverable error, skipping retries:", err.message)
        break
      }

      if (attempt === MAX_OCR_RETRIES) break
    }
  }

  console.error("[OCR FAILED]:", documentId)

  await db.query(
    `UPDATE documents
     SET processing_status = 'OCR_FAILED',
         updated_at = NOW()
     WHERE document_id = $1`,
    [documentId]
  )

  await db.query(
    `UPDATE batches
     SET error_count = error_count + 1,
         updated_at = NOW()
     WHERE batch_id = $1`,
    [batch_id]
  )
  throw lastError
}

function normalizeFields(fields) {
  const result = {}
  for (const key in fields) {
    if (!key || typeof key !== "string") continue
    if (key.includes(".")) {
      const parts = key.split(".")
      let current = result
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        if (!part) continue
        if (i === parts.length - 1) {
          current[part] = fields[key]
        } else {
          current[part] = current[part] || {}
          current = current[part]
        }
      }
    } else {
      result[key] = fields[key]
    }
  }
  return result
}