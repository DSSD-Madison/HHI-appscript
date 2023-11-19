
// Constants for Google Sheet itself
export const SPREADSHEET_ID = "1TI0WNrGsTKC_lZPXhcwxK4fHsc2-A88GysVtidI75z0"

export const FORM_SHEET_ID = 664466786
export const APPROVED_SHEET_ID = 1940570428

export const EMAIL_COLUMN_NUMBER = columnToNumber('B')
export const HEADQUARTER_COLUMN_NUMBER = columnToNumber('H')
export const LOCATIONS_SERVED_COLUMN_NUMBER = columnToNumber('I')
export const HEADQUARTER_COORDINATES_COLUMN_NUMBER = columnToNumber('K')
export const LOCATIONS_SERVED_COORDINATES_COLUMN_NUMBER = columnToNumber('L')
export const APPROVAL_COLUMN_NUMBER = columnToNumber('M')
export const REASON_COLUMN_NUMBER = columnToNumber('N')

export const TAGS_FIELD_NAME = "tags"
export const HEADQUARTER_COORDINATES_FIELD_NAME = "headquarterCoordinates"
export const LOCATIONS_SERVED_FIELD_NAME = "locationsServed"
export const LOCATIONS_SERVED_COORDINATES_FIELD_NAME = "locationsServedCoordinates"
export const GLOBAL_FIELD_NAME = "global"

export const COORDINATES_DELIMETER = ','
export const TAGS_LIST_DELIMETER = ','
export const LOCATIONS_SERVED_LIST_DELIMETER = ';'

export const APPROVED = 'Approved'
export const REJECTED = 'Rejected'


// RTDB Firebase
export const REALTIME_DATABASE_URL = "https://hhimap-default-rtdb.firebaseio.com/"


// Admin email, receives trigger error emails
export const ADMIN_EMAIL = "gxue5@wisc.edu"
// A color to highlight cells. A hex color code of yellow
export const CELL_ERROR_HIGHLIGHT_COLOR = "#ffff00"


// Email constants for sending out to stakeholders
export const EMAIL_SUBJECT = 'Signal Program Map Submission Update'
export const APPROVED_MESSAGE = 'Your submission has been approved!'
export const REJECTED_MESSAGE = 'Your submission has unforunately been rejected.'
export const REJECTED_REASON_MESSAGE = 'Rejection reason:'


export const DEBUG = true

// Converts column string (A, B, C, ...) to column number (1, 2, 3, ...)
function columnToNumber(column: string) {
  return column.toLowerCase().charCodeAt(0) - 97 + 1
}
