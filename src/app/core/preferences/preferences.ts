import { DOCUMENT, Service, effect, inject, signal } from '@angular/core';

export type UnitSystem = 'metric' | 'imperial';
export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_PREFIX = 'pref:';

function isUnitSystem(value: unknown): value is UnitSystem {
  return value === 'metric' || value === 'imperial';
}

function isTheme(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

/** Per-viewer UI preferences, persisted locally. Storage can be unavailable, so never trust it. */
@Service()
export class Preferences {
  private readonly document = inject(DOCUMENT);
  private readonly storage = this.document.defaultView?.localStorage;

  readonly units = signal<UnitSystem>(this.read('units', isUnitSystem, 'metric'));
  readonly theme = signal<ThemePreference>(this.read('theme', isTheme, 'system'));

  constructor() {
    effect(() => {
      this.write('units', this.units());
    });
    effect(() => {
      const theme = this.theme();
      this.write('theme', theme);
      const root = this.document.documentElement;
      if (theme === 'system') {
        delete root.dataset['theme'];
      } else {
        root.dataset['theme'] = theme;
      }
    });
  }

  toggleUnits(): void {
    this.units.update((u) => (u === 'metric' ? 'imperial' : 'metric'));
  }

  private read<T>(key: string, guard: (value: unknown) => value is T, fallback: T): T {
    try {
      const raw = this.storage?.getItem(STORAGE_PREFIX + key);
      if (raw === null || raw === undefined) {
        return fallback;
      }
      const parsed: unknown = JSON.parse(raw);
      return guard(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  private write(key: string, value: unknown): void {
    try {
      this.storage?.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch {
      // Private mode or quota exceeded: preferences simply won't persist.
    }
  }
}
