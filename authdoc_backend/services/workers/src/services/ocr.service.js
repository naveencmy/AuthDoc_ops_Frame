import { runOCR } from "../utils/ocr.client.js"
import db from "../../../shared/db/postgres.js"
import { addExtractionJob } from "../../../shared/queues/extraction.queue.js"

export async function processOCR(documentId, imagePath) {
  const result = await runOCR(imagePath)
  await db.query(
    `INSERT INTO ocr_results(document_id,raw_text,avg_confidence)
     VALUES($1,$2,$3)`,
    [documentId, result.raw_text, result.avg_confidence]
  )
  await addExtractionJob({
    documentId,
    rawText: result.raw_text
  })
}