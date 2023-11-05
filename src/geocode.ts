import { isStakeholderApproved } from './helper'
import { HEADQUARTER_COLUMN_NUMBER, LOCATIONS_SERVED_COLUMN_NUMBER, LIST_DELIMETER, HEADQUARTER_COORDINATES_COLUMN_NUMBER, LOCATIONS_SERVED_COORDINATES_COLUMN_NUMBER } from './constants'

// Upon approval,
// Geocodes the headquarters cell and list of communities served cell to coordinates
export function onStakeholderApprovalGeocode(e: GoogleAppsScript.Events.SheetsOnEdit) {
  if (!isStakeholderApproved(e))
    return

  const sheet = e.source.getActiveSheet()
  const row = e.range.getRow()
  
  // Grab addresses
  const headquarterAddress: string = sheet.getRange(row, HEADQUARTER_COLUMN_NUMBER).getValue()
  const locationsServedAddresses: string[] = sheet.getRange(row, LOCATIONS_SERVED_COLUMN_NUMBER).getValue().split(LIST_DELIMETER)

  // Convert the addresses
  const headquarterCoordinates = toCoordinates(headquarterAddress)
  const locationsServedCoordinates = toCoordinatesList(locationsServedAddresses)

  // Put them into coordinate cells
  sheet.getRange(row, HEADQUARTER_COORDINATES_COLUMN_NUMBER).setValue(headquarterCoordinates)
  sheet.getRange(row, LOCATIONS_SERVED_COORDINATES_COLUMN_NUMBER).setValue(locationsServedCoordinates)
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
    throw new Error('Geocoding failed for address: ' + address);
  }

  const location = results[0].geometry.location
  return [location.lat, location.lng]
}