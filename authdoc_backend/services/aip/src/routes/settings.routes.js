import express from "express"
import { SettingsController } from "../controllers/settings.controller.js"

const router = express.Router()
router.get("/",SettingsController.listSettings)
router.put("/:key",SettingsController.updateSetting)
export default router