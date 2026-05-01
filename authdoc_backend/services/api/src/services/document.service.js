import { DocumentRepository } from "../repositories/document.repository.js"

export class DocumentService {

  static async getDocument(documentId) {
    const doc = await DocumentRepository.getById(documentId)
    if (!doc) throw new Error("Document not found")
    return transform(doc)
  }
  static async getBatchDocuments(batchId, limit, offset) {
    const docs = await DocumentRepository.getByBatch(batchId, limit, offset)
    return docs.map(transform)
  }
  static async listDocuments(filters) {
    const docs = await DocumentRepository.listDocuments(filters)
    return docs.map(transform)
  }
}

function transform(doc) {

  return {
    document_id: doc.document_id,
    type: doc.document_type,
    language: doc.language_detected || "unknown",
    pages: extractPages(doc.file_path),
    confidence: Math.round((doc.confidence_score || 0) * 100),
    status: deriveStatus(doc),
    qc_assigned: null
  }
}

function deriveStatus(doc) {
  if (doc.processing_status === "OCR_FAILED") return "MISSING"
  if (!doc.confidence_score) return "MISSING"
  if (doc.confidence_score < 0.7) return "LOW_CONFIDENCE"
  return doc.validation_status || "FLAGGED"
}

function extractPages(path) {
  return 1
}