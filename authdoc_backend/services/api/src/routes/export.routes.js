// routes/export.routes.js

import express from "express"
import { ExportController } from "../controllers/export.controller.js"

const router = express.Router()
router.post("/", ExportController.createExport)
router.get("/", ExportController.listExports)
router.get("/:exportId", ExportController.getExport)
router.get("/:exportId/download", ExportController.downloadExport)
export default router