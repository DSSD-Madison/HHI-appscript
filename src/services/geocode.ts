import {
  HEADQUARTER_COLUMN_NUMBER,
  LOCATIONS_SERVED_COLUMN_NUMBER,
  LOCATIONS_SERVED_LIST_DELIMETER,
  HEADQUARTER_COORDINATES_COLUMN_NUMBER,
  LOCATIONS_SERVED_COORDINATES_COLUMN_NUMBER,
  COORDINATES_DELIMETER,
} from "../constants";
import { highlightProcessingError, resetStakeholderStatus } from "./error";

// Upon approval,
// Geocodes the headquarters cell and list of communities served cell to coordinates
// Also sends the updated approved stakeholders sheet to the RTDB
export function geocodeRow(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number
) {
  // Grab addresses
  const headquarterAddress: string = sheet
    .getRange(row, HEADQUARTER_COLUMN_NUMBER)
    .getValue();
  const locationsServedAddresses: string[] = sheet
    .getRange(row, LOCATIONS_SERVED_COLUMN_NUMBER)
    .getValue()
    .split(LOCATIONS_SERVED_LIST_DELIMETER);

  // Convert the addresses
  let headquarterCoordinates: [lat: number, long: number]
  let locationsServedCoordinates: [lat: number, long: number][]
  try {
    headquarterCoordinates = toCoordinates(headquarterAddress);
  }
  catch (e) {
    const message = `Failed to geocode headquarters: ${e.message}`
    Logger.log(message)
    highlightProcessingError(sheet, row, HEADQUARTER_COLUMN_NUMBER, message)
  }

  try {
    locationsServedCoordinates = toCoordinatesList(locationsServedAddresses)
  }
  catch (e) {
    const message = `Failed to geocode locations: ${e.message}`
    Logger.log(message)
    highlightProcessingError(sheet, row, LOCATIONS_SERVED_COLUMN_NUMBER, message)
    resetStakeholderStatus(sheet, row)
    throw new Error(`Geocoding failed. ${message}`)
  }

  // Put them into coordinate cells in the format 'lat, long' and 'lat1, long1;lat2, long2'
  sheet
    .getRange(row, HEADQUARTER_COORDINATES_COLUMN_NUMBER)
    .setValue(`${headquarterCoordinates[0]}, ${headquarterCoordinates[1]}`)
  sheet
    .getRange(row, LOCATIONS_SERVED_COORDINATES_COLUMN_NUMBER)
    .setValue(
      locationsServedCoordinates
        .map((coordinates) => coordinates[0] + COORDINATES_DELIMETER + coordinates[1])
        .join(LOCATIONS_SERVED_LIST_DELIMETER)
    );
}

// Converts an address list to a list of coodinates
function toCoordinatesList(addresses: string[]): [lat: number, long: number][] {
  return addresses.map(toCoordinates)
}

// Converts an address to coordinates lat, long
function toCoordinates(address: string): [lat: number, long: number] {
  const geocoder = Maps.newGeocoder().geocode(address)

  // Fetch the first result from the geocoder
  const results = geocoder.results

  if (results.length == 0) {
    throw new Error("Geocoding failed for address: " + address)
  }

  const location = results[0].geometry.location
  return [location.lat, location.lng]
}
