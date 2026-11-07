import { Component, computed, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { ThemePreference } from '../preferences/preferences';
import { Preferences } from '../preferences/preferences';

interface NavItem {
  readonly path: string;
  readonly label: string;
  readonly exact?: boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { path: '/', label: 'Inicio', exact: true },
  { path: '/lanzamientos', label: 'Lanzamientos' },
  { path: '/cohetes', label: 'Cohetes' },
  { path: '/flota', label: 'Flota' },
  { path: '/roadster', label: 'Roadster' },
  { path: '/historia', label: 'Hitos' },
];

const NEXT_THEME: Record<ThemePreference, ThemePreference> = {
  system: 'dark',
  dark: 'light',
  light: 'system',
};

const THEME_LABEL: Record<ThemePreference, string> = {
  system: 'Tema del sistema',
  dark: 'Tema oscuro',
  light: 'Tema claro',
};

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  host: { role: 'banner' },
})
export class SiteHeader {
  private readonly preferences = inject(Preferences);

  /** Asks the shell to open the command palette. */
  readonly searchRequested = output();

  protected readonly nav = NAV_ITEMS;
  protected readonly units = this.preferences.units;
  protected readonly theme = this.preferences.theme;
  protected readonly themeLabel = computed(() => THEME_LABEL[this.theme()]);
  protected readonly nextThemeLabel = computed(() => THEME_LABEL[NEXT_THEME[this.theme()]]);

  protected toggleUnits(): void {
    this.preferences.toggleUnits();
  }

  protected cycleTheme(): void {
    this.theme.update((t) => NEXT_THEME[t]);
  }
}
