import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, inject, input, linkedSignal } from '@angular/core';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { LaunchDetailDocument } from '../../../core/graphql/generated/graphql';
import { queryResource, required } from '../../../core/graphql/query-resource';
import { Preferences } from '../../../core/preferences/preferences';
import { pageTitle } from '../../../core/seo/page-title-strategy';
import { formatDecimal } from '../../../shared/format/measure';
import { MassPipe } from '../../../shared/format/measure.pipes';
import { OutcomeBadge } from '../../../shared/ui/outcome-badge';
import { ResourceStatus } from '../../../shared/ui/resource-status';
import { VideoFacade } from '../../../shared/ui/video-facade';
import { youtubeId } from '../../../shared/util/youtube';
import { LaunchArchiveStore } from '../data/launch-archive.store';
import { toLaunchDetail } from '../data/launch.model';

type DetailTab = 'stage' | 'payload' | 'gallery';

const LANDING_TEXT = {
  success: 'Aterrizó',
  failure: 'No aterrizó',
  unknown: 'Sin dato',
  none: 'Sin intento',
} as const;

@Component({
  selector: 'app-launch-detail-page',
  imports: [
    DatePipe,
    NgOptimizedImage,
    RouterLink,
    OutcomeBadge,
    ResourceStatus,
    VideoFacade,
    MassPipe,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabContent,
  ],
  templateUrl: './launch-detail-page.html',
  styleUrl: './launch-detail-page.scss',
})
export default class LaunchDetailPage {
  private readonly archive = inject(LaunchArchiveStore);
  private readonly title = inject(Title);
  protected readonly units = inject(Preferences).units;

  /** Route param, bound by `withComponentInputBinding`. */
  readonly id = input.required<string>();

  protected readonly resource = queryResource(LaunchDetailDocument, {
    variables: () => ({ id: this.id() }),
    select: (data) => required(toLaunchDetail(data), 'LaunchDetail'),
  });

  protected readonly launch = computed(() =>
    this.resource.hasValue() ? this.resource.value() : null,
  );
  protected readonly videoId = computed(() => youtubeId(this.launch()?.videoUrl));
  protected readonly cover = computed(() => this.launch()?.images[0] ?? null);
  protected readonly landingText = LANDING_TEXT;
  protected readonly shipNames = computed(() => (this.launch()?.ships ?? []).join(', '));

  protected readonly tabs = computed(() => {
    const launch = this.launch();
    if (!launch) {
      return [];
    }
    const tabs: { value: DetailTab; label: string }[] = [];
    if (launch.cores.length) {
      tabs.push({ value: 'stage', label: 'Primera etapa' });
    }
    if (launch.payloads.length) {
      tabs.push({ value: 'payload', label: `Carga útil (${launch.payloads.length})` });
    }
    if (launch.images.length > 1) {
      tabs.push({ value: 'gallery', label: `Galería (${launch.images.length})` });
    }
    return tabs;
  });

  protected readonly selectedTab = linkedSignal<string | undefined>(() => this.tabs()[0]?.value);

  /** Chronological neighbours, from the shared archive. */
  protected readonly neighbours = computed(() => {
    const list = this.archive.launches();
    const index = list.findIndex((l) => l.id === this.id());
    if (index === -1) {
      return { older: null, newer: null };
    }
    return { older: list[index + 1] ?? null, newer: list[index - 1] ?? null };
  });

  constructor() {
    effect(() => {
      const name = this.launch()?.name;
      if (name) {
        this.title.setTitle(pageTitle(name));
      }
    });
  }

  protected orbitSummary(periapsis: number | null, apoapsis: number | null): string | null {
    if (periapsis === null || apoapsis === null) {
      return null;
    }
    return `${formatDecimal(periapsis, 0)} × ${formatDecimal(apoapsis, 0)} km`;
  }
}
