import type { EnvironmentProviders } from '@angular/core';
import { InjectionToken, inject, isDevMode, makeEnvironmentProviders } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { InMemoryCache } from '@apollo/client/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

/** Public, community-maintained SpaceX GraphQL API. */
export const GRAPHQL_ENDPOINT = new InjectionToken<string>('GRAPHQL_ENDPOINT', {
  factory: () => 'https://spacex-production.up.railway.app/',
});

/**
 * Normalised cache: every entity with an `id` is stored once, so the launch detail page can
 * render instantly from data already fetched by the archive.
 */
export function createCache(): InMemoryCache {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          launch: {
            read: (existing: unknown, { args, toReference }) =>
              existing ??
              toReference({
                __typename: 'Launch',
                id: typeof args?.['id'] === 'string' ? args['id'] : '',
              }),
          },
        },
      },
      // Embedded value objects without identity are merged into their parent.
      LaunchRocket: { keyFields: false },
      LaunchLinks: { keyFields: false },
      LaunchSite: { keyFields: false },
    },
  });
}

export function provideGraphql(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Fetch is the default HttpClient backend since Angular 21.
    provideHttpClient(),
    provideApollo(() => ({
      link: inject(HttpLink).create({ uri: inject(GRAPHQL_ENDPOINT) }),
      cache: createCache(),
      devtools: { enabled: isDevMode() },
      defaultOptions: {
        query: { fetchPolicy: 'cache-first' },
      },
    })),
  ]);
}
