import db from "../../../shared/db/postgres.js"
import { generateExcel } from "../../api/src/utils/excel.utils.js"

export async function generateBatchExport(exportId, batchId) {
  const docs = await db.query(
    `SELECT * FROM documents
     WHERE batch_id=$1`,
    [batchId]
  )
  const filePath = `storage/exports/${exportId}.xlsx`
  await generateExcel(filePath, docs.rows)
  await db.query(
    `UPDATE exports
     SET file_path=$1,status='completed'
     WHERE export_id=$2`,
    [filePath, exportId]
  )
}