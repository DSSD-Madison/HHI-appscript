import { SETTING_SHEET_ID } from "../constants";


export function getSetting(a1Notation: string): string {
  return SpreadsheetApp.getActive()
    .getSheets()
    .find((s) => s.getSheetId() === SETTING_SHEET_ID)
    .getRange(a1Notation)
    .getValue()
    .toString();
}