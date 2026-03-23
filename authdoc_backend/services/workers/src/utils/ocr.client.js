import axios from "axios"

export async function runOCR(imagePath) {
  const response = await axios.post(
    process.env.OCR_SERVICE_URL + "/extract",
    {
      image_path: imagePath
    }
  )
  return response.data
}