import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import type { ApplicationConfig } from '@angular/core';
import { LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import { routes } from './app.routes';
import { provideGraphql } from './core/graphql/provide-graphql';
import { PageTitleStrategy } from './core/seo/page-title-strategy';
import { provideArchiveWebMcpTools } from './core/web-mcp/archive-tools';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions({ skipInitialTransition: true }),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
    { provide: LOCALE_ID, useValue: 'es' },
    provideGraphql(),
    provideArchiveWebMcpTools(),
  ],
};
