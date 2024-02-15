import { CELL_ERROR_HIGHLIGHT_COLOR, DEBUG } from "../constants";

// Highlights a cell and adds a note to it to notify of an error
export function highlightProcessingError(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  column: number,
  message: string
) {
  if (DEBUG) Logger.log("Highlighting processing error.");

  sheet
    .getRange(row, column)
    .setBackground(CELL_ERROR_HIGHLIGHT_COLOR.toString())
    .setNote(message);

  SpreadsheetApp.getUi().alert(`An error occurred during processing. ${message}`);
}
