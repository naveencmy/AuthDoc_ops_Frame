import express from "express"
import { DocumentController } from "../controllers/document.controller.js"

const router = express.Router()

router.get("/:documentId",DocumentController.getDocument)
router.get("/batch/:batchId",DocumentController.getBatchDocuments)
export default router