import db from "../config/database.js"

export class SchemaRepository {

  static async createSchema(data) {
    const client = await db.connect()

    try {
      await client.query("BEGIN")

      // prevent duplicates
      const existing = await client.query(
        `SELECT 1 FROM schema_definitions
         WHERE document_type=$1 AND language=$2 AND version=$3`,
        [data.document_type, data.language, data.schema_version]
      )

      if (existing.rows.length) {
        throw new Error("Schema version already exists")
      }

      // deactivate old
      await client.query(
        `UPDATE schema_definitions
         SET is_active=false
         WHERE document_type=$1 AND language=$2`,
        [data.document_type, data.language]
      )

      // insert schema
      const schemaRes = await client.query(
        `INSERT INTO schema_definitions
         (document_type, language, version, is_active)
         VALUES ($1,$2,$3,true)
         RETURNING *`,
        [data.document_type, data.language, data.schema_version]
      )

      const schemaId = schemaRes.rows[0].schema_id

      // insert fields
      for (const field of data.schema_json) {
        await client.query(
          `INSERT INTO schema_fields
           (schema_id, field_name, data_type, required, confidence_threshold)
           VALUES ($1,$2,$3,$4,$5)`,
          [
            schemaId,
            field.field_name,
            field.data_type,
            field.required,
            field.confidence_min
          ]
        )
      }

      await client.query("COMMIT")

      return {
        success: true,
        data: schemaRes.rows[0]
      }

    } catch (err) {
      await client.query("ROLLBACK")
      return { success: false, message: err.message }
    } finally {
      client.release()
    }
  }

  static async listSchemas() {
    const { rows } = await db.query(
      `SELECT * FROM schema_definitions
       ORDER BY created_at DESC`
    )
    return rows
  }

  static async getSchemaFields(documentType, language, version) {
    const schema = await db.query(
      `SELECT schema_id FROM schema_definitions
       WHERE document_type=$1 AND language=$2 AND version=$3`,
      [documentType, language, version]
    )

    if (!schema.rows.length) return []

    const { rows } = await db.query(
      `SELECT * FROM schema_fields
       WHERE schema_id=$1`,
      [schema.rows[0].schema_id]
    )

    return rows
  }
}