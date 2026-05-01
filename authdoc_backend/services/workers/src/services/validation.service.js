import db from "../../../../shared/db/postgres.js"
import { addOCRJob } from "../../../../shared/queues/ocr.queue.js"

export class ValidationService {
  static async process(documentId) {
    const client = await db.connect()
    try {
      await client.query("BEGIN")
      const doc = await this.getDocument(client, documentId)
      const batch = await this.getBatch(client, doc.batch_id)
      const schema = await this.getSchema(client, batch)
      const result = this.validateFields(
        doc.extracted_data,
        schema
      )
      if (result.avgConfidence < 0.7 && doc.retry_count < 2) {
        await this.incrementRetry(client, documentId)
        await client.query("COMMIT")
        await addOCRJob({ documentId })
        return
      }
      await this.saveValidation(
        client,
        documentId,
        result
      )
      await client.query("COMMIT")
    } catch (err) {
      await client.query("ROLLBACK")
      console.error("[VALIDATION ERROR]:", err.message)
      await db.query(
        `UPDATE documents
         SET validation_status='FAILED'
         WHERE document_id=$1`,
        [documentId]
      )
      throw err
    } finally {
      client.release()
    }
  }
  static async getDocument(client, documentId) {
    const res = await client.query(
      `SELECT * FROM documents WHERE document_id=$1`,
      [documentId]
    )
    if (!res.rows.length) throw new Error("Document not found")

    return res.rows[0]
  }
  static async getBatch(client, batchId) {
    const res = await client.query(
      `SELECT * FROM batches WHERE batch_id=$1`,
      [batchId]
    )
    if (!res.rows.length) throw new Error("Batch not found")
    return res.rows[0]
  }
  static async getSchema(client, batch) {
    const res = await client.query(
      `SELECT sf.field_name, sf.data_type, sf.required, sf.confidence_threshold
       FROM schema_fields sf
       JOIN schema_definitions sd
       ON sf.schema_id = sd.schema_id
       WHERE sd.document_type=$1
       AND sd.version=$2
       AND sd.language=$3`,
      [
        batch.document_type,
        batch.schema_version,
        batch.language
      ]
    )
    if (!res.rows.length) throw new Error("Schema not found")
    return res.rows
  }
  static async incrementRetry(client, documentId) {
    await client.query(
      `UPDATE documents
       SET retry_count = retry_count + 1
       WHERE document_id=$1`,
      [documentId]
    )
  }
  static async saveValidation(client, documentId, result) {
    await client.query(
      `UPDATE documents
       SET validated_data = $1,
           flagged_fields = $2,
           validation_status = $3,
           confidence_score = $4,
           updated_at = NOW()
       WHERE document_id=$5`,
      [
        result.nested,
        result.flags,
        result.status,
        result.avgConfidence,
        documentId
      ]
    )
  }
  static validateFields(data, schema) {
    const validated = {}
    const flags = []
    let total = 0
    let weightSum = 0
    for (const field of schema) {
      const value = this.getValue(data, field.field_name)
      let confidence = 1
      let valid = true
      const weight = field.required ? 2 : 1
      if (field.required && this.isEmpty(value)) {
        valid = false
        confidence = 0
      }
      if (!this.isEmpty(value)) {
        if (field.data_type === "number" && isNaN(Number(value))) {
          valid = false
          confidence = 0.3
        }
        if (field.data_type === "string" && typeof value !== "string") {
          valid = false
          confidence = 0.5
        }
      }
      if (confidence < field.confidence_threshold) {
        valid = false
      }
      validated[field.field_name] = {
        value,
        confidence,
        valid
      }
      if (!valid) flags.push(field.field_name)
      total += confidence * weight
      weightSum += weight
    }
    const avg = weightSum ? total / weightSum : 0
    return {
      nested: this.nest(validated),
      flags,
      avgConfidence: avg,
      status: flags.length ? "FLAGGED" : "VERIFIED"
    }
  }
  static getValue(obj, path) {
    return path.split(".").reduce((o, k) => o?.[k], obj)
  }
  static isEmpty(v) {
    return v === null || v === undefined || v === ""
  }
  static nest(flat) {
    const res = {}
    for (const key in flat) {
      const parts = key.split(".")
      let cur = res
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        if (i === parts.length - 1) {
          cur[p] = flat[key]
        } else {
          cur[p] = cur[p] || {}
          cur = cur[p]
        }
      }
    }
    return res
  }
}