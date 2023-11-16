import {
  APPROVED_SHEET_ID,
  COORDINATES_DELIMETER,
  DEBUG,
  HEADQUARTER_COORDINATES_FIELD_NAME,
  LOCATIONS_SERVED_COORDINATES_FIELD_NAME,
  LOCATIONS_SERVED_FIELD_NAME,
  LOCATIONS_SERVED_LIST_DELIMETER,
  REALTIME_DATABASE_URL,
  SPREADSHEET_ID,
  TAGS_FIELD_NAME,
  TAGS_LIST_DELIMETER,
} from "../constants";

// Import approved sheet to RTDB
export function syncApprovedSheet() {
  if (DEBUG) Logger.log("Syncing sheet...")

  // Get appoved sheet
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    .getSheets()
    .filter((s) => s.getSheetId() === APPROVED_SHEET_ID)[0];

  const data = sheet.getDataRange().getValues();

  // First row contains headers
  var headers = data[0];
  var dataToSync = [];

  // Iterate through rows and create an object for each row
  for (var i = 1; i < data.length; i++) {
    const rowData: String[] = data[i];
    const rowObject = {};

    for (var j = 0; j < headers.length; j++) {
      // Handle various types of properties specifically
      // Convert delimeted lists to actual lists
      switch(headers[j]) {
        case TAGS_FIELD_NAME:
          rowObject[headers[j]] = rowData[j].split(TAGS_LIST_DELIMETER)
                                            .map(tag => tag.trim())
          break;
        case HEADQUARTER_COORDINATES_FIELD_NAME:
            rowObject[headers[j]] = coordinateStringToJSON(rowData[j]);
            break;
        case LOCATIONS_SERVED_FIELD_NAME:
          rowObject[headers[j]] = rowData[j].split(LOCATIONS_SERVED_LIST_DELIMETER)
                                            .map(location => location.trim())
          break;
        case LOCATIONS_SERVED_COORDINATES_FIELD_NAME:
          rowObject[headers[j]] = rowData[j].split(LOCATIONS_SERVED_LIST_DELIMETER)
                                            .map(coordinate => coordinate.trim())
                                            .map(coordinateStringToJSON)
          break;
        default:
          rowObject[headers[j]] = rowData[j];
      }
    }

    dataToSync.push(rowObject);
  }

  importData(dataToSync);

  if (DEBUG) Logger.log("Finished syncing sheet.")
}

function coordinateStringToJSON(coordinate: String) {
  const coordinates = coordinate.split(COORDINATES_DELIMETER)
    .map(coordinate => coordinate.trim())
    .map(Number)

  return {
    lat: coordinates[0],
    long: coordinates[1]
  }
}

function importData(dataToImport) {
  const base = FirebaseApp.getDatabaseByUrl(
    REALTIME_DATABASE_URL,
    ScriptApp.getOAuthToken()
  );
  base.setData("", dataToImport);
}
