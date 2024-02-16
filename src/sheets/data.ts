/**
 * Represents the Data Sheet. The Data Sheet contains
 * - For each row, extra fields that needed to be computed
 * - A global "sync" button. When clicked, it should attempt to sync all rows.
 *
 * What is syncing?
 * For each row to be synced, it should
 * - Convert any rows necessary
 * - Push the data up to Firebase Realtime Database
 *
 * If a failure occurs, the sync should be stopped and the error highlighted
 */

import {
  COORDINATES_DELIMETER,
  DATA_SHEET_ID,
  DEBUG,
  GLOBAL_COLUMN_NUMBER,
  HEADQUARTER_COLUMN_NUMBER,
  HEADQUARTER_COORDINATES_COLUMN_NUMBER,
  LOCATIONS_SERVED_COLUMN_NUMBER,
  LOCATIONS_SERVED_COORDINATES_COLUMN_NUMBER,
  LOCATIONS_SERVED_LIST_DELIMETER,
  TAGS_COLUMN_NUMBER,
  TAGS_LIST_DELIMETER,
} from "../constants";
import { sendData } from "../services/database";
import {
  highlightProcessingError,
} from "../services/error";
import { toCoordinates, toCoordinatesList } from "../services/geocode";
import { isRowChanged, setRow } from "../services/property";

export function onSync() {
  if (DEBUG) Logger.log("Syncing data...");

  const sheet = SpreadsheetApp.getActive()
    .getSheets()
    .find((s) => s.getSheetId() === DATA_SHEET_ID);

  onRecalculate();
  
  SpreadsheetApp.flush();
  if (DEBUG) Logger.log(getData(sheet));
  sendData(getData(sheet))

  SpreadsheetApp.getUi().alert("Synced all data successfully.")
  if (DEBUG) Logger.log("Data synced.");
}

export function onRecalculate() {
  if (DEBUG) Logger.log("Recalculating data...");

  const sheet = SpreadsheetApp.getActive()
    .getSheets()
    .find((s) => s.getSheetId() === DATA_SHEET_ID);

  const rows = sheet.getDataRange().getValues();
  rows.shift(); // skip headers

  let rowsUpdated = 0;

  rows.forEach((d, i) => {
    // 1-based index conversion + accounting for header
    const row = i + 2;
    if (isRowChanged(row, d)) {
      if (DEBUG) Logger.log(`Row ${row} changed. Recalculating fields...`);
      rowsUpdated += 1;

      calculateRowFields(sheet, row);
      
      SpreadsheetApp.flush();
      const newData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

      setRow(row, newData)
    }
    else {
      if (DEBUG) Logger.log(`No change for row ${row}`);
    }
  })

  SpreadsheetApp.getUi().alert(`Recalculated data. Updated ${rowsUpdated} row(s).`)
  if (DEBUG) Logger.log("Data recalculated.");
}

function calculateRowFields(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number
) {
  if (DEBUG) Logger.log("Calculating row fields...");

  geocodeHeadquarters(sheet, row);
  geocodeLocationsServed(sheet, row);
  calculateGlobal(sheet, row);

  if (DEBUG) Logger.log("Finished calculating row fields.");
}

function geocodeHeadquarters(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number
) {
  const headquarterAddress: string = sheet
    .getRange(row, HEADQUARTER_COLUMN_NUMBER)
    .getValue();
  
  if (DEBUG) Logger.log(headquarterAddress)

  let headquarterCoordinates: [lat: number, lng: number];

  try {
    headquarterCoordinates = toCoordinates(headquarterAddress);
  } catch (e) {
    const message = `Failed to geocode headquarters: ${e.message}`;
    Logger.log(message);
    highlightProcessingError(sheet, row, HEADQUARTER_COLUMN_NUMBER, message);
    throw new Error(`Geocoding failed. ${message}`);
  }

  sheet
    .getRange(row, HEADQUARTER_COORDINATES_COLUMN_NUMBER)
    .setValue(
      headquarterCoordinates[0] +
        COORDINATES_DELIMETER +
        headquarterCoordinates[1]
    );
}

