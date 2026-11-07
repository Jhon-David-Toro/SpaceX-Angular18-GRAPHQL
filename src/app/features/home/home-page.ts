import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Preferences } from '../../core/preferences/preferences';
import { massFromKg } from '../../shared/format/measure';
import { MassPipe, RatioPipe } from '../../shared/format/measure.pipes';
import { OutcomeBadge } from '../../shared/ui/outcome-badge';
import { ResourceStatus } from '../../shared/ui/resource-status';
import { LaunchArchiveStore } from '../launches/data/launch-archive.store';
import { LaunchCadence } from '../launches/ui/launch-cadence';
import { CompanyFacts } from './company-facts';

interface Destination {
  readonly path: string;
  readonly title: string;
  readonly text: string;
}

@Component({
  selector: 'app-home-page',
  imports: [
    DatePipe,
    NgOptimizedImage,
    RouterLink,
    LaunchCadence,
    OutcomeBadge,
    ResourceStatus,
    CompanyFacts,
    MassPipe,
    RatioPipe,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export default class HomePage {
  protected readonly store = inject(LaunchArchiveStore);
  protected readonly units = inject(Preferences).units;
  protected readonly stats = this.store.stats;
  protected readonly latest = this.store.latest;
  protected readonly totalPayload = computed(() => massFromKg(this.stats().totalPayloadKg));

  protected readonly destinations: readonly Destination[] = [
    {
      path: '/lanzamientos',
      title: 'Lanzamientos',
      text: 'Busca cualquier misión por nombre, año, cohete u órbita.',
    },
    {
      path: '/cohetes',
      title: 'Cohetes',
      text: 'Falcon 1, Falcon 9, Falcon Heavy y Starship, comparados a escala.',
    },
    {
      path: '/flota',
      title: 'Flota de recuperación',
      text: 'Los barcos que recogen cofias y propulsores en mitad del océano.',
    },
    {
      path: '/roadster',
      title: 'Roadster de Starman',
      text: 'La órbita solar del Tesla que despegó en el primer Falcon Heavy.',
    },
    {
      path: '/historia',
      title: 'Hitos',
      text: 'Primer aterrizaje, primera reutilización, primera tripulación.',
    },
  ];
}
