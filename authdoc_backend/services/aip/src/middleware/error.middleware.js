import logger from "../config/logger.js"

export function errorMiddleware(err, req, res, next) {
  logger.error({
    message: err.message,
    stack: err.stack
  })

  const status = err.status || 500
  res.status(status).json({
    success:false,
    message: err.message || "Internal server error"
  })
}