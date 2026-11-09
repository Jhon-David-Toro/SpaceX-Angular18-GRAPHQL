import type { LaunchOutcome } from './launch.types';

/**
 * Human-readable labels for launch outcomes, used in badges and UI elements.
 */
export const OUTCOME_LABELS: Record<LaunchOutcome, string> = {
  success: 'Éxito',
  failure: 'Fallo',
  unknown: 'Sin dato',
};

/**
 * Lowercase descriptive text for launch outcomes, used in screen reader announcements.
 */
export const OUTCOME_TEXT: Record<LaunchOutcome, string> = {
  success: 'éxito',
  failure: 'fallo',
  unknown: 'resultado sin dato',
};

/**
 * Landing outcome labels including 'none' for launches without landing attempts.
 */
export const LANDING_TEXT: Record<LaunchOutcome | 'none', string> = {
  success: 'Aterrizó',
  failure: 'No aterrizó',
  unknown: 'Sin dato',
  none: 'Sin intento',
};

/**
 * Filter options for launch outcome dropdown/select controls.
 */
export const OUTCOME_FILTER_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'success', label: 'Éxito' },
  { value: 'failure', label: 'Fallo' },
] as const;
