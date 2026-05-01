// controllers/export.controller.js
import { ExportService } from "../services/export.service.js"
import { exportSchema } from "../validators/export.validator.js"

export class ExportController {

  static async createExport(req, res, next) {
    try {
      const { error, value } = exportSchema.validate(req.body)
      if (error) {
        return res.status(400).json({ success: false, message: error.message })
      }

      const data = await ExportService.createExport(value)

      res.status(201).json({ success: true, data })
    } catch (err) {
      next(err)
    }
  }

  static async getExport(req, res, next) {
    try {
      const { exportId } = req.params
      const data = await ExportService.getExport(exportId)
      res.json({ success: true, data })
    } catch (err) {
      next(err)
    }
  }

  static async listExports(req, res, next) {
    try {
      const limit = parseInt(req.query.limit || 20)
      const offset = parseInt(req.query.offset || 0)

      const data = await ExportService.listExports(limit, offset)

      res.json({ success: true, data })
    } catch (err) {
      next(err)
    }
  }

  static async downloadExport(req, res, next) {
    try {
      const { exportId } = req.params
      const record = await ExportService.getExport(exportId)

      if (!record.file_path) {
        return res.status(404).json({
          success: false,
          message: "File not ready"
        })
      }

      res.download(record.file_path)
    } catch (err) {
      next(err)
    }
  }
}