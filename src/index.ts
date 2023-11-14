import { APPROVED_SHEET_ID, FORM_SHEET_ID } from "./constants";
import { onStakeholderUpdateEmail } from "./email";
import { onStakeholderApprovalGeocode } from "./geocode";
import { importSheet } from "./rtdb";
import { deleteTriggers } from "./helper";

// A placeholder function to ensure that triggers are included
function placeholderFunction() {
  onStakeholderApprovalGeocode(null);
  onStakeholderUpdateEmail(null);
  importSheet();
}

function createTriggers() {
  deleteTriggers();
 
  const formSpreadsheet = SpreadsheetApp.openById(FORM_SHEET_ID.toString());
  ScriptApp.newTrigger("onStakeholderUpdateEmail")
    .forSpreadsheet(formSpreadsheet)
    .onEdit()
    .create();
  
  ScriptApp.newTrigger("onStakeholderApprovalGeocode")
    .forSpreadsheet(formSpreadsheet)
    .onEdit()
    .create();

  const approvedSpreadsheet = SpreadsheetApp.openById(APPROVED_SHEET_ID.toString());
  ScriptApp.newTrigger("importSheet")
    .forSpreadsheet(approvedSpreadsheet)
    .onChange()
    .create();
}

createTriggers();