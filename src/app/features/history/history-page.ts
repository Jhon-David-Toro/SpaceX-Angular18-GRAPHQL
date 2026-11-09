import { DatePipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HistoryDocument } from '../../core/graphql/generated/graphql';
import { queryResource } from '../../core/graphql/query-resource';
import { ResourceStatus } from '../../shared/ui/resource-status';
import { toMilestones } from './data/history.model';

@Component({
  selector: 'app-history-page',
  imports: [DatePipe, RouterLink, ResourceStatus],
  templateUrl: './history-page.html',
  styleUrl: './history-page.scss',
})
export default class HistoryPage {
  protected readonly resource = queryResource(HistoryDocument, { select: toMilestones });
  protected readonly milestones = computed(() =>
    this.resource.hasValue() ? this.resource.value() : [],
  );
}
