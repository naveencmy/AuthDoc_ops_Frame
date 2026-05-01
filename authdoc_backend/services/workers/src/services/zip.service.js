// zip.service.js
import db from "../../../../shared/db/postgres.js"
import { unzipImages } from "../utils/unzip.utils.js"
import { addOCRJob } from "../../../../shared/queues/ocr.queue.js"
export async function processZip(batchId, zipPath) {
  await db.query(
    `UPDATE batches
     SET status='processing',
         updated_at=NOW()
     WHERE batch_id=$1`,
    [batchId]
  )

  const outputDir = `storage/uploads/batches/${batchId}`
  const images = await unzipImages(zipPath, outputDir)
  await db.query(
    `UPDATE batches
     SET total_documents=$1
     WHERE batch_id=$2`,
    [images.length, batchId]
  )
  for (const image of images) {
    const doc = await db.query(
      `INSERT INTO documents
       (batch_id,file_path,processing_status)
       VALUES($1,$2,'PENDING')
       RETURNING document_id`,
      [batchId, image]
    )
    await addOCRJob({
      documentId: doc.rows[0].document_id,
      imagePath: image
    })
  }
}