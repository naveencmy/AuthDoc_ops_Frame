import db from "../../../../shared/db/postgres.js"
import ExcelJS from "exceljs"
import fs from "fs"
import path from "path"

function flatten(obj, prefix = "", res = {}) {
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key
    if (typeof obj[key] === "object" && obj[key] !== null) {
      flatten(obj[key], newKey, res)
    } else {
      res[newKey] = obj[key]
    }
  }
  return res
}

export async function generateBatchExport(exportId, batchId) {
  try {
    const { rows } = await db.query(
      `SELECT document_id, validated_data, confidence_score
       FROM documents
       WHERE batch_id=$1
       AND validation_status='VERIFIED'
       AND confidence_score >= 0.7`,
      [batchId]
    )

    if (!rows.length) {
      throw new Error("No valid documents")
    }

    const flattened = rows.map(doc => ({
      document_id: doc.document_id,
      confidence_score: doc.confidence_score,
      ...flatten(doc.validated_data)
    }))

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Export")

    sheet.columns = Object.keys(flattened[0]).map(k => ({
      header: k,
      key: k,
      width: 25
    }))

    sheet.addRows(flattened)

    const filePath = path.join("storage/exports", `${exportId}.xlsx`)

    await workbook.xlsx.writeFile(filePath)

    await db.query(
      `UPDATE exports
       SET file_path=$1,
           status='completed',
           updated_at=NOW()
       WHERE export_id=$2`,
      [filePath, exportId]
    )

  } catch (err) {
    await db.query(
      `UPDATE exports
       SET status='failed',
           updated_at=NOW()
       WHERE export_id=$1`,
      [exportId]
    )
    throw err
  }
}