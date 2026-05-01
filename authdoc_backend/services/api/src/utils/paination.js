export function getPagination(query) {

  const page = Math.max(parseInt(query.page || 1), 1)
  const limit = Math.min(parseInt(query.limit || 20), 100)
  const offset = (page - 1) * limit
  return { page, limit, offset }
}