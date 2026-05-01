import express from "express"
import { SchemaController } from "../controllers/schema.controller.js"

const router = express.Router()
router.post("/",SchemaController.createSchema)
router.get("/",SchemaController.listSchemas)
export default router