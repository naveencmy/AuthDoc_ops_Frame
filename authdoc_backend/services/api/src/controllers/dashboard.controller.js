import { DashboardService } from "../services/dashboard.service.js"

export class DashboardController {
  static async getStats(req,res,next){
    try{
      const stats = await DashboardService.getStats()
      res.json({
        success:true,
        data:stats
      })
    }catch(err){
      next(err)
    }
  }
}