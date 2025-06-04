import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {Login} from './login';
import {ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router, UrlTree} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../../core/services/auth';
import {of, throwError} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        Login,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
        {provide: ToastrService, useValue: toastrSpy},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {queryParams: {}},
            queryParams: of({}),
          }
        },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as invalid if fields are empty', () => {
    component.authForm.setValue({username: '', password: ''});
    expect(component.authForm.valid).toBeFalse();
  });

  it('should call AuthService.login on valid form submission', fakeAsync(() => {
    const fakeResponse = {
      message: 'Login success',
      token: '123',
      user: {uuid: '1', username: 'admin'}
    };
    authServiceSpy.login.and.returnValue(of(fakeResponse));

    component.authForm.setValue({username: 'admin', password: '1234'});
    component.onSubmit();

    tick();

    expect(toastrSpy.success).toHaveBeenCalledWith('Login success', 'Успех');
    expect(component.isLoading()).toBeFalse();
  }));

  it('should show error toastr on login error', fakeAsync(() => {
    const errorResponse = {error: {message: 'Неверный логин или пароль'}};
    authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.authForm.setValue({username: 'admin', password: 'wrong'});
    component.onSubmit();

    tick();

    expect(toastrSpy.error).toHaveBeenCalledWith('Неверный логин или пароль', 'Ошибка');
    expect(component.isLoading()).toBeFalse();
  }));
});
