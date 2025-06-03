import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ThemeToggle} from './theme-toggle';

describe('ThemeToggle Component', () => {
  let fixture: ComponentFixture<ThemeToggle>;
  let component: ThemeToggle;

  const STORAGE_KEY = 'dark-mode';

  beforeEach(async () => {
    localStorage.clear();
    document.body.className = '';

    await TestBed.configureTestingModule({
      imports: [ThemeToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with system preference if no localStorage key', () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    expect(component.isDarkMode()).toBe(prefersDark);
    expect(document.body.classList.contains('dark-theme')).toBe(prefersDark);
  });

  it('should toggle theme and update localStorage and body class', () => {
    const initial = component.isDarkMode();
    component.toggleTheme();
    const updated = component.isDarkMode();

    expect(updated).toBe(!initial);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(updated));
    expect(document.body.classList.contains('dark-theme')).toBe(updated);
  });

  it('should respect stored theme in localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    const newFixture = TestBed.createComponent(ThemeToggle);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.isDarkMode()).toBeTrue();
    expect(document.body.classList.contains('dark-theme')).toBeTrue();
  });
});
