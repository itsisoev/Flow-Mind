import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Sidebar} from './sidebar';
import {ThemeToggle} from '../theme-toggle/theme-toggle';
import {Translation} from '../translation/translation';
import {HttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule, TranslateService, TranslateStore} from '@ngx-translate/core';
import {createTranslateLoader} from '../../core/services/translate';
import {of} from 'rxjs';

describe('Sidebar Component', () => {
  let fixture: ComponentFixture<Sidebar>;
  let component: Sidebar;

  const translateServiceMock = {
    currentLang: 'en',
    use: jasmine.createSpy('use').and.returnValue(of('en')),
    get: jasmine.createSpy('get').and.returnValue(of({})),
    instant: jasmine.createSpy('instant').and.returnValue(''),
    onLangChange: of({ lang: 'en', translations: {} }),
    onTranslationChange: of({ translations: {} }),
    onDefaultLangChange: of({ lang: 'en', translations: {} }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar, ThemeToggle, Translation,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useValue: { getTranslation: () => of({}) } }
        }),
      ],
      providers: [
        {provide: TranslateService, useValue: translateServiceMock},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should have as sidebarOpen false by default', () => {
    expect(component).toBeTruthy();
  })

  it('should have sidebarOpen false by default', () => {
    expect(component.isSidebarOpen).toBeFalse();
  });

  it('should toggle sidebarOpen to true', () => {
    component.toggleSidebar();
    expect(component.isSidebarOpen).toBeTrue();
  });

  it('should toggle sidebarOpen back to false after two toggles', () => {
    component.toggleSidebar();
    component.toggleSidebar();
    expect(component.isSidebarOpen).toBeFalse();
  });
})
