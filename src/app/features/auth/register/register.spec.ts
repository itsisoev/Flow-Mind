import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink, UrlTree} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../../core/services/auth';
import {of, throwError} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {Register} from './register';
import {TranslateLoader, TranslateModule, TranslateService, TranslateStore} from '@ngx-translate/core';

describe('Register Component', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    const translateServiceMock = {
      currentLang: 'en',
      use: jasmine.createSpy('use').and.returnValue(of('en')),
      get: jasmine.createSpy('get').and.returnValue(of({})),
      instant: jasmine.createSpy('instant').and.returnValue(''),
      onLangChange: of({ lang: 'en', translations: {} }),
      onTranslationChange: of({ translations: {} }),
      onDefaultLangChange: of({ lang: 'en', translations: {} }),
    };


    await TestBed.configureTestingModule({
      imports: [
        Register,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useValue: { getTranslation: () => of({}) } }
        }),
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
        {provide: TranslateService, useValue: translateServiceMock},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
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

  it('should call AuthService.register on valid form submission', fakeAsync(() => {
    const fakeResponse = {
      message: 'Регистрация прошла успешно',
      token: 'token',
      user: {uuid: '1', username: 'newuser'}
    };
    authServiceSpy.register.and.returnValue(of(fakeResponse));

    component.authForm.setValue({username: 'newuser', password: '1234'});
    component.onSubmit();

    tick();

    expect(toastrSpy.success).toHaveBeenCalledWith('Регистрация прошла успешно', 'Успех');
    expect(component.isLoading()).toBeFalse();
  }));

  it('should show error toastr on registration error', fakeAsync(() => {
    const errorResponse = {error: {message: 'Имя уже занято'}};
    authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.authForm.setValue({username: 'existing', password: 'pass'});
    component.onSubmit();

    tick();

    expect(toastrSpy.error).toHaveBeenCalledWith('Имя уже занято', 'Ошибка');
    expect(component.isLoading()).toBeFalse();
  }));
});
