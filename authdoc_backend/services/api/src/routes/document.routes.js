
import express from "express"
import { DocumentController } from "../controllers/document.controller.js"

const router = express.Router()
router.get("/", DocumentController.listDocuments)
router.get("/batch/:batchId", DocumentController.getBatchDocuments)
router.get("/:documentId", DocumentController.getDocument)

export default router