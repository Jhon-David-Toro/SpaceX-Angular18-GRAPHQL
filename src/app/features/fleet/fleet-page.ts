import { NgOptimizedImage } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { FleetDocument } from '../../core/graphql/generated/graphql';
import { queryResource } from '../../core/graphql/query-resource';
import { ResourceStatus } from '../../shared/ui/resource-status';
import { toFleet } from './data/fleet.model';

@Component({
  selector: 'app-fleet-page',
  imports: [NgOptimizedImage, FormField, ResourceStatus],
  templateUrl: './fleet-page.html',
  styleUrl: './fleet-page.scss',
})
export default class FleetPage {
  protected readonly resource = queryResource(FleetDocument, { select: toFleet });
  protected readonly ships = computed(() =>
    this.resource.hasValue() ? this.resource.value() : [],
  );

  protected readonly model = signal({ role: 'all', activeOnly: false });
  protected readonly filters = form(this.model);

  protected readonly roles = computed(() =>
    [...new Set(this.ships().flatMap((s) => s.roles))].sort(),
  );

  protected readonly visible = computed(() => {
    const { role, activeOnly } = this.model();
    return this.ships().filter(
      (ship) => (role === 'all' || ship.roles.includes(role)) && (!activeOnly || ship.active),
    );
  });
}
