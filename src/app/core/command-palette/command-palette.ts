import { DatePipe } from '@angular/common';
import type { ElementRef } from '@angular/core';
import { Component, computed, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { LaunchArchiveStore } from '../../features/launches/data/launch-archive.store';
import { DEFAULT_CRITERIA, filterLaunches } from '../../features/launches/data/launch-filters';
import { normalizeText } from '../../shared/util/collections';
import { NAV_ITEMS } from '../layout/site-header';

interface PaletteItem {
  readonly id: string;
  readonly kind: 'Página' | 'Misión';
  readonly label: string;
  readonly hint: string | null;
  readonly commands: readonly string[];
}

const MAX_LAUNCHES = 8;

/**
 * Global quick-jump (Ctrl/⌘ K). Built on the native <dialog> for focus trapping and Esc handling,
 * with the WAI-ARIA combobox + listbox pattern for the results.
 */
@Component({
  selector: 'app-command-palette',
  imports: [FormField, DatePipe],
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.scss',
})
export class CommandPalette {
  private readonly router = inject(Router);
  private readonly archive = inject(LaunchArchiveStore);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly model = signal({ query: '' });
  protected readonly search = form(this.model);
  protected readonly loading = computed(() => this.archive.resource.isLoading());

  protected readonly results = computed<PaletteItem[]>(() => {
    const query = normalizeText(this.model().query);
    const pages = NAV_ITEMS.filter(
      (item) => !query || normalizeText(item.label).includes(query),
    ).map((item): PaletteItem => ({
      id: `page-${item.path}`,
      kind: 'Página',
      label: item.label,
      hint: null,
      commands: [item.path],
    }));
    const launches = query
      ? filterLaunches(this.archive.launches(), { ...DEFAULT_CRITERIA, query })
          .slice(0, MAX_LAUNCHES)
          .map((launch): PaletteItem => ({
            id: `launch-${launch.id}`,
            kind: 'Misión',
            label: launch.name,
            hint: launch.date,
            commands: ['/lanzamientos', launch.id],
          }))
      : [];
    return [...launches, ...pages];
  });

  /** Active option resets to the first result whenever the result list changes. */
  protected readonly activeIndex = linkedSignal({
    source: this.results,
    computation: () => 0,
  });

  protected readonly activeId = computed(() => this.results()[this.activeIndex()]?.id ?? null);

  open(): void {
    const dialog = this.dialog().nativeElement;
    if (!dialog.open) {
      this.model.set({ query: '' });
      dialog.showModal();
    }
  }

  protected close(): void {
    this.dialog().nativeElement.close();
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.results().length;
    if (count === 0) {
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex.update((i) => (i + 1) % count);
        this.scrollActiveIntoView();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex.update((i) => (i - 1 + count) % count);
        this.scrollActiveIntoView();
        break;
      case 'Enter': {
        event.preventDefault();
        const item = this.results()[this.activeIndex()];
        if (item) {
          this.go(item);
        }
        break;
      }
    }
  }

  protected go(item: PaletteItem): void {
    this.close();
    void this.router.navigate([...item.commands]);
  }

  /** Closes when the backdrop (the dialog element itself) is clicked. */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.close();
    }
  }

  private scrollActiveIntoView(): void {
    const id = this.activeId();
    if (id) {
      this.dialog()
        .nativeElement.querySelector(`#${CSS.escape(id)}`)
        ?.scrollIntoView({ block: 'nearest' });
    }
  }
}
