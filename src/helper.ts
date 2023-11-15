import {
  APPROVED,
  REJECTED,
  FORM_SHEET_ID,
  APPROVAL_COLUMN_NUMBER,
} from "./constants";

const DEBUG = false;

// Check if event is approving a stakeholder
export function isStakeholderApproved(
  e: GoogleAppsScript.Events.SheetsOnEdit
): boolean {
  if (!isStakeholderStatusUpdate(e)) {
    return false;
  }

  return e.range.getValue() === APPROVED;
}

// Check if event is rejecting a stakeholder
export function isStakeholderRejected(
  e: GoogleAppsScript.Events.SheetsOnEdit
): boolean {
  if (!isStakeholderStatusUpdate(e)) {
    return false;
  }

  return e.range.getValue() === REJECTED;
}

// Check if event is updating a stakeholder status
export function isStakeholderStatusUpdate(
  e: GoogleAppsScript.Events.SheetsOnEdit
): boolean {
  const sheet = e.source.getActiveSheet();
  const range = e.range;

  // Check if sheet is the form sheet
  if (sheet.getSheetId() !== FORM_SHEET_ID) {
    if (DEBUG)
      Logger.log(`sheet mismatch ${sheet.getSheetId()}, ${FORM_SHEET_ID}`);
    return false;
  }

  // Ensure range only affects one cell
  if (range.getNumRows() > 1 || range.getNumColumns() > 1) {
    if (DEBUG) Logger.log(`multiple columns affected, ignoring event`);
    return false;
  }

  // Check if column matches the approval column
  if (range.getColumn() !== APPROVAL_COLUMN_NUMBER) {
    if (DEBUG)
      Logger.log(
        `column mismatch ${range.getColumn()}, ${APPROVAL_COLUMN_NUMBER}`
      );
    return false;
  }

  return true;
}

// Delete all the existing triggers for the project
export function deleteTriggers() {
  var triggers = ScriptApp.getProjectTriggers()
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i])
  }
}