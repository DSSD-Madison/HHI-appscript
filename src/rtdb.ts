// Modified code from https://medium.com/firebase-developers/sheets-to-firebase-33132e31935b

import { APPROVED_SHEET_ID, REALTIME_DATABASE_URL } from "./constants";

// Import each sheet when there is a change
export function importSheet(e: GoogleAppsScript.Events.SheetsOnChange) {
  const sheet = e.source.getActiveSheet();

  // Check if sheet is the approved sheet
  if (sheet.getSheetId() !== APPROVED_SHEET_ID) {
    return false;
  }

  // const name = sheet.getName();
  const data = sheet.getDataRange().getValues();

  const dataToImport = {};

  for (let i = 1; i < data.length; i++) {
    dataToImport[data[i][0]] = {};
    for (let j = 0; j < data[0].length; j++) {
      assign(dataToImport[data[i][0]], data[0][j].split("__"), data[i][j]);
    }
  }

  const firebaseUrl = REALTIME_DATABASE_URL + sheet.getParent().getId(); // + "/" + name;

  const token = ScriptApp.getOAuthToken();

  importData(dataToImport, firebaseUrl, token);
}

function importData(dataToImport, firebaseUrl: string, token: string) {
  const base = FirebaseApp.getDatabaseByUrl(firebaseUrl, token);
  base.setData("", dataToImport);
}


// A utility function to generate nested object when
// given a keys in array format
function assign(obj, keyPath, value) {
  const lastKeyIndex = keyPath.length - 1;
  for (var i = 0; i < lastKeyIndex; ++i) {
    const key = keyPath[i];
    if (!(key in obj)) obj[key] = {};
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
}