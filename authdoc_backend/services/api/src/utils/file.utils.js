import fs from "fs"
import path from "path"
import env from "../config/env.js"

export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

export function getBatchStoragePath(batchId) {
  const dir = path.join(env.STORAGE_PATH, "uploads", "batches", batchId)
  ensureDir(dir)
  return dir
}