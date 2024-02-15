import {
  DEBUG,
  ADMIN_EMAIL,
} from "./constants";
import { sendEmail } from "./services/email";

// Delete all the existing triggers for the project
export function deleteTriggers() {
  if (DEBUG) { Logger.log("Deleting all triggers...") }
  let triggers = ScriptApp.getProjectTriggers()
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i])
  }
}

// A wrapper for triggers to catch errors, log them, and notify an administrative email about issues
export function triggerWrapper(triggerCallback: () => void) {
  try {
    triggerCallback()
  } catch (e) {
    console.error(e)
    sendEmail("Error in trigger", e.message, ADMIN_EMAIL)
  }
}