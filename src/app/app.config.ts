import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, ErrorHandler } from '@angular/core';
import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { GlobalErrorHandlerService } from './error-handler.service';
import { CacheReferenceService } from './services/cache-reference.service';
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: CacheReferenceService, useClass: CacheReferenceService },
    importProvidersFrom([BrowserAnimationsModule, HttpClientModule]),
    MessageService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
        providePrimeNG({
            theme: {
                preset: Aura
            }
        }),
        {
          provide: ErrorHandler,
          useClass: GlobalErrorHandlerService,
        },
  ],
};


