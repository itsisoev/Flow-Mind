import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideToastr} from 'ngx-toastr';
import {authInterceptor} from './core/interceptors/auth-interceptor';
import {JWT_OPTIONS, JwtHelperService} from '@auth0/angular-jwt';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {createTranslateLoader} from './core/services/translate';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: JWT_OPTIONS, useValue: {
        headerName: 'Authorization',
        authScheme: 'Bearer ',
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000'],
      }
    },
    JwtHelperService,
    provideAnimations(),
    provideToastr({
      timeOut: 4000,
      preventDuplicates: true,
    }),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
  ]
};
