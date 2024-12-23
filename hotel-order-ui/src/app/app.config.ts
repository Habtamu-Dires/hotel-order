import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import {provideToastr} from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { httpTokenInterceptor } from './services/interceptor/http-token.interceptor';
import { ApiConfigService } from './services/ApiConfig/api-config.service';

declare var window: any;

export function initializeApiConfig(apiConfig: ApiConfigService): () => void {
  return () => {
    apiConfig.rootUrl = window.API_URL || 'http://localhost:8088/api/v1';
    console.log('API rootUrl set to:', window.API_URL);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpTokenInterceptor])
    ),
    {
      provide:APP_INITIALIZER,
      useFactory:initializeApiConfig,
      deps:[ApiConfigService],
      multi:true
    },
    provideAnimations(),
    provideToastr({
      progressBar:true, 
      closeButton: true,
      newestOnTop: true,
      tapToDismiss: true,
      positionClass: 'toast-top-center',
      timeOut: 2000
    }),
    provideAnimationsAsync()
  ]
};

