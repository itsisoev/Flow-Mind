import {inject, Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {catchError, Observable, of, tap, throwError} from 'rxjs';
import {IAuth, IDecodedToken} from '../../shared/models/auth.model';
import {IUser} from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly jwtHelper = inject(JwtHelperService)
  userId = signal<string>('');
  userData = signal<IUser | null>(null);
  access_token = signal<string>('');
  isLoggedIn = signal<boolean>(false);
  readonly baseAPI = environment.baseAPI;

  constructor() {
    this.checkToken();
  }

  clearToken(): void {
    this.access_token.set('');
    this.isLoggedIn.set(false);
    this.userId.set('');
    this.userData.set(null);
    localStorage.removeItem('access_token');
  }

  register(data: { username: string; password: string }): Observable<IAuth | null> {
    return this.http.post<IAuth>(`${this.baseAPI}users`, data).pipe(
      tap((res) => this.handleAuthentication(res)),
      catchError((err) => {
        console.error('Registration error', err);
        return throwError(() => err);
      })
    );
  }

  login(data: { username: string; password: string }): Observable<IAuth | null> {
    return this.http.post<IAuth>(`${this.baseAPI}auth/login`, data).pipe(
      tap((res) => {
        if (res && res.token) {
          localStorage.setItem('access_token', res.token);
          this.access_token.set(res.token);
          this.isLoggedIn.set(true);
          this.validateToken();
        } else {
          console.error('No token received');
        }
      }),
      catchError((err) => {
        console.error('Login error', err);
        return throwError(() => err);
      })
    );
  }

  getUserById(userId: string): Observable<IUser | null> {
    if (!userId) {
      return of(null);
    }

    return this.http.get<IUser>(`${this.baseAPI}auth/${userId}`).pipe(
      catchError((err) => {
        console.error('Get user by ID error', err);
        return of(null);
      })
    );
  }

  private checkToken(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.access_token.set(token);
      this.validateToken();
    }
  }

  private validateToken(): void {
    const token = this.access_token();
    if (!token) {
      this.clearToken();
      return;
    }

    const isExpired = this.jwtHelper.isTokenExpired(token);
    if (!isExpired) {
      const decodedToken = this.jwtHelper.decodeToken<IDecodedToken>(token);
      this.userId.set(decodedToken?.uuid || '');
      this.isLoggedIn.set(true);
    } else {
      this.clearToken();
    }
  }

  private handleAuthentication(res: IAuth): void {
    if (res && res.token && res.user.uuid) {
      localStorage.setItem('access_token', res.token);
      this.access_token.set(res.token);
      this.userId.set(res.user.uuid);
      this.isLoggedIn.set(true);
    } else {
      this.clearToken();
      throw new Error('Invalid authentication response');
    }
  }
}
