import { Component, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommandPalette } from './core/command-palette/command-palette';
import { SiteFooter } from './core/layout/site-footer';
import { SiteHeader } from './core/layout/site-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter, CommandPalette],
  template: `
    <a class="skip" href="#main">Saltar al contenido</a>
    <app-site-header (searchRequested)="openPalette()" />
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
    <app-site-footer />
    <app-command-palette />
  `,
  styles: `
    :host {
      display: grid;
      grid-template-rows: auto 1fr auto;
      min-height: 100dvh;
    }
    main:focus {
      outline: none;
    }
    .skip {
      position: absolute;
      inset-inline-start: var(--space-s);
      inset-block-start: -10rem;
      z-index: 20;
      padding: var(--space-2xs) var(--space-s);
      border-radius: var(--radius-control);
      background: var(--foil);
      color: var(--on-foil);
      font-weight: 700;
      &:focus {
        inset-block-start: var(--space-2xs);
      }
    }
  `,
  host: {
    '(document:keydown)': 'onGlobalKeydown($event)',
  },
})
export class App {
  private readonly palette = viewChild.required(CommandPalette);

  protected openPalette(): void {
    this.palette().open();
  }

  protected onGlobalKeydown(event: KeyboardEvent): void {
    const isShortcut = event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey);
    const isSlash = event.key === '/' && !isEditable(event.target);
    if (isShortcut || isSlash) {
      event.preventDefault();
      this.openPalette();
    }
  }
}

function isEditable(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
}
