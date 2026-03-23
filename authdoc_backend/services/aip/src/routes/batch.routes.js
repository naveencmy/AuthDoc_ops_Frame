import express from "express"
import { BatchController } from "../controllers/batch.controller.js"
import { upload } from "../middleware/upload.middleware.js"

const router = express.Router()
router.post(
  "/upload",
  upload.single("zip_file"),
  BatchController.createBatch
)
export default router