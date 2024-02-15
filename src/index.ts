import { DEBUG, SPREADSHEET_ID, SUBMISSION_SHEET_ID } from "./constants";
import { deleteTriggers } from "./helper";
import { onRecalculate, onSync } from "./sheets/data";
import { onSubmissionSheetEdit } from "./sheets/submission";


// Resets and creates desired triggers
function resetTriggers() {
  deleteTriggers()
 
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)

  ScriptApp.newTrigger(onEditCustom.name)
    .forSpreadsheet(spreadsheet)
    .onEdit()
    .create();
}

function onEditCustom(e: GoogleAppsScript.Events.SheetsOnEdit) {
  if (e.source.getActiveSheet().getSheetId() === SUBMISSION_SHEET_ID) {
    onSubmissionSheetEdit(e)
  }
}

// Should be linked to a button on the spreadsheet to sync data manually
function onSyncButtonClick() {
  if (DEBUG) Logger.log("Sync button clicked.");
  onSync()
}

// Should be linked to a button on the spreadsheet to recalculate data manually
function onRecalculateButtonClick() {
  if (DEBUG) Logger.log("Recalculate button clicked.");
  onRecalculate()
}