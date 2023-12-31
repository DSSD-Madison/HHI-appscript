import {
  EMAIL_COLUMN_NUMBER,
  REASON_COLUMN_NUMBER,
  APPROVED_MESSAGE,
  REJECTED_MESSAGE,
  REJECTED_REASON_MESSAGE,
  EMAIL_SUBJECT,
  APPROVAL_COLUMN_NUMBER,
  DEBUG,
} from "../constants";
import { highlightProcessingError, resetStakeholderStatus } from "./error";

export function mailToRow(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  approved: boolean
) {
  if (DEBUG) Logger.log("Mailing to stakeholder...")

  // Check if there is still capacity to send emails
  if (MailApp.getRemainingDailyQuota() == 0) {
    const message = "Daily email quota exceeded"
    Logger.log(message)
    highlightProcessingError(sheet, row, APPROVAL_COLUMN_NUMBER, message)
    resetStakeholderStatus(sheet, row)
    throw new Error(message)
  }


  // Get email and reason
  const email: string = sheet.getRange(row, EMAIL_COLUMN_NUMBER).getValue()
  const reason: string = sheet.getRange(row, REASON_COLUMN_NUMBER).getValue()

  let message: string = ""

  if (approved) message = APPROVED_MESSAGE
  else {
    message = REJECTED_MESSAGE
    if (reason.trim().length != 0) {
      message += ` ${REJECTED_REASON_MESSAGE} ${reason}`
    }
  }

  sendEmail(EMAIL_SUBJECT, message, email)

  if (DEBUG) Logger.log("Email sent.")
}

export function sendEmail(subject: string, message: string, email: string) {
  MailApp.sendEmail(email, subject, message)
}