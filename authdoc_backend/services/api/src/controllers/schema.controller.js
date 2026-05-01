import { SchemaService } from "../services/schema.service.js"
import { createSchemaValidator } from "../validators/schema.validator.js"

export class SchemaController {

  static async createSchema(req, res, next) {
  try {
    const { error, value } = createSchemaValidator.validate(req.body)

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }

    const result = await SchemaService.createSchema(value)

    // 🔥 HANDLE FAILURE PROPERLY
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message
      })
    }

    
    return res.status(201).json(result)

  } catch (err) {
    next(err)
  }
}
static async listSchemas(req, res, next) {
  try {
    const schemas = await SchemaService.listSchemas()

    return res.json({
      success: true,
      data: schemas
    })
  } catch (err) {
    next(err)
  }
}
}