/**
 * Launch domain models - Re-exports types and mappers for convenience.
 * This barrel file maintains backward compatibility after splitting the original
 * 203-line file into separate concerns.
 */

// Re-export all types
export type {
  CoreFlight,
  LaunchDetail,
  LaunchLink,
  LaunchOutcome,
  LaunchSummary,
  PayloadInfo,
} from './launch.types';

// Re-export all mappers
export { toLaunchArchive, toLaunchDetail, toLaunchSummary, toOutcome } from './launch.mappers';
