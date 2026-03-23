import { BatchService } from "../services/batch.service.js"
import { batchSchema } from "../validators/batch.validator.js"

export class BatchController {

  static async createBatch(req,res,next){
    try{
      const { error, value } = batchSchema.validate(req.body)
      if(error){
        return res.status(400).json({
          success:false,
          message:error.message
        })
      }
      if(!req.file){
        return res.status(400).json({
          success:false,
          message:"ZIP file required"
        })
      }

      const zipPath = req.file.path
      const batch = await BatchService.createBatch(
        value,
        zipPath
      )
      res.status(201).json({
        success:true,
        data:batch
      })
    }catch(err){
      next(err)
    }
  }

  static async getBatch(req,res,next){
    try{
      const { batchId } = req.params
      const batch = await BatchService.getBatch(batchId)
      res.json({
        success:true,
        data:batch
      })

    }catch(err){
      next(err)
    }
  }
  static async listBatches(req,res,next){
    try{
      const limit = parseInt(req.query.limit || 20)
      const offset = parseInt(req.query.offset || 0)
      const batches = await BatchService.listBatches(
        limit,
        offset
      )
      res.json({
        success:true,
        data:batches
      })
    }catch(err){
      next(err)
    }
  }
}