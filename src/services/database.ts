import {
  DEBUG,
  REALTIME_DATABASE_URL,
} from "../constants";

export function sendData(data) {
  if (DEBUG) Logger.log("Sending data...");
  const base = FirebaseApp.getDatabaseByUrl(
    REALTIME_DATABASE_URL,
    ScriptApp.getOAuthToken()
  );
  base.setData("", data);
  if (DEBUG) Logger.log("Data sent.");
}
