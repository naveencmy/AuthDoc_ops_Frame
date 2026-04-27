import { unzipImages } from "../utils/unzip.utils.js"
import { addOCRJob } from "../../../../shared/queues/ocr.queue.js"
import db from "../../../../shared/db/postgres.js"

export async function processZip(batchId, zipPath) {
  const outputDir = `storage/uploads/batches/${batchId}`
  const images = await unzipImages(zipPath, outputDir)
  for (const image of images) {
    const doc = await db.query(
      `INSERT INTO documents(batch_id,file_path)
       VALUES($1,$2)
       RETURNING document_id`,
      [batchId, image]
    )
    await addOCRJob({
      documentId: doc.rows[0].document_id,
      imagePath: image
    })
  }
}