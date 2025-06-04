import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth';
import { IAuth } from '../../shared/models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let jwtHelper: JwtHelperService;

  const mockJwtHelper = {
    isTokenExpired: jasmine.createSpy('isTokenExpired'),
    decodeToken: jasmine.createSpy('decodeToken'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: JwtHelperService, useValue: mockJwtHelper }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    jwtHelper = TestBed.inject(JwtHelperService);
  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
    mockJwtHelper.isTokenExpired.calls.reset();
    mockJwtHelper.decodeToken.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token', (done) => {
    const mockResponse: IAuth = {
      message: 'OK',
      token: 'mockToken',
      user: {
        uuid: '123',
        username: 'test'
      }
    };

    service.login({ username: 'test', password: '123' }).subscribe(() => {
      expect(localStorage.getItem('access_token')).toBe('mockToken');
      expect(service.access_token()).toBe('mockToken');
      expect(service.isLoggedIn()).toBeTrue();
      done();
    });

    const req = httpMock.expectOne(`${service.baseAPI}auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });


  it('should register and call handleAuthentication', () => {
    const mockResponse: IAuth = {
      message: 'OK',
      token: 'mockToken',
      user: {
        uuid: 'user-uuid',
        username: 'newuser'
      }
    };

    service.register({ username: 'newuser', password: '123' }).subscribe();

    const req = httpMock.expectOne(`${service.baseAPI}users`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.access_token()).toBe('mockToken');
    expect(service.userId()).toBe('user-uuid');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should clear token', () => {
    localStorage.setItem('access_token', 'token');
    service.clearToken();

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(service.access_token()).toBe('');
    expect(service.isLoggedIn()).toBe(false);
    expect(service.userData()).toBeNull();
  });

  it('should validate token if not expired', () => {
    localStorage.setItem('access_token', 'validToken');
    mockJwtHelper.isTokenExpired.and.returnValue(false);
    mockJwtHelper.decodeToken.and.returnValue({ uuid: 'valid-id', username: 'john' });

    (service as any).checkToken();

    expect(service.access_token()).toBe('validToken');
    expect(service.userId()).toBe('valid-id');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should clear token if expired', () => {
    localStorage.setItem('access_token', 'expiredToken');
    mockJwtHelper.isTokenExpired.and.returnValue(true);

    (service as any).checkToken();

    expect(service.access_token()).toBe('');
    expect(service.isLoggedIn()).toBe(false);
  });
});
