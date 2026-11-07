import { Service, computed } from '@angular/core';
import { LaunchArchiveDocument } from '../../../core/graphql/generated/graphql';
import { queryResource } from '../../../core/graphql/query-resource';
import { computeStats } from './launch-filters';
import { toLaunchArchive } from './launch.model';

/**
 * Single source of truth for the launch archive. Shared by the home page, the archive page,
 * the command palette and the WebMCP tools, so the list is fetched once per session.
 */
@Service()
export class LaunchArchiveStore {
  readonly resource = queryResource(LaunchArchiveDocument, { select: toLaunchArchive });

  readonly launches = computed(() => (this.resource.hasValue() ? this.resource.value() : []));
  readonly stats = computed(() => computeStats(this.launches()));
  readonly latest = computed(() => this.launches()[0] ?? null);
  readonly years = computed(() => [...new Set(this.launches().map((l) => l.year))].sort());
  readonly rockets = computed(() => [...new Set(this.launches().map((l) => l.rocket))].sort());

  reload(): void {
    this.resource.reload();
  }
}
