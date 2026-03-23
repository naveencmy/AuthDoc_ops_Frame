import { DocumentService } from "../services/document.service.js"
export class DocumentController {

  static async getDocument(req,res,next){
    try{
      const { documentId } = req.params
      const document = await DocumentService.getDocument(
        documentId
      )
      res.json({
        success:true,
        data:document
      })
    }catch(err){
      next(err)
    }
  }

  static async getBatchDocuments(req,res,next){
    try{
      const { batchId } = req.params
      const limit = parseInt(req.query.limit || 20)
      const offset = parseInt(req.query.offset || 0)
      const documents = await DocumentService.getBatchDocuments(
        batchId,
        limit,
        offset
      )
      res.json({
        success:true,
        data:documents
      })
    }catch(err){
      next(err)
    }
  }
}