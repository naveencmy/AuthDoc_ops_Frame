export function extractFields(rawText, schemaFields) {
  const results = []
  for (const field of schemaFields) {
    const keyword = field.mapping_keywords
    const regex = new RegExp(keyword + "\\s*(.*)", "i")
    const match = rawText.match(regex)
    if (match) {
      results.push({
        field_name: field.field_name,
        field_value: match[1].trim(),
        confidence_score: 0.8
      })
    } else {
      results.push({
        field_name: field.field_name,
        field_value: null,
        confidence_score: 0
      })
    }
  }
  return results
}