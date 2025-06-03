import {ThemeService} from './theme';

describe('ThemeService', () => {
  let service : ThemeService;

  beforeEach(() => {
    service = new ThemeService();
    document.body.classList.remove('dark-theme');
  })

  it('should have light mode by default', () => {
    expect(service.isDarkMode()).toBeFalse();
    expect(document.body.classList.contains('dark-theme')).toBeFalse();
  });

  it('should toggle to dark mode', () => {
    service.toggleTheme();

    expect(service.isDarkMode()).toBeTrue();
    expect(document.body.classList.contains('dark-theme')).toBeTrue();
  });


  it('should toggle back to light mode', () => {
    service.toggleTheme();
    service.toggleTheme();

    expect(service.isDarkMode()).toBeFalse();
    expect(document.body.classList.contains('dark-theme')).toBeFalse();
  });
})
