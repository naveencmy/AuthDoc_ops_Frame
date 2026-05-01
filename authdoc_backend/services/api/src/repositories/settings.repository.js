import db from "../config/database.js"

export class SettingsRepository {
  static async listSettings() {
    const query = `
      SELECT *
      FROM system_settings
    `
    const { rows } = await db.query(query)
    return rows
  }
  static async updateSetting(key, value) {
    const query = `
      UPDATE system_settings
      SET setting_value = $1,
          updated_at = NOW()
      WHERE setting_key = $2
      RETURNING *
    `
    const { rows } = await db.query(query, [value, key])
    return rows[0]
  }

}