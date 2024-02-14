/**
 * Represents the Submission Sheet. The Submission Sheet contains
 * - All form responses from the Submission Form
 * - For each row, a status dropdown
 * - For each row, a "reason" for rejection
 *
 * The status of a row can be empty, rejected, or approved
 * - On rejection, it will send a rejection email with the appropriate reason
 * - On approval, it will send an approval email, and copy the data over to the Data Sheet
 *
 */

import {
  APPROVED,
  APPROVED_MESSAGE,
  COPY_END_COLUMN_NUMBER,
  COPY_START_COLUMN_NUMBER,
  DATA_SHEET_ID,
  DEBUG,
  EMAIL_COLUMN_NUMBER,
  EMAIL_SUBJECT,
  REJECTED,
  REJECTED_MESSAGE,
  REJECTED_REASON_MESSAGE,
  REJECTION_REASON_COLUMN_NUMBER,
  STATUS_COLUMN_NUMBER,
} from "../constants";
import { sendEmail } from "../services/email";

export function onSubmissionSheetEdit(e: GoogleAppsScript.Events.SheetsOnEdit) {
  if (DEBUG) Logger.log("Submission Sheet modified.");

  const submissionSheet = e.source.getActiveSheet();
  const row = e.range.getRow();
  const dataSheet = SpreadsheetApp.getActive()
    .getSheets()
    .find((s) => s.getSheetId() === DATA_SHEET_ID);

  if (isSubmissionRejected(e)) {
    onSubmissionRejected(submissionSheet, row);
  } else if (isSubmissionApproved(e)) {
    onSubmissionApproved(submissionSheet, row, dataSheet);
  }
}

function onSubmissionRejected(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number
) {
  // Send rejection email with reason (if present)
  if (DEBUG) Logger.log("Sending rejection email...");

  const email: string = sheet.getRange(row, EMAIL_COLUMN_NUMBER).getValue();
  const reason: string = sheet
    .getRange(row, REJECTION_REASON_COLUMN_NUMBER)
    .getValue();

  let message = REJECTED_MESSAGE;
  if (reason.trim().length != 0) {
    message += ` ${REJECTED_REASON_MESSAGE} ${reason}`;
  }

  sendEmail(email, EMAIL_SUBJECT, message);
}

function onSubmissionApproved(
  submissionSheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  dataSheet: GoogleAppsScript.Spreadsheet.Sheet
) {
  // Send approval email
  if (DEBUG) Logger.log("Sending approval email...");


  const email: string = submissionSheet.getRange(row, EMAIL_COLUMN_NUMBER).getValue();
  let message = APPROVED_MESSAGE;

  sendEmail(email, EMAIL_SUBJECT, message);

  // Copy data over
  if (DEBUG) Logger.log("Copying data...");
  const rangeToCopy = `${COPY_START_COLUMN_NUMBER}${row}:${COPY_END_COLUMN_NUMBER}${row}`
  const valuesToCopy = submissionSheet.getRange(rangeToCopy).getValues();

  dataSheet.appendRow(valuesToCopy[0]);
}

// Check if event is rejecting a stakeholder
function isSubmissionRejected(
  e: GoogleAppsScript.Events.SheetsOnEdit
): boolean {
  if (!isSubmissionStatusUpdate(e)) {
    return false;
  }

  if (e.range.getValue() !== REJECTED) {
    return false;
  }

  if (DEBUG) Logger.log("Submission rejected.");
  return true;
}

// Check if event is approving a submission
function isSubmissionApproved(
  e: GoogleAppsScript.Events.SheetsOnEdit
): boolean {
  if (!isSubmissionStatusUpdate(e)) {
    return false;
  }

  if (e.range.getValue() !== APPROVED) {
    return false;
  }

  if (DEBUG) Logger.log("Submission approved.");
  return true;
}

// Check if event is updating a stakeholder status
function isSubmissionStatusUpdate(
  e: GoogleAppsScript.Events.SheetsOnEdit
): boolean {
  const range = e.range;

  // Ensure range only affects one cell
  if (range.getNumRows() > 1 || range.getNumColumns() > 1) {
    if (DEBUG) Logger.log(`multiple columns affected, ignoring event`);
    return false;
  }

  // Check if column matches the status column
  if (range.getColumn() !== STATUS_COLUMN_NUMBER) {
    if (DEBUG)
      Logger.log(
        `not affecting status column ${range.getColumn()}, ${STATUS_COLUMN_NUMBER}`
      );
    return false;
  }

  if (DEBUG) Logger.log("Submission status updated.");
  return true;
}
