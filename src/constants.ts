export const DEBUG = true

export const SPREADSHEET_ID = "1rbPw3-YQEHwKMgkMxJck_oP661NyuYFVaTXd33F0ZcA"

/* Submission Sheet */
export const SUBMISSION_SHEET_ID = 0

export const EMAIL_COLUMN_NUMBER = columnToNumber('B')
export const STATUS_COLUMN_NUMBER = columnToNumber('K')
export const REJECTION_REASON_COLUMN_NUMBER = columnToNumber('L')

export const COPY_START_COLUMN = 'C'
export const COPY_END_COLUMN = 'J'

export const APPROVED = 'Approved'
export const REJECTED = 'Rejected'

/* Data Sheet */
export const DATA_SHEET_ID = 1481298901

export const HEADQUARTER_COLUMN_NUMBER = columnToNumber('F')
export const LOCATIONS_SERVED_COLUMN_NUMBER = columnToNumber('G')
export const TAGS_COLUMN_NUMBER = columnToNumber('H')

export const HEADQUARTER_COORDINATES_COLUMN_NUMBER = columnToNumber('I')
export const LOCATIONS_SERVED_COORDINATES_COLUMN_NUMBER = columnToNumber('J')
export const GLOBAL_COLUMN_NUMBER = columnToNumber('K')

export const TAGS_LIST_DELIMETER = ','
export const COORDINATES_DELIMETER = ','
export const LOCATIONS_SERVED_LIST_DELIMETER = ';'

/* Setting Sheet */
/* Note: Constants referencing A1 refer to A1 notation, or a specific cell on Google Sheets */
export const SETTING_SHEET_ID = 740227076

// Admin email, receives trigger error emails
export const ADMIN_EMAIL_A1 = "B2"
// A color to highlight cells. A hex color code of yellow
export const CELL_ERROR_HIGHLIGHT_COLOR_A1 = "B3"

// Email constants for sending out to stakeholders
export const EMAIL_SUBJECT_A1 = "B6"
export const APPROVED_MESSAGE_A1 = "B7"
export const REJECTED_MESSAGE_A1 = "B8"
export const REJECTED_WITH_REASON_MESSAGE_A1 = "B9" // contains {reason} to fill with the reason
export const REJECTED_WITH_REASON_REPLACE = "{reason}"

/* Database */
export const REALTIME_DATABASE_URL = "https://hhimap-default-rtdb.firebaseio.com/"


// Converts column string (A, B, C, ...) to column number (1, 2, 3, ...)
function columnToNumber(column: string) {
  return column.toLowerCase().charCodeAt(0) - 97 + 1
}
