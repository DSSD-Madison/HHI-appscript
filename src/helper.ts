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

// A wrapper to catch errors and notify an administrative email about issues
export function wrapper(callback: () => void) {
  try {
    callback()
  } catch (e) {
    sendEmail("Error in trigger", e.message, ADMIN_EMAIL)
    throw new Error(e.message)
  }
}