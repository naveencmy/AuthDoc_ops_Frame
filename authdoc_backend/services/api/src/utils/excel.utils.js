import ExcelJS from "exceljs"

export async function generateExcel(filePath, rows){
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet("documents")
  if(rows.length === 0){
    await workbook.xlsx.writeFile(filePath)
    return
  }
  sheet.columns = Object.keys(rows[0]).map(key=>({
    header:key,
    key:key
  }))
  rows.forEach(row=>{
    sheet.addRow(row)
  })
  await workbook.xlsx.writeFile(filePath)
}