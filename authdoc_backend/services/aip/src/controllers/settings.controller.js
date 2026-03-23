import { SettingsService } from "../services/settings.service.js"
export class SettingsController {
  static async listSettings(req,res,next){
    try{
      const settings = await SettingsService.listSettings()
      res.json({
        success:true,
        data:settings
      })
    }catch(err){
      next(err)
    }
  }
  static async updateSetting(req,res,next){
    try{
      const { key } = req.params
      const { value } = req.body
      const setting = await SettingsService.updateSetting(
        key,
        value
      )
      res.json({
        success:true,
        data:setting
      })
    }catch(err){
      next(err)
    }
  }
}