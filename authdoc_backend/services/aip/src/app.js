import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { requestLogger } from "./middleware/request.logger.js"
import { errorMiddleware } from "./middleware/error.middleware.js"

import batchRoutes from "./routes/batch.routes.js"
import documentRoutes from "./routes/document.routes.js"
import schemaRoutes from "./routes/schema.routes.js"
import exportRoutes from "./routes/export.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"
import settingsRoutes from "./routes/settings.routes.js"

const app = express()
app.use(helmet())
app.use(rateLimit({
    window:60*1000,
    max:100
}))
app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.json({
    limit:"10mb"
}))
app.use(requestLogger)
app.get("/health",(req,res)=>{
    res.json({status:"ok"})
})

app.use("/api/batches", batchRoutes)
app.use("/api/documents", documentRoutes)
app.use("/api/schemas", schemaRoutes)
app.use("/api/exports", exportRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/settings", settingsRoutes)
app.use(errorMiddleware)
export default app