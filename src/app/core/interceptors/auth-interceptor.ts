import {inject} from '@angular/core';
import {HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {tap} from 'rxjs';
import {AuthService} from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.access_token();
  let authReq = req;

  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(authReq).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          console.log('Response received');
        }
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          console.warn('Unauthorized, redirecting to login');
          router.navigate(['/auth/login']);
        }
      }
    })
  );
};
