import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import {provideToastr} from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { httpTokenInterceptor } from './services/interceptor/http-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpTokenInterceptor])
    ),
    provideAnimations(),
    provideToastr({
      progressBar:true, 
      closeButton: true,
      newestOnTop: true,
      tapToDismiss: true,
      positionClass: 'toast-top-center',
      timeOut: 2000
    }), provideAnimationsAsync()

    
  ]
};

// provideRouter(
    //   routes,
    //   withInMemoryScrolling({
    //     scrollPositionRestoration: 'enabled'
    //   }),
    //   withRouterConfig({ onSameUrlNavigation: 'reload'})
    // ),
    // { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
    // DatePipe
