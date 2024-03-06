import {
  ADMIN_EMAIL_A1,
  CELL_ERROR_HIGHLIGHT_COLOR_A1,
  DEBUG
} from "../constants";
import { sendEmail } from "./email";
import { getSetting } from "./settings";

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
    .setBackground(getSetting(CELL_ERROR_HIGHLIGHT_COLOR_A1).toString())
    .setNote(message);

  SpreadsheetApp.getUi().alert(
    `An error occurred during processing. ${message}`
  );
}

// A wrapper to catch errors and notify an administrative email about issues
export function wrapper(callback: () => void) {
  try {
    callback();
  } catch (e) {
    sendEmail(getSetting(ADMIN_EMAIL_A1), "Error in trigger", e.message);
    throw e;
  }
}
