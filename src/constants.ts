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

/* Services */

/* Database */
export const REALTIME_DATABASE_URL = "https://hhimap-default-rtdb.firebaseio.com/"

/* Email */ 
// Admin email, receives trigger error emails
export const ADMIN_EMAIL = "gxue5@wisc.edu"
// A color to highlight cells. A hex color code of yellow
export const CELL_ERROR_HIGHLIGHT_COLOR = "#ffff00"

// Email constants for sending out to stakeholders
export const EMAIL_SUBJECT = 'Signal Program Map Submission Update'
export const APPROVED_MESSAGE = 'Your submission has been approved!'
export const REJECTED_MESSAGE = 'Your submission has unforunately been rejected.'
export const REJECTED_REASON_MESSAGE = 'Rejection reason:'

// Converts column string (A, B, C, ...) to column number (1, 2, 3, ...)
function columnToNumber(column: string) {
  return column.toLowerCase().charCodeAt(0) - 97 + 1
}
