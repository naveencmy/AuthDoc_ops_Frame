import fs from "fs"
import unzipper from "unzipper"
import path from "path"

export async function unzipImages(zipPath, outputDir) {
  const imagePaths = []
  await fs.createReadStream(zipPath)
    .pipe(unzipper.Parse())
    .on("entry", entry => {
      const fileName = entry.path
      if (/\.(jpg|jpeg|png|tiff)$/i.test(fileName)) {
        const outPath = path.join(outputDir, fileName)
        entry.pipe(fs.createWriteStream(outPath))
        imagePaths.push(outPath)
      } else {
        entry.autodrain()
      }
    })
    .promise()
  return imagePaths
}