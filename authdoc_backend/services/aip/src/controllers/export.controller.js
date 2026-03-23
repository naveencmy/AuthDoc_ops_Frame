import { ExportService } from "../services/export.service.js"
import { exportSchema } from "../validators/export.validator.js"

export class ExportController {

  static async createExport(req,res,next){
    try{
      const { error, value } = exportSchema.validate(req.body)
      if(error){
        return res.status(400).json({
          success:false,
          message:error.message
        })
      }
      const exportRecord = await ExportService.createExport(value)
      res.status(201).json({
        success:true,
        data:exportRecord
      })
    }catch(err){
      next(err)
    }
  }
  static async getExport(req,res,next){
    try{
      const { exportId } = req.params
      const exportData = await ExportService.getExport(exportId)
      res.json({
        success:true,
        data:exportData
      })
    }catch(err){
      next(err)
    }
  }
}