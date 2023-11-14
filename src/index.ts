import { SPREADSHEET_ID } from "./constants";
import { onStakeholderUpdateEmail } from "./email";
import { onStakeholderApprovalGeocodeAndSync } from "./geocodeAndSync";
import { deleteTriggers } from "./helper";
import { onStakeholderRejectionSync } from "./rtdb";

// A placeholder function to ensure that triggers are included
function placeholderFunction() {
  onStakeholderApprovalGeocodeAndSync(null);
  onStakeholderUpdateEmail(null);
  onStakeholderRejectionSync(null);
}

function createTriggers() {
  deleteTriggers()
 
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  ScriptApp.newTrigger("onStakeholderUpdateEmail")
    .forSpreadsheet(spreadsheet)
    .onEdit()
    .create()
  
  ScriptApp.newTrigger("onStakeholderApprovalGeocodeAndSync")
    .forSpreadsheet(spreadsheet)
    .onEdit()
    .create()

  ScriptApp.newTrigger("onStakeholderRejectionSync")
    .forSpreadsheet(spreadsheet)
    .onEdit()
    .create()
}