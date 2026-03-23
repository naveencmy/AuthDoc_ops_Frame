import db from "../config/database.js"

export class SchemaRepository {
  static async createSchema(data) {
    const query = `
      INSERT INTO schema_definitions
      (document_type, language, schema_version, status)
      VALUES ($1,$2,$3,'active')
      RETURNING *
    `
    const values = [
      data.document_type,
      data.language,
      data.schema_version
    ]
    const { rows } = await db.query(query, values)
    return rows[0]
  }
  static async listSchemas() {
    const query = `
      SELECT *
      FROM schema_definitions
      ORDER BY created_at DESC
    `
    const { rows } = await db.query(query)
    return rows
  }

}