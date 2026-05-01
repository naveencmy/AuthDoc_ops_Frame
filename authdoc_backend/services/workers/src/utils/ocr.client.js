import axios from "axios"
import FormData from "form-data"
import fs from "fs"

export async function runOCR(imagePath, schema) {
  const form = new FormData()

  form.append("file", fs.createReadStream(imagePath))
  form.append("schema_json", JSON.stringify(schema))

  const response = await axios.post(
    process.env.OCR_SERVICE_URL + "/extract",
    form,
    {
      headers: form.getHeaders(),
      maxBodyLength: Infinity
    }
  )

  return response.data
}