import { DEBUG, SPREADSHEET_ID, SUBMISSION_SHEET_ID } from "./constants";
import { wrapper } from "./services/error";
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

// Delete all the existing triggers for the project
function deleteTriggers() {
  if (DEBUG) { Logger.log("Deleting all triggers...") }
  let triggers = ScriptApp.getProjectTriggers()
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i])
  }
}

function onEditCustom(e: GoogleAppsScript.Events.SheetsOnEdit) {
  wrapper(() => {
    if (e.source.getActiveSheet().getSheetId() === SUBMISSION_SHEET_ID) {
      onSubmissionSheetEdit(e)
    }
  });
}

// Should be linked to a button on the spreadsheet to sync data manually
function onSyncButtonClick() {
  wrapper(() => {
    if (DEBUG) Logger.log("Sync button clicked.");
    onSync()
  });
}

// Should be linked to a button on the spreadsheet to recalculate data manually
function onRecalculateButtonClick() {
  wrapper(() => {
    if (DEBUG) Logger.log("Recalculate button clicked.");
    onRecalculate()
  });
}