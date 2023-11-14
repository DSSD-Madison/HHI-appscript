import { APPROVED_SHEET_ID, REALTIME_DATABASE_URL, SPREADSHEET_ID } from "./constants";
import { isStakeholderRejected, isStakeholderStatusUpdate } from "./helper";


// Upon rejection,
// Updates the RTDB to remove the column in the approved sheet
export function onStakeholderRejectionSync(e: GoogleAppsScript.Events.SheetsOnEdit) {
  if (!isStakeholderRejected(e))
    return

  syncApprovedSheet()
}

// Import approved sheet to RTDB
export function syncApprovedSheet() {
  // Get appoved sheet
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    .getSheets()
    .filter(s => s.getSheetId() === APPROVED_SHEET_ID)[0]

  const data = sheet.getDataRange().getValues()

  // First row contains headers
  var headers = data[0];
  var dataToSync = [];

  // Iterate through rows and create an object for each row
  for (var i = 1; i < data.length; i++) {
    var rowData = data[i];
    var rowObject = {};

    for (var j = 0; j < headers.length; j++) {
      rowObject[headers[j]] = rowData[j];
    }

    dataToSync.push(rowObject);
  }

  importData(dataToSync)
}

function importData(dataToImport) {
  const base = FirebaseApp.getDatabaseByUrl(REALTIME_DATABASE_URL, ScriptApp.getOAuthToken());
  base.setData("", dataToImport);
}