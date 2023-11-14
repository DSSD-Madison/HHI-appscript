import { REALTIME_DATABASE_URL } from "./constants";


// Import each sheet when there is a change
export function importSheet() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var name = sheet.getName();
  var data = sheet.getDataRange().getValues();

  var dataToImport = {};

  for (var i = 1; i < data.length; i++) {
    dataToImport[data[i][0]] = {};
    for (var j = 0; j < data[0].length; j++) {
      assign(dataToImport[data[i][0]], data[0][j].split("__"), data[i][j]);
    }
  }

  var token = ScriptApp.getOAuthToken();

  var firebaseUrl =
    REALTIME_DATABASE_URL + sheet.getParent().getId() + "/" + name;
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, token);
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