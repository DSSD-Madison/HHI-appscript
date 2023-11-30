import {
  HEADQUARTER_COLUMN_NUMBER,
  LOCATIONS_SERVED_COLUMN_NUMBER,
  LOCATIONS_SERVED_LIST_DELIMETER,
  HEADQUARTER_COORDINATES_COLUMN_NUMBER,
  LOCATIONS_SERVED_COORDINATES_COLUMN_NUMBER,
  COORDINATES_DELIMETER,
  DEBUG,
} from "../constants";
import { highlightProcessingError, resetStakeholderStatus } from "./error";

// Upon approval,
// Geocodes the headquarters cell and list of communities served cell to coordinates
// Also sends the updated approved stakeholders sheet to the RTDB
export function geocodeRow(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number
) {
  if (DEBUG) Logger.log("Geocoding row...")

  // Grab addresses
  const headquarterAddress: string = sheet
    .getRange(row, HEADQUARTER_COLUMN_NUMBER)
    .getValue();

  // Checking if this is empty, as splitting on an empty string results in length 1
  const locationsServedAddressesString = sheet
    .getRange(row, LOCATIONS_SERVED_COLUMN_NUMBER)
    .getValue()
  
  const locationsServedAddresses: string[] = locationsServedAddressesString
    .split(LOCATIONS_SERVED_LIST_DELIMETER);

  // Convert the addresses
  let headquarterCoordinates: [lat: number, lng: number]
  try {
    headquarterCoordinates = toCoordinates(headquarterAddress);
  }
  catch (e) {
    const message = `Failed to geocode headquarters: `
    Logger.log(message + e)
    highlightProcessingError(sheet, row, HEADQUARTER_COLUMN_NUMBER, message)
    resetStakeholderStatus(row)
    throw new Error(`Geocoding failed. ${message + e.message}`)
  }

  let locationsServedCoordinates: [lat: number, lng: number][] = []
  if (locationsServedAddressesString.length > 0) {
    if (DEBUG) Logger.log("Geocoding locations served...")
    try {
      locationsServedCoordinates = toCoordinatesList(locationsServedAddresses)
    }
    catch (e) {
      const message = `Failed to geocode locations: `
      Logger.log(message + e)
      highlightProcessingError(sheet, row, LOCATIONS_SERVED_COLUMN_NUMBER, message)
      resetStakeholderStatus(row)
      throw new Error(`Geocoding failed. ${message + e.message}`)
    }  
  }

  // Put them into coordinate cells in the format 'lat, lng' and 'lat1, lng1;lat2, lng2'
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
  
  if (DEBUG) Logger.log("Finished geocoding row.")
}

// Converts an address list to a list of coodinates
function toCoordinatesList(addresses: string[]): [lat: number, lng: number][] {
  return addresses.map(toCoordinates)
}

// Converts an address to coordinates lat, lng
function toCoordinates(address: string): [lat: number, lng: number] {
  const geocoder = Maps.newGeocoder().geocode(address)

  // Fetch the first result from the geocoder
  const results = geocoder.results

  if (results.length == 0) {
    throw new Error("Geocoding failed for address: " + address)
  }

  const location = results[0].geometry.location
  return [location.lat, location.lng]
}
