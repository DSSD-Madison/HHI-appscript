/**
 * Represents the Submission Sheet. The Submission Sheet contains
 * - All form responses from the Submission Form
 * - For each row, a status dropdown
 * - For each row, a "reason" for rejection
 * 
 * The status of a row can be empty, rejected, or approved
 * - On rejection, it will send a rejection email with the appropriate reason
 * - On approval, it will send an approval email, and copy the data over to the Data Sheet
 * 
 */

