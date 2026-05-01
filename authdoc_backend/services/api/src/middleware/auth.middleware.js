import jwt from "jsonwebtoken"
import env from "../config/env.js"

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({
        success:false,
        message:"Authorization header missing"
      })
    }
    const token = authHeader.split(" ")[1]
    if (!token) {
      return res.status(401).json({
        success:false,
        message:"Token missing"
      })
    }
    const decoded = jwt.verify(
      token,
      env.JWT_SECRET
    )
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({
      success:false,
      message:"Invalid or expired token"
    })
  }
}

export function requireRole(role){
  return (req,res,next)=>{
    if(!req.user){
      return res.status(401).json({
        success:false,
        message:"Unauthorized"
      })
    }
    if(req.user.role !== role){
      return res.status(403).json({
        success:false,
        message:"Forbidden"
      })
    }
    next()
  }
}