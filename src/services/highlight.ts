import { CELL_ERROR_HIGHLIGHT_COLOR } from "../constants";

// Highlights a cell and adds a note to it
export function highlightErrorCell(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  column: number,
  message: string
) {
  sheet.getRange(row, column)
    .setBackground(CELL_ERROR_HIGHLIGHT_COLOR.toString())
    .setNote(message)
}