import fs from "fs"
import unzipper from "unzipper"
import path from "path"

export async function unzipImages(zipPath, outputDir) {
  const imagePaths = []

  // ensure base output directory exists
  fs.mkdirSync(outputDir, { recursive: true })

  await fs.createReadStream(zipPath)
    .pipe(unzipper.Parse())
    .on("entry", entry => {
      const fileName = entry.path

      if (/\.(jpg|jpeg|png|tiff)$/i.test(fileName)) {
        const outPath = path.join(outputDir, fileName)

        // ensure nested directories exist
        fs.mkdirSync(path.dirname(outPath), { recursive: true })

        entry.pipe(fs.createWriteStream(outPath))
        imagePaths.push(outPath)
      } else {
        entry.autodrain()
      }
    })
    .promise()

  return imagePaths
}