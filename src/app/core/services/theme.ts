import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDark = signal<boolean>(false);

  toggleTheme(): void {
    const newValue = !this.isDark();
    this.isDark.set(newValue);
    document.body.classList.toggle('dark-theme', newValue);
  }

  isDarkMode = this.isDark.asReadonly();
}
