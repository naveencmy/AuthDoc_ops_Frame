import { DocumentRepository } from "../repositories/document.repository.js"

export class DocumentService {
  static async getDocument(documentId) {
    const doc = await DocumentRepository.getById(documentId)
    if (!doc) {
      throw new Error("Document not found")
    }
    return doc
  }
  static async getBatchDocuments(batchId, limit, offset) {
    return DocumentRepository.getByBatch(
      batchId,
      limit,
      offset
    )
  }
}