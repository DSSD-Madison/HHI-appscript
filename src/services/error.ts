import { ADMIN_EMAIL, CELL_ERROR_HIGHLIGHT_COLOR, DEBUG } from "../constants";
import { sendEmail } from "./email";

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

// A wrapper to catch errors and notify an administrative email about issues
export function wrapper(callback: () => void) {
  try {
    callback()
  } catch (e) {
    sendEmail("Error in trigger", e.message, ADMIN_EMAIL)
    throw new Error(e.message)
  }
}