import { SchemaRepository } from "../repositories/schema.repository.js"

export class SchemaService {
  static async createSchema(data) {
    return SchemaRepository.createSchema(data)
  }
  static async listSchemas() {
    return SchemaRepository.listSchemas()
  }

}