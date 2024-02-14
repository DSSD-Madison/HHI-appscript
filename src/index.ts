import { DEBUG, SPREADSHEET_ID, SUBMISSION_SHEET_ID } from "./constants";
import { deleteTriggers, triggerWrapper } from "./helper";
import { onSubmissionSheetEdit } from "./sheets/submission";


// Create all relevant triggers
function createTriggers() {
  deleteTriggers()
 
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)

  if (DEBUG) { Logger.log ("Creating triggers...")}

  ScriptApp.newTrigger(onEdit.name)
    .forSpreadsheet(spreadsheet)
    .onEdit()
    .create();
}

function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit) {
  if (e.source.getActiveSheet().getSheetId() === SUBMISSION_SHEET_ID) {
    onSubmissionSheetEdit(e)
  }
}
