import { APPROVAL_COLUMN_NUMBER, CELL_ERROR_HIGHLIGHT_COLOR, FORM_SHEET_ID, SPREADSHEET_ID } from "../constants";

// Highlights a cell and adds a note to it to notify of an error
export function highlightProcessingError(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  column: number,
  message: string
) {
  sheet.getRange(row, column)
    .setBackground(CELL_ERROR_HIGHLIGHT_COLOR.toString())
    .setNote(message)
}

// Reset the status of a stakeholder to a default empty state on error
export function resetStakeholderStatus(row: number) {
  // Get form sheet
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  .getSheets()
  .filter((s) => s.getSheetId() === FORM_SHEET_ID)[0];

  sheet.getRange(row, APPROVAL_COLUMN_NUMBER).setValue('')
}