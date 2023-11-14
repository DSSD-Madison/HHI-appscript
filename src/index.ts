import { SPREADSHEET_ID } from "./constants";
import { onStakeholderUpdateEmail } from "./email";
import { onStakeholderApprovalGeocode } from "./geocode";
import { importSheet } from "./rtdb";
import { deleteTriggers } from "./helper";

// A placeholder function to ensure that triggers are included
function placeholderFunction() {
  onStakeholderApprovalGeocode(null);
  onStakeholderUpdateEmail(null);
  importSheet(null);
}

function createTriggers() {
  deleteTriggers()
 
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  ScriptApp.newTrigger("onStakeholderUpdateEmail")
    .forSpreadsheet(spreadsheet)
    .onEdit()
    .create()
  
  ScriptApp.newTrigger("onStakeholderApprovalGeocode")
    .forSpreadsheet(spreadsheet)
    .onEdit()
    .create()

  ScriptApp.newTrigger("importSheet")
    .forSpreadsheet(spreadsheet)
    .onChange()
    .create();
}

createTriggers();