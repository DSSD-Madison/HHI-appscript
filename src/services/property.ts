/**
 * Uses the built-in Spreadsheet Properties to store data
 * Hashes rows into an SHA-256 hash to detect changes
 * 500KB limit total, see below link:
 * https://developers.google.com/apps-script/guides/services/quotas
 */

import { DEBUG } from "../constants";

const ROW_PROPERTY_FORMAT = "row_"

export function isRowChanged(row: number, value: object) {
  const hash = getRow(row);
  const newHash = hashRow(value);

  if (DEBUG) Logger.log(`Comparing hashes ${hash} and ${newHash}`)
  return hash !== newHash;
}

function getRow(row: number) {
  if (DEBUG) Logger.log(`Retrieving row ${row}`)
  const properties = PropertiesService.getScriptProperties();
  const key = `${ROW_PROPERTY_FORMAT}${row}`
  
  // returns null if key isn't present
  return properties.getProperty(key);
}

export function setRow(row: number, value) {
  if (DEBUG) Logger.log(`Setting row ${row} with value ${value}`)
  const properties = PropertiesService.getScriptProperties();
  const key = `${ROW_PROPERTY_FORMAT}${row}`

  const hashed = hashRow(value)

  properties.setProperty(key, hashed);
}

function hashRow(row: object) {
  if (DEBUG) Logger.log(`Hashing value ${row}`)

  const signature = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(row));

  return signature.map((byte) => {
    // Convert from 2's compliment
    const v = (byte < 0) ? 256 + byte : byte;

    // Convert byte to hexadecimal
    return ("0" + v.toString(16)).slice(-2);
  })
  .join("");
}
