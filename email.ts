import 'google-apps-script'
import { isStakeholderApproved, isStakeholderRejected, isStakeholderStatusUpdate } from './helper'
import { EMAIL_COLUMN_NUMBER, REASON_COLUMN_NUMBER, APPROVED_MESSAGE, REJECTED_MESSAGE, REJECTED_REASON_MESSAGE, EMAIL_SUBJECT } from './constants'

// Upon approval or rejection,
// Sends an email to the stakeholder informing them, providing a reason if it is a rejection
function onStakeholderUpdateEmail(e) {
  if (!isStakeholderStatusUpdate(e))
    return

  const sheet = e.source.getActiveSheet()
  const row = e.range.getRow()

  // Get email and reason
  const email: string = sheet.getRange(row, EMAIL_COLUMN_NUMBER).getValue()
  const reason: string = sheet.getRange(row, REASON_COLUMN_NUMBER).getValue()

  let message: string = ''

  if (isStakeholderApproved(e)) {
    message = APPROVED_MESSAGE
  }
  else if (isStakeholderRejected(e)) {
    message = REJECTED_MESSAGE
    if (reason.trim().length != 0) {
      message += ` ${REJECTED_REASON_MESSAGE} ${reason}`
    }
  }
  // Stakeholder was neither approved or rejected, likely back to default none state
  else {
    return
  }

  MailApp.sendEmail(email, EMAIL_SUBJECT, message);
}
