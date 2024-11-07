import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, RouteReuseStrategy, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { DatePipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled'
      }),
      withRouterConfig({ onSameUrlNavigation: 'reload'})
    ),
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
    provideHttpClient(),
    DatePipe
  ]
};
