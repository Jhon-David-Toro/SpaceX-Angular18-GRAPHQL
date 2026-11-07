import type { EnvironmentProviders } from '@angular/core';
import { inject, makeEnvironmentProviders, provideExperimentalWebMcpTools } from '@angular/core';
import { Router } from '@angular/router';
import { filterLaunches, DEFAULT_CRITERIA } from '../../features/launches/data/launch-filters';
import { LaunchArchiveStore } from '../../features/launches/data/launch-archive.store';

const SEARCH_SCHEMA = {
  type: 'object',
  properties: {
    query: { type: 'string', description: 'Texto libre: misión, cohete, sitio u órbita.' },
    year: { type: 'number', description: 'Año del lanzamiento, por ejemplo 2018.' },
  },
} as const;

const OPEN_SCHEMA = {
  type: 'object',
  properties: { id: { type: 'string', description: 'Identificador de la misión.' } },
  required: ['id'],
} as const;

/**
 * Experimental (Angular 22): exposes the archive to in-browser AI agents through WebMCP.
 * Browsers without `navigator.modelContext` simply ignore the registration.
 */
export function provideArchiveWebMcpTools(): EnvironmentProviders {
  // One provider per tool: each schema infers its own typed `execute` input.
  return makeEnvironmentProviders([
    provideExperimentalWebMcpTools([
      {
        name: 'search_launches',
        title: 'Buscar lanzamientos',
        description: 'Busca lanzamientos pasados de SpaceX por texto y año. Devuelve hasta 10.',
        inputSchema: SEARCH_SCHEMA,
        annotations: { readOnlyHint: true },
        execute: ({ query, year }) => {
          const store = inject(LaunchArchiveStore);
          return filterLaunches(store.launches(), {
            ...DEFAULT_CRITERIA,
            query: query ?? '',
            year: year ?? 0,
          })
            .slice(0, 10)
            .map(({ id, name, date, rocket, outcome }) => ({ id, name, date, rocket, outcome }));
        },
      },
    ]),
    provideExperimentalWebMcpTools([
      {
        name: 'open_launch',
        title: 'Abrir misión',
        description: 'Navega a la ficha de una misión usando su identificador.',
        inputSchema: OPEN_SCHEMA,
        execute: async ({ id }) => {
          const opened = await inject(Router).navigate(['/lanzamientos', id]);
          return { opened };
        },
      },
    ]),
  ]);
}
