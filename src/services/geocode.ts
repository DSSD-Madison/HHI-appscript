import { DEBUG } from "../constants";

// Converts an address list to a list of coodinates
export function toCoordinatesList(addresses: string[]): [lat: number, lng: number][] {
  return addresses.map(toCoordinates);
}

// Converts an address to coordinates lat, lng
export function toCoordinates(address: string): [lat: number, lng: number] {
  if (address.length == 0) {
    throw new Error(
      "Cannot geocode an empty string (check for an accidental repeated delimeter use or use at the end)"
    );
  }

  if (DEBUG) Logger.log(`Geocoding address: ${address}`);

  const geocoder = Maps.newGeocoder().geocode(address);

  // Fetch the first result from the geocoder
  const results = geocoder.results;

  if (DEBUG) Logger.log(`Geocoding response: ${results}`);

  if (results.length == 0) {
    throw new Error(`Geocoding failed for address: ${address}`);
  }

  const location = results[0].geometry.location;
  return [location.lat, location.lng];
}
