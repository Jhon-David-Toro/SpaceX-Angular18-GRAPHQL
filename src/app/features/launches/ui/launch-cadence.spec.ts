import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { SAMPLE_LAUNCHES } from '../../../../testing/launch-fixtures';
import { LaunchCadence } from './launch-cadence';

registerLocaleData(localeEs);

async function setup() {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: LOCALE_ID, useValue: 'es' }],
  });
  const fixture = TestBed.createComponent(LaunchCadence);
  fixture.componentRef.setInput('launches', SAMPLE_LAUNCHES);
  await fixture.whenStable();
  const host = fixture.nativeElement as HTMLElement;
  const slider = host.querySelector<HTMLElement>('[role="slider"]')!;
  const press = async (key: string) => {
    slider.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    await fixture.whenStable();
  };
  return { fixture, host, slider, press };
}

describe('LaunchCadence', () => {
  it('renders one line per launch and starts on the most recent', async () => {
    const { host, slider } = await setup();
    expect(host.querySelectorAll('line.tick')).toHaveLength(SAMPLE_LAUNCHES.length);
    expect(slider.getAttribute('aria-valuenow')).toBe('5');
    expect(slider.getAttribute('aria-valuetext')).toContain('Sentinel-6');
  });

  it('moves between launches with the keyboard', async () => {
    const { slider, press } = await setup();
    await press('Home');
    expect(slider.getAttribute('aria-valuenow')).toBe('1');
    expect(slider.getAttribute('aria-valuetext')).toContain('FalconSat');
    expect(slider.getAttribute('aria-valuetext')).toContain('fallo');
    await press('ArrowRight');
    expect(slider.getAttribute('aria-valuenow')).toBe('2');
    await press('ArrowLeft');
    await press('ArrowLeft');
    expect(slider.getAttribute('aria-valuenow')).toBe('1');
  });

  it('opens the active launch on Enter', async () => {
    const { press } = await setup();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await press('End');
    await press('Enter');
    expect(navigate).toHaveBeenCalledWith(['/lanzamientos', '5']);
  });
});
