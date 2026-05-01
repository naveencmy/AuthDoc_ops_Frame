export const DOCUMENT_STATUS = {
  VERIFIED: "VERIFIED",
  FLAGGED: "FLAGGED",
  LOW_CONFIDENCE: "LOW_CONFIDENCE",
  MISSING: "MISSING"
}
export const BATCH_STATUS = {
  QUEUED: "queued",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed"
}
export const QUEUES = {
  ZIP: "zip_queue",
  OCR: "ocr_queue",
  EXTRACTION: "extraction_queue",
  VALIDATION: "validation_queue",
  EXPORT: "export_queue"
}