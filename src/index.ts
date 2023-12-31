import { ADMIN_EMAIL, SPREADSHEET_ID } from "./constants";
import { mailToRow, sendEmail } from "./services/email";
import { geocodeRow } from "./services/geocode";
import { deleteTriggers, isStakeholderApproved, isStakeholderRejected, isStakeholderStatusUpdate } from "./helper";
import { syncApprovedSheet } from "./services/rtdb";

function createTriggers() {
  deleteTriggers()
 
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)

  const editTriggers = [
    onStakeholderUpdateEmail.name,
    onStakeholderApprovalGeocodeAndSync.name,
    onStakeholderNonApprovalSync.name
  ]

  editTriggers.forEach(trigger => {
    ScriptApp.newTrigger(trigger)
      .forSpreadsheet(spreadsheet)
      .onEdit()
      .create()
  })
}

// A wrapper for triggers to catch errors, log them, and notify an administrative email about issues
function triggerWrapper(triggerCallback: () => void) {
  try {
    triggerCallback()
  } catch (e) {
    console.error(e)
    sendEmail("Error in trigger", e.message, ADMIN_EMAIL)
  }
}

// Upon approval or rejection,
// Sends an email to the stakeholder informing them, providing a reason if it is a rejection
function onStakeholderUpdateEmail(e: GoogleAppsScript.Events.SheetsOnEdit) {
  triggerWrapper(() => {
    if (!isStakeholderStatusUpdate(e))
      return

    const sheet = e.source.getActiveSheet()
    const row = e.range.getRow()

    let approved = false

    if (isStakeholderApproved(e)) approved = true
    else if (isStakeholderRejected(e)) approved = false
    else return // If neither rejected/approved, set to a default false

    mailToRow(sheet, row, approved)
  })
}

// Upon approval,
// Geocodes the headquarters cell and list of communities served cell to coordinates
// Also sends the updated approved stakeholders sheet to the RTDB
function onStakeholderApprovalGeocodeAndSync(e: GoogleAppsScript.Events.SheetsOnEdit) {
  triggerWrapper(() => {
    if (!isStakeholderApproved(e))
      return
    
    const sheet = e.source.getActiveSheet()
    const row = e.range.getRow()
    
    geocodeRow(sheet, row)

    // persist changes
    SpreadsheetApp.flush()

    syncApprovedSheet()
  })
}

// Upon nonapproval,
// Updates the RTDB to remove the column in the approved sheet
function onStakeholderNonApprovalSync(e: GoogleAppsScript.Events.SheetsOnEdit) {
  triggerWrapper(() => {
    if (!isStakeholderStatusUpdate(e) || isStakeholderApproved(e))
      return

    syncApprovedSheet()
  })
}