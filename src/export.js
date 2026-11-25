// Builds Excel and PDF files of a saved collection in the browser. Libraries load only when used.
const COLS = [
  ['Program', 'program', 42],
  ['Funder type', 'level', 12],
  ['Where', 'where', 16],
  ['Hub stage', 'hub_stage', 22],
  ['Pays for', 'funds_what', 50],
  ['Award', 'award_range', 30],
  ['Match', 'match_requirement', 28],
  ['Timing and deadlines', 'cycle_deadline', 45],
  ['Who can apply', 'eligibility_notes', 50],
  ['Link', 'url', 40],
  ['Last checked', 'date_verified', 13],
]

const stamp = () => new Date().toISOString().slice(0, 10)
const rows = (programs, whereOf) => programs.map((p) => COLS.map(([, k]) => (k === 'where' ? whereOf(p) : p[k] || '')))

function save(blob, name) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export async function downloadXlsx(programs, whereOf) {
  const { default: ExcelJS } = await import('exceljs')
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Saved programs', { views: [{ state: 'frozen', ySplit: 1 }] })
  ws.columns = COLS.map(([header, key, width]) => ({ header, key, width }))
  rows(programs, whereOf).forEach((r) => ws.addRow(r))
  const head = ws.getRow(1)
  head.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  head.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F5C5B' } }
  ws.eachRow((row, i) => {
    row.alignment = { vertical: 'top', wrapText: true }
    if (i > 1) {
      const link = row.getCell(10)
      if (/^https?:\/\//.test(link.value)) link.value = { text: link.value, hyperlink: link.value }
    }
  })
  const buf = await wb.xlsx.writeBuffer()
  save(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `hub-directory-saved-${stamp()}.xlsx`)
}

export async function downloadPdf(programs, whereOf) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(31, 92, 91)
  doc.text('The Hub Directory · Saved programs', 36, 40)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(95, 107, 104)
  doc.text(`${programs.length} programs · ${stamp()}`, 36, 56)
  const pick = ['Program', 'Where', 'Hub stage', 'Award', 'Match', 'Timing and deadlines', 'Who can apply', 'Link']
  const idx = pick.map((h) => COLS.findIndex(([c]) => c === h))
  autoTable(doc, {
    startY: 68,
    head: [pick],
    body: rows(programs, whereOf).map((r) => idx.map((i) => r[i])),
    styles: { fontSize: 7.5, cellPadding: 4, valign: 'top', overflow: 'linebreak', textColor: [30, 43, 42] },
    headStyles: { fillColor: [43, 122, 139], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [251, 246, 236] },
    columnStyles: { 0: { cellWidth: 110, fontStyle: 'bold', textColor: [91, 58, 41] }, 1: { cellWidth: 60 }, 2: { cellWidth: 60 }, 7: { cellWidth: 110, textColor: [43, 122, 139] } },
    margin: { left: 36, right: 36 },
  })
  save(doc.output('blob'), `hub-directory-saved-${stamp()}.pdf`)
}
