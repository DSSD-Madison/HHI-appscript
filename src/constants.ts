// The HHI Stakeholder submission form sheet
export const FORM_SHEET_ID = 664466786

export const EMAIL_COLUMN_NUMBER = columnToNumber('B')
export const HEADQUARTER_COLUMN_NUMBER = columnToNumber('F')
export const LOCATIONS_SERVED_COLUMN_NUMBER = columnToNumber('G')
export const HEADQUARTER_COORDINATES_COLUMN_NUMBER = columnToNumber('I')
export const LOCATIONS_SERVED_COORDINATES_COLUMN_NUMBER = columnToNumber('J')
export const APPROVAL_COLUMN_NUMBER = columnToNumber('K')
export const REASON_COLUMN_NUMBER = columnToNumber('L')

export const LIST_DELIMETER = ';'

export const APPROVED = 'Approved'
export const REJECTED = 'Rejected'

export const EMAIL_SUBJECT = 'Signal Program Map Submission Update'
export const APPROVED_MESSAGE = 'Your submission has been approved!'
export const REJECTED_MESSAGE = 'Your submission has unforunately been rejected.'
export const REJECTED_REASON_MESSAGE = 'Rejection reason:'

// Converts column string (A, B, C, ...) to column number (1, 2, 3, ...)
function columnToNumber(column: string) {
  return column.toLowerCase().charCodeAt(0) - 97 + 1
}
