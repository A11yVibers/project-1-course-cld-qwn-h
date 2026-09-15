/**
 * Minimal RFC 4180-style CSV parser.
 * Handles quoted fields, embedded commas, embedded newlines, and doubled quotes.
 */
export function parseCsvRows(text) {
  const source = String(text).replace(/^﻿/, '').replace(/\r\n?/g, '\n')
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < source.length; i += 1) {
    const char = source[i]
    if (inQuotes) {
      if (char === '"') {
        if (source[i + 1] === '"') {
          field += '"'
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows.filter((cells) => cells.length > 1 || (cells.length === 1 && cells[0].trim() !== ''))
}

/** Parse CSV text into an array of objects keyed by the header row. */
export function parseCsv(text) {
  const rows = parseCsvRows(text)
  if (rows.length === 0) return []
  const headers = rows[0].map((header) => header.trim())
  return rows.slice(1).map((cells) => {
    const record = {}
    headers.forEach((header, index) => {
      record[header] = (cells[index] ?? '').trim()
    })
    return record
  })
}
