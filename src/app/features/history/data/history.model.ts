import type { HistoryQuery } from '../../../core/graphql/generated/graphql';
import { compact, secureUrl } from '../../../shared/util/collections';

/**
 * Represents a significant milestone in SpaceX history.
 */
export interface Milestone {
  readonly id: string;
  readonly title: string;
  readonly date: string;
  readonly details: string | null;
  readonly article: string | null;
  readonly flightId: string | null;
}

/**
 * Transforms the history GraphQL query result into an array of milestones.
 * Filters out entries with missing required fields and sorts chronologically.
 *
 * @param data - Complete HistoryQuery result from the GraphQL API
 * @returns Sorted array of Milestone objects (oldest first)
 */
export function toMilestones(data: HistoryQuery): Milestone[] {
  return compact(data.histories)
    .flatMap((h): Milestone[] =>
      h.id && h.title && h.event_date_utc
        ? [
            {
              id: h.id,
              title: h.title,
              date: h.event_date_utc,
              details: h.details,
              article: secureUrl(h.links?.article ?? h.links?.wikipedia),
              flightId: h.flight?.id ?? null,
            },
          ]
        : [],
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}
