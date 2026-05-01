import multer from "multer"
import path from "path"
import fs from "fs"
import env from "../config/env.js"

// 🔥 ALWAYS use absolute path
const uploadDir = path.resolve(env.STORAGE_PATH, "uploads")

// 🔥 ENSURE DIRECTORY EXISTS
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "_" + file.originalname
    cb(null, name)
  }
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype !== "application/zip" &&
    !file.originalname.endsWith(".zip")
  ) {
    return cb(new Error("Only ZIP files allowed"))
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500
  }
})