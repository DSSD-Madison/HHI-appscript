import { DEBUG } from "../constants";

export function sendEmail(recipient: string, subject: string, message: string, ) {
  if (DEBUG) Logger.log(`Sending mail to: ${recipient}, subject: ${subject}, message: ${message}`)

  // Check if there is still capacity to send emails
  let quota = MailApp.getRemainingDailyQuota()
  if (DEBUG) Logger.log(`Remaining quota: ${quota}`)
  
  if (quota == 0) {
    const message = "Daily email quota exceeded"
    throw new Error(message)
  }

  MailApp.sendEmail(recipient, subject, message)

  if (DEBUG) Logger.log("Mail sent.")
}