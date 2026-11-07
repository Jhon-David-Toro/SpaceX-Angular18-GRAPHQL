import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import type { RouterStateSnapshot } from '@angular/router';
import { TitleStrategy } from '@angular/router';

export const SITE_NAME = 'Archivo SpaceX';

/** "Lanzamientos — Archivo SpaceX". Pages can refine it later with `setTitle`. */
@Injectable()
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const page = this.buildTitle(snapshot);
    this.title.setTitle(page && page !== 'Inicio' ? `${page} — ${SITE_NAME}` : SITE_NAME);
  }
}

/** Sets a page-specific title once data has loaded (e.g. the mission name). */
export function pageTitle(page: string): string {
  return `${page} — ${SITE_NAME}`;
}
