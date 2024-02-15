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
  APPROVED_MESSAGE_A1,
  COPY_END_COLUMN,
  COPY_START_COLUMN,
  DATA_SHEET_ID,
  DEBUG,
  EMAIL_COLUMN_NUMBER,
  EMAIL_SUBJECT_A1,
  REJECTED,
  REJECTED_MESSAGE_A1,
  REJECTED_WITH_REASON_MESSAGE_A1,
  REJECTED_WITH_REASON_REPLACE,
  REJECTION_REASON_COLUMN_NUMBER,
  STATUS_COLUMN_NUMBER,
} from "../constants";
import { sendEmail } from "../services/email";
import { getSetting } from "../services/settings";

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

  let message = "";
  if (reason.trim().length != 0) {
    message = getSetting(REJECTED_WITH_REASON_MESSAGE_A1).replace(
      REJECTED_WITH_REASON_REPLACE,
      reason
    );
  } else {
    message = getSetting(REJECTED_MESSAGE_A1);
  }

  const subject = getSetting(EMAIL_SUBJECT_A1)

  let response = SpreadsheetApp.getUi().alert(
    `Sending Rejection to ${email}`,
    `Subject: ${subject}
Body: ${message}`,
    SpreadsheetApp.getUi().ButtonSet.OK_CANCEL
  );

  if (response !== SpreadsheetApp.getUi().Button.OK) {
    SpreadsheetApp.getUi().alert(`Cancelled send. Reverting rejection.`);
    sheet.getRange(row, STATUS_COLUMN_NUMBER).setValue(null)
    return;
  }

  sendEmail(email, subject, message);
  SpreadsheetApp.getUi().alert(`Sent rejection email to ${email}.`);
}

function onSubmissionApproved(
  submissionSheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  dataSheet: GoogleAppsScript.Spreadsheet.Sheet
) {
  // Send approval email
  if (DEBUG) Logger.log("Sending approval email...");

  const email: string = submissionSheet
    .getRange(row, EMAIL_COLUMN_NUMBER)
    .getValue();
  let message = getSetting(APPROVED_MESSAGE_A1);

  const subject = getSetting(EMAIL_SUBJECT_A1)

  let response = SpreadsheetApp.getUi().alert(
    `Sending Approval to ${email}`,
    `Subject: ${subject}
Body: ${message}`,
    SpreadsheetApp.getUi().ButtonSet.OK_CANCEL
  );

  if (response !== SpreadsheetApp.getUi().Button.OK) {
    SpreadsheetApp.getUi().alert(`Cancelled send. Reverting approval.`);
    submissionSheet.getRange(row, STATUS_COLUMN_NUMBER).setValue(null)
    return;
  }

  sendEmail(email, subject, message);
  SpreadsheetApp.getUi().alert(`Sent approval email to ${email}.`);

  // Copy data over
  if (DEBUG) Logger.log("Copying data...");
  const rangeToCopy = `${COPY_START_COLUMN}${row}:${COPY_END_COLUMN}${row}`;
  const valuesToCopy = submissionSheet.getRange(rangeToCopy).getValues();

  dataSheet.appendRow(valuesToCopy[0]);

  if (DEBUG) Logger.log("Data copied.");
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
