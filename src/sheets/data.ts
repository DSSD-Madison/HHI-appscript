/**
 * Represents the Data Sheet. The Data Sheet contains
 * - For each row, extra fields that needed to be computed on sync
 * - For each row, a "synced" field that determines whether a row is synced or not
 * - For each row, a sync button. When clicked, it should attempt to sync a row
 * - A global "sync" button. When clicked, it should attempt to sync all rows.
 * 
 * What is syncing?
 * For each row to be synced, it should
 * - Calculate any additional fields necessary
 * - Push the data up to Firebase Realtime Database
 * 
 * If at any point one step fails, the entire sync should be stopped and the error highlighted
 */