function geocodeLocationsServed(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number
) {
  const locationsServedAddresses: string[] = sheet
    .getRange(row, LOCATIONS_SERVED_COLUMN_NUMBER)
    .getValue()
    .split(LOCATIONS_SERVED_LIST_DELIMETER)
    .filter(s => s !== '');

  if (DEBUG) Logger.log(locationsServedAddresses)

  let locationsServedCoordinates: [lat: number, lng: number][] = [];

  if (locationsServedAddresses.length !== 0) {
    try {
      locationsServedCoordinates = toCoordinatesList(locationsServedAddresses);
    } catch (e) {
      const message = `Failed to geocode locations: ${e.message}`;
      Logger.log(message);
      highlightProcessingError(
        sheet,
        row,
        LOCATIONS_SERVED_COLUMN_NUMBER,
        message
      );
      throw new Error(`Geocoding failed. ${message}`);
    }
  }

  sheet
    .getRange(row, LOCATIONS_SERVED_COORDINATES_COLUMN_NUMBER)
    .setValue(
      locationsServedCoordinates
        .map(
          (coordinates) =>
            coordinates[0] + COORDINATES_DELIMETER + coordinates[1]
        )
        .join(LOCATIONS_SERVED_LIST_DELIMETER)
    );
}

function calculateGlobal(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number
) {
  const locationsServedAddresses: string[] = sheet
    .getRange(row, LOCATIONS_SERVED_COLUMN_NUMBER)
    .getValue()
    .split(LOCATIONS_SERVED_LIST_DELIMETER)
    .filter(s => s !== '');

  // Whether or not the organization has a global presence.
  // True only if locations served is blank
  const global = locationsServedAddresses.length === 0;

  sheet.getRange(row, GLOBAL_COLUMN_NUMBER).setValue(global);
}

function getData(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
  const rows = sheet.getDataRange().getValues();

  let headers = rows.shift();
  let dataToSync = [];

  // Iterate through rows and create an object for each row
  rows.forEach((row) => {
    const rowObject = {};

    // Create direct mapping
    row.forEach((data, i) => {
      rowObject[headers[i]] = data
    })

    // Handle various types of properties specifically
    // Convert delimeted lists to actual lists
    const tagIndex = columnNumberToIndex(TAGS_COLUMN_NUMBER);
    rowObject[headers[tagIndex]] = row[tagIndex]
      .split(TAGS_LIST_DELIMETER)
      .filter(s => s !== '')
      .map((tag) => tag.trim());

    const hqcIndex = columnNumberToIndex(HEADQUARTER_COORDINATES_COLUMN_NUMBER);
    rowObject[headers[hqcIndex]] = coordinateStringToJSON(row[hqcIndex]);

    const lsIndex = columnNumberToIndex(LOCATIONS_SERVED_COLUMN_NUMBER);
    rowObject[headers[lsIndex]] = row[lsIndex]
      .split(LOCATIONS_SERVED_LIST_DELIMETER)
      .filter(s => s !== '')
      .map((location) => location.trim());

    const lscIndex = columnNumberToIndex(
      LOCATIONS_SERVED_COORDINATES_COLUMN_NUMBER
    );
    rowObject[headers[lscIndex]] = row[lscIndex]
      .split(LOCATIONS_SERVED_LIST_DELIMETER)
      .filter(s => s !== '')
      .map((coordinate) => coordinate.trim())
      .map(coordinateStringToJSON);

    dataToSync.push(rowObject);
  });

  return dataToSync;
}

function columnNumberToIndex(columnNumber: number) {
  return columnNumber - 1;
}

function coordinateStringToJSON(coordinate: String) {
  const coordinates = coordinate
    .split(COORDINATES_DELIMETER)
    .filter(s => s !== '')
    .map((coordinate) => coordinate.trim())
    .map(Number);

  return {
    lat: coordinates[0],
    lng: coordinates[1],
  };
}
