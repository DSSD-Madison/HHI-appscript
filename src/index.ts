import { onStakeholderUpdateEmail } from "./email";
import { onStakeholderApprovalGeocode } from "./geocode";

function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit) {
  onStakeholderUpdateEmail(e)
  onStakeholderApprovalGeocode(e)
}

