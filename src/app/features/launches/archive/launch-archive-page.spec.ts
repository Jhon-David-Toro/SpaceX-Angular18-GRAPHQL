import { LOCALE_ID, computed, resource, signal } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { SAMPLE_LAUNCHES } from '../../../../testing/launch-fixtures';
import { LaunchArchiveStore } from '../data/launch-archive.store';
import type { LaunchSummary } from '../data/launch.model';
import LaunchArchivePage from './launch-archive-page';

registerLocaleData(localeEs);

/** Minimal stand-in for the store: same public shape, static data, no network. */
function fakeStore() {
  const launches = signal<readonly LaunchSummary[]>(SAMPLE_LAUNCHES);
  return {
    resource: resource({ loader: () => Promise.resolve(launches()) }),
    launches,
    years: computed(() => [...new Set(launches().map((l) => l.year))].sort()),
    rockets: computed(() => [...new Set(launches().map((l) => l.rocket))].sort()),
  };
}

async function setup(url = '/lanzamientos') {
  TestBed.configureTestingModule({
    providers: [
      provideRouter(
        [{ path: 'lanzamientos', component: LaunchArchivePage }],
        withComponentInputBinding(),
      ),
      { provide: LOCALE_ID, useValue: 'es' },
    ],
  });
  TestBed.overrideProvider(LaunchArchiveStore, { useFactory: fakeStore });
  const harness = await RouterTestingHarness.create(url);
  await harness.fixture.whenStable();
  const host = harness.routeNativeElement!;
  const names = () => [...host.querySelectorAll('.name')].map((el) => el.textContent.trim());
  return { harness, host, names };
}

describe('LaunchArchivePage', () => {
  it('lists every launch grouped by year', async () => {
    const { host, names } = await setup();
    expect(names()).toHaveLength(SAMPLE_LAUNCHES.length);
    expect([...host.querySelectorAll('h2.year')].map((h) => h.textContent.trim())).toEqual([
      '2020',
      '2018',
      '2006',
    ]);
    expect(host.querySelector('[role="status"]')?.textContent).toContain('5 lanzamientos');
  });

  it('restores filters from the URL so searches are shareable', async () => {
    const { host, names } = await setup('/lanzamientos?outcome=failure');
    expect(names()).toEqual(['FalconSat']);
    expect(
      host.querySelector<HTMLInputElement>('input[type="radio"][value="failure"]')?.checked,
    ).toBe(true);
  });

  it('filters as the viewer types and writes the search to the URL', async () => {
    const { harness, host, names } = await setup();
    const input = host.querySelector<HTMLInputElement>('#f-q')!;
    input.value = 'heavy';
    input.dispatchEvent(new Event('input'));
    TestBed.tick();
    expect(names()).toEqual(['Falcon Heavy Test Flight']);

    // The URL is updated after a 350 ms debounce, not on every keystroke.
    expect(TestBed.inject(Router).url).toBe('/lanzamientos');
    await new Promise((resolve) => setTimeout(resolve, 450));
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/lanzamientos?q=heavy');
  });

  it('offers a way out when nothing matches', async () => {
    const { host } = await setup('/lanzamientos?q=zzz');
    expect(host.querySelector('.empty h2')?.textContent).toContain('Ningún lanzamiento coincide');
  });
});
