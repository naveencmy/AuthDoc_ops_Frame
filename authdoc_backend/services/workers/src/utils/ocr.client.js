import axios from "axios"
import FormData from "form-data"
import fs from "fs"

export async function runOCR(imagePath, schema) {
  // Validate file exists
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image file not found: ${imagePath}`)
  }

  const form = new FormData()

  form.append("file", fs.createReadStream(imagePath))
  form.append("schema_json", JSON.stringify(schema))

  try {
    const ocrUrl = process.env.OCR_SERVICE_URL?.endsWith("/extract")
      ? process.env.OCR_SERVICE_URL
      : `${process.env.OCR_SERVICE_URL}/extract`

    console.log("[OCR Client] Sending request to OCR service")
    console.log("[OCR Client] URL:", ocrUrl)
    console.log("[OCR Client] Image:", imagePath)
    console.log("[OCR Client] Schema fields count:", schema.length)
    console.log("[OCR Client] Schema details:")
    schema.forEach(f => {
      console.log(`  - ${f.field_name} (${f.data_type}, required: ${f.required})`)
    })

    const response = await axios.post(ocrUrl, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      timeout: 60000  // Increased timeout for large images
    })

    console.log("[OCR Client]  Response received:", response.status)
    if (response.data?.fields) {
      console.log("[OCR Client] Fields extracted:", Object.keys(response.data.fields).length)
    }
    if (!response.data?.fields) {
      console.warn("[OCR Client]  Response missing 'fields' field")
    }
    return response.data
  } catch (error) {
    console.error("[OCR Client]  Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    })
    
    // Provide helpful error messages
    if (error.code === "ECONNREFUSED") {
      throw new Error(`Cannot connect to OCR service at ${process.env.OCR_SERVICE_URL}. Is it running?`)
    }
    if (error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") {
      throw new Error(`OCR service timeout. The service may be overloaded or unresponsive.`)
    }
    
    throw error
  }
}