import express from "express"
import { ExportController } from "../controllers/export.controller.js"

const router = express.Router()
router.post("/",ExportController.createExport)
router.get("/:exportId",ExportController.getExport)
export default router