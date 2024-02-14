import {
  APPROVED,
  REJECTED,
  SUBMISSION_SHEET_ID,
  STATUS_COLUMN_NUMBER,
  DEBUG,
  ADMIN_EMAIL,
} from "./constants";
import { sendEmail } from "./services/email";

// Delete all the existing triggers for the project
export function deleteTriggers() {
  if (DEBUG) { Logger.log("Deleting all triggers...") }
  let triggers = ScriptApp.getProjectTriggers()
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i])
  }
}

// A wrapper for triggers to catch errors, log them, and notify an administrative email about issues
export function triggerWrapper(triggerCallback: () => void) {
  try {
    triggerCallback()
  } catch (e) {
    console.error(e)
    sendEmail("Error in trigger", e.message, ADMIN_EMAIL)
  }
}

// Check if event is approving a submission
export function isSubmissionApproved(
  e: GoogleAppsScript.Events.SheetsOnEdit
): boolean {
  if (!isSubmissionStatusUpdate(e)) {
    return false;
  }

  return e.range.getValue() === APPROVED;
}

// Check if event is rejecting a stakeholder
export function isSubmissionRejected(
  e: GoogleAppsScript.Events.SheetsOnEdit
): boolean {
  if (!isSubmissionStatusUpdate(e)) {
    return false;
  }

  return e.range.getValue() === REJECTED;
}

// Check if event is updating a stakeholder status
function isSubmissionStatusUpdate(
  e: GoogleAppsScript.Events.SheetsOnEdit
): boolean {
  const sheet = e.source.getActiveSheet();
  const range = e.range;

  // Check if sheet is the form sheet
  if (sheet.getSheetId() !== SUBMISSION_SHEET_ID) {
    if (DEBUG)
      Logger.log(`sheet mismatch ${sheet.getSheetId()}, ${SUBMISSION_SHEET_ID}`);
    return false;
  }

  // Ensure range only affects one cell
  if (range.getNumRows() > 1 || range.getNumColumns() > 1) {
    if (DEBUG) Logger.log(`multiple columns affected, ignoring event`);
    return false;
  }

  // Check if column matches the approval column
  if (range.getColumn() !== STATUS_COLUMN_NUMBER) {
    if (DEBUG)
      Logger.log(
        `column mismatch ${range.getColumn()}, ${STATUS_COLUMN_NUMBER}`
      );
    return false;
  }

  return true;
}

