import { SchemaService } from "../services/schema.service.js"
import { schemaDefinition } from "../validators/schema.validator.js"

export class SchemaController {

  static async createSchema(req,res,next){
    try{
      const { error, value } = schemaDefinition.validate(req.body)
      if(error){
        return res.status(400).json({
          success:false,
          message:error.message
        })
      }
      const schema = await SchemaService.createSchema(value)
      res.status(201).json({
        success:true,
        data:schema
      })
    }catch(err){
      next(err)
    }
  }

  static async listSchemas(req,res,next){
    try{
      const schemas = await SchemaService.listSchemas()
      res.json({
        success:true,
        data:schemas
      })
    }catch(err){
      next(err)
    }
  }
}